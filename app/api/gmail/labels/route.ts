import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization header with Bearer token' }, { status: 401 })
    }

    const googleRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: { Authorization: token },
    })

    if (!googleRes.ok) {
      const err = await googleRes.text()
      return NextResponse.json({ error: `Gmail Labels error: ${err}` }, { status: googleRes.status })
    }

    const data = await googleRes.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Gmail Labels API route] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
