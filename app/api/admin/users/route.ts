import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAdminSessionWithPermission } from '@/lib/admin/request-session'

export async function GET(request: NextRequest) {
  const session = getAdminSessionWithPermission(request, 'users.read')
  if (!session) return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
  try {
    const users = await prisma.user.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, select: { id:true,email:true,firstName:true,lastName:true,phone:true,role:true,kycStatus:true,isActive:true,twoFactorEnabled:true,createdAt:true,lastLoginAt:true,accounts:{select:{id:true,accountNumber:true,type:true,status:true,currency:true,balance:true,availableBalance:true}} } })
    return NextResponse.json({ success:true, users, total:users.length })
  } catch (error) { console.error('[admin/users] GET failed',error); return NextResponse.json({error:'Failed to fetch users'},{status:500}) }
}

export async function POST(request: NextRequest) {
  const session = getAdminSessionWithPermission(request, 'users.update')
  if (!session) return NextResponse.json({error:'Unauthorized - Admin access required'},{status:401})
  try {
    const body=await request.json(); const action=String(body.action??''); const userId=String(body.userId??'')
    if(action==='get-new-users'){
      const since=new Date(Date.now()-24*60*60*1000)
      const users=await prisma.user.findMany({where:{createdAt:{gt:since},deletedAt:null},orderBy:{createdAt:'desc'},select:{id:true,email:true,firstName:true,lastName:true,createdAt:true,accounts:{select:{id:true,accountNumber:true,balance:true,type:true}}}})
      return NextResponse.json({success:true,newUsers:users,total:users.length})
    }
    if(action==='get-pending-transfers'){
      const transfers=await prisma.adminTransfer.findMany({where:{status:'pending'},orderBy:{created_at:'desc'},take:100})
      return NextResponse.json({success:true,transfers,total:transfers.length})
    }
    if(!userId)return NextResponse.json({error:'userId is required'},{status:400})
    const user=await prisma.user.findUnique({where:{id:userId},include:{accounts:true}})
    if(!user||user.deletedAt)return NextResponse.json({error:'Customer not found'},{status:404})

    if(action==='block'||action==='unblock'){
      if(!getAdminSessionWithPermission(request,'users.block'))return NextResponse.json({error:'Permission denied'},{status:403})
      const isActive=action==='unblock'
      await prisma.$transaction(async tx=>{
        await tx.user.update({where:{id:userId},data:{isActive}})
        await tx.userProfile.updateMany({where:{id:userId},data:{status:isActive?'active':'blocked'}})
        await tx.auditLog.create({data:{userId:null,action:`ADMIN_${action.toUpperCase()}_CUSTOMER`,entityType:'User',entityId:userId,description:`${action} customer ${user.email}`,metadata:{adminId:session.adminId,targetUserId:userId}}})
      })
      return NextResponse.json({success:true,userId,isActive})
    }

    if(action==='set-role'){
      const role=String(body.role??'').toUpperCase(); const allowed=['CUSTOMER','SUPPORT','COMPLIANCE','ADMIN','SUPER_ADMIN']
      if(!allowed.includes(role))return NextResponse.json({error:'Invalid role'},{status:400})
      const updated=await prisma.user.update({where:{id:userId},data:{role:role as any}})
      await prisma.auditLog.create({data:{userId:null,action:'ADMIN_SET_CUSTOMER_ROLE',entityType:'User',entityId:userId,description:`Changed ${user.email} role to ${role}`,metadata:{adminId:session.adminId,role}}})
      return NextResponse.json({success:true,user:{id:updated.id,role:updated.role}})
    }

    if(action==='adjust-balance'){
      let amount:Prisma.Decimal
      try{amount=new Prisma.Decimal(String(body.amount??''))}catch{return NextResponse.json({error:'Invalid adjustment amount'},{status:400})}
      if(!amount.isFinite()||amount.isZero())return NextResponse.json({error:'Enter a non-zero balance adjustment'},{status:400})
      const accountId=String(body.accountId??user.accounts[0]?.id??''); const account=user.accounts.find(a=>a.id===accountId)
      if(!account)return NextResponse.json({error:'Customer account not found'},{status:404})
      const nextBalance=new Prisma.Decimal(account.balance).plus(amount),nextAvailable=new Prisma.Decimal(account.availableBalance).plus(amount)
      if(nextBalance.isNegative()||nextAvailable.isNegative())return NextResponse.json({error:'Adjustment would make the account balance negative'},{status:400})
      const reference=`ADM-${Date.now()}-${cryptoRandom()}`
      await prisma.$transaction(async tx=>{
        await tx.account.update({where:{id:account.id},data:{balance:nextBalance,availableBalance:nextAvailable}})
        await tx.accountRecord.updateMany({where:{user_id:userId,account_number:account.accountNumber},data:{balance:nextBalance,available_balance:nextAvailable}})
        await tx.transaction.create({data:{userId,accountId:account.id,type:amount.isPositive()?'DEPOSIT':'WITHDRAWAL',status:'COMPLETED',amount:amount.abs(),currency:account.currency,reference,description:String(body.description??'Administrative balance adjustment'),completedAt:new Date()}})
        await tx.auditLog.create({data:{userId:null,action:'ADMIN_BALANCE_ADJUSTMENT',entityType:'Account',entityId:account.id,description:`Administrative balance adjustment for ${user.email}`,metadata:{adminId:session.adminId,amount:amount.toString(),reference}}})
      })
      return NextResponse.json({success:true,accountId:account.id,balance:nextBalance.toString(),availableBalance:nextAvailable.toString(),reference})
    }
    return NextResponse.json({error:'Invalid action'},{status:400})
  }catch(error:any){console.error('[admin/users] POST failed',error);return NextResponse.json({error:error?.message||'Failed to process request'},{status:500})}
}
function cryptoRandom(){return Math.random().toString(36).slice(2,10).toUpperCase()}
