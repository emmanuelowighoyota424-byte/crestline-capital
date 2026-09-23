import { NextRequest, NextResponse } from 'next/server'
import { POST as persistentAuthPOST } from '@/app/api/auth/route'
import { CUSTOMER_SESSION_COOKIE, CUSTOMER_SESSION_HEADER, clearedCustomerSessionCookieOptions, getCustomerSessionFromRequest } from '@/lib/customer/session'
function noStore(body:unknown,init?:ResponseInit){const response=NextResponse.json(body,init);response.headers.set('Cache-Control','no-store');return response}
function secureRequest(request:NextRequest){return request.headers.get('x-forwarded-proto')?.split(',')[0].trim()==='https'||request.url.startsWith('https:')}
export async function GET(request:NextRequest){const session=getCustomerSessionFromRequest(request);if(!session)return noStore({authenticated:false,customer:null});return noStore({authenticated:true,customer:{id:session.customerId,name:session.name,email:session.email},expiresAt:session.expiresAt})}
export async function POST(request:NextRequest){let body:any;try{body=await request.clone().json()}catch{return noStore({error:'Invalid request'},{status:400})}if(String(body.action??'')==='logout'){const response=noStore({authenticated:false});response.cookies.set(CUSTOMER_SESSION_COOKIE,'',clearedCustomerSessionCookieOptions(secureRequest(request)));return response}return persistentAuthPOST(request)}
export { CUSTOMER_SESSION_HEADER }
