import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePasswordStrength, verifyPassword } from '@/lib/auth/password-utils'
import { issueCustomerSessionToken } from '@/lib/customer/session'
import { verifyOTP } from '@/lib/auth/otp-service'
import { verifyTOTP } from '@/lib/auth/totp-service'

function accountNumber(): string { return `9${crypto.randomInt(100000000, 1000000000)}` }
async function uniqueAccountNumber(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const number = accountNumber()
    const [a,b] = await Promise.all([
      prisma.account.findUnique({ where: { accountNumber: number }, select: { id: true } }),
      prisma.accountRecord.findUnique({ where: { account_number: number }, select: { id: true } }),
    ])
    if (!a && !b) return number
  }
  throw new Error('Unable to allocate an account number')
}
function publicCustomer(user:any){ return { id:user.id, name:`${user.firstName} ${user.lastName}`.trim(), email:user.email } }
function sessionCustomer(user:any){ const name=`${user.firstName} ${user.lastName}`.trim(); return { id:user.id,name,email:user.email,username:user.firstName.toLowerCase(),phone:user.phone||undefined,createdAt:user.createdAt.getTime(),passwordHash:user.passwordHash,sandbox:false } }

export async function POST(request:NextRequest){
  try{
    const body=await request.json(); const action=String(body.action??'')
    if(action==='signup'||action==='register'){
      const name=String(body.name??'').trim(),email=String(body.email??'').trim().toLowerCase(),phone=String(body.phone??'').trim(),password=String(body.password??'')
      if(name.length<2)return NextResponse.json({error:'Enter your full name'},{status:400})
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return NextResponse.json({error:'Enter a valid email address'},{status:400})
      const strength=validatePasswordStrength(password);if(!strength.isStrong)return NextResponse.json({error:strength.errors[0]},{status:400})
      const [existing,legacy]=await Promise.all([prisma.user.findUnique({where:{email},select:{id:true}}),prisma.userProfile.findUnique({where:{email},select:{id:true}})])
      if(existing||legacy)return NextResponse.json({error:'An account with this email already exists. Sign in instead.'},{status:409})
      const passwordHash=await hashPassword(password),id=crypto.randomUUID(),number=await uniqueAccountNumber(),parts=name.split(/\s+/),firstName=parts.shift()||name,lastName=parts.join(' ')||firstName
      const user=await prisma.$transaction(async tx=>{
        const created=await tx.user.create({data:{id,email,passwordHash,firstName,lastName,phone:phone||null,role:'CUSTOMER',kycStatus:'PENDING',isActive:true}})
        await tx.account.create({data:{userId:id,accountNumber:number,type:'CHECKING',status:'ACTIVE',currency:'USD',balance:0,availableBalance:0}})
        await tx.userProfile.create({data:{id,email,name,password_hash:passwordHash,phone:phone||null,role:'user',status:'active'}})
        await tx.accountRecord.create({data:{user_id:id,name:'Total Checking',account_type:'checking',account_number:number,full_account_number:number,routing_number:'021000021',balance:0,available_balance:0,interest_rate:0.01,status:'active',currency:'USD'}})
        await tx.notificationRecord.create({data:{user_id:id,title:'Welcome to Crestline Capital!',message:`Your new checking account (****${number.slice(-4)}) has been created.`,type:'account',category:'account',data:{accountNumber:number,accountType:'checking'}}})
        return created
      })
      return NextResponse.json({authenticated:true,userId:user.id,customer:publicCustomer(user),sessionToken:issueCustomerSessionToken(sessionCustomer(user)),accountNumber:number},{status:201})
    }
    if(action==='login'){
      const identifier=String(body.identifier??body.email??'').trim().toLowerCase(),password=String(body.password??'')
      if(!identifier||!password)return NextResponse.json({error:'Enter your email and password'},{status:400})
      const user=await prisma.user.findFirst({where:{deletedAt:null,OR:[{email:identifier},{firstName:{equals:identifier,mode:'insensitive'}}]}})
      if(user){
        if(!user.isActive)return NextResponse.json({error:'Your account is currently blocked. Contact Crestline Capital support.'},{status:403})
        if(!(await verifyPassword(password,user.passwordHash)))return NextResponse.json({error:'Invalid email or password'},{status:401})
        await prisma.user.update({where:{id:user.id},data:{lastLoginAt:new Date()}})
        await prisma.loginHistory.create({data:{user_id:user.id,ip:request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),user_agent:request.headers.get('user-agent'),login_success:true}}).catch(()=>undefined)
        return NextResponse.json({authenticated:true,userId:user.id,customer:publicCustomer(user),sessionToken:issueCustomerSessionToken(sessionCustomer(user)),requiresOTP:false})
      }
      const legacy=await prisma.userProfile.findFirst({where:{OR:[{email:identifier},{name:{equals:identifier,mode:'insensitive'}}],status:{not:'deleted'}}})
      if(!legacy||!(await verifyPassword(password,legacy.password_hash)))return NextResponse.json({error:'Invalid email or password'},{status:401})
      const names=legacy.name.split(/\s+/),legacyUser={id:legacy.id,firstName:names[0]||legacy.name,lastName:names.slice(1).join(' ')||'',email:legacy.email,phone:legacy.phone,passwordHash:legacy.password_hash,createdAt:legacy.created_at}
      return NextResponse.json({authenticated:true,userId:legacy.id,customer:{id:legacy.id,name:legacy.name,email:legacy.email},sessionToken:issueCustomerSessionToken({...legacyUser,username:legacyUser.firstName.toLowerCase(),sandbox:false})})
    }
    if(action==='verify-otp'){
      const userId=String(body.userId??''),otp=String(body.otp??'');if(!verifyOTP(userId,otp))return NextResponse.json({error:'Invalid or expired OTP'},{status:401})
      const user=await prisma.user.findUnique({where:{id:userId}});if(!user||!user.isActive)return NextResponse.json({error:'Account unavailable'},{status:403})
      await prisma.user.update({where:{id:userId},data:{lastLoginAt:new Date()}});return NextResponse.json({authenticated:true,userId,customer:publicCustomer(user),sessionToken:issueCustomerSessionToken(sessionCustomer(user))})
    }
    if(action==='verify-totp'){
      const userId=String(body.userId??''),otp=String(body.otp??''),user=await prisma.user.findUnique({where:{id:userId}})
      if(!user?.twoFactorSecret||!verifyTOTP(user.twoFactorSecret,otp))return NextResponse.json({error:'Invalid TOTP code'},{status:401})
      await prisma.user.update({where:{id:userId},data:{lastLoginAt:new Date()}});return NextResponse.json({authenticated:true,userId,customer:publicCustomer(user),sessionToken:issueCustomerSessionToken(sessionCustomer(user))})
    }
    return NextResponse.json({error:'Invalid action'},{status:400})
  }catch(error){ console.error('[auth] error',error);return NextResponse.json({error:'Authentication failed'},{status:500}) }
}
