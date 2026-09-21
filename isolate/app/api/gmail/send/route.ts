import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization header with Bearer token' }, { status: 401 })
    }

    const body = await req.json()

    const googleRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!googleRes.ok) {
      const err = await googleRes.text()
      return NextResponse.json({ error: `Gmail Send error: ${err}` }, { status: googleRes.status })
    }

    const data = await googleRes.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Gmail Send API route] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
