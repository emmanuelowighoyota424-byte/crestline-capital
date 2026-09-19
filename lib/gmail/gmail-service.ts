'use client'

export interface GmailHeader {
  name: string
  value: string
}

export interface GmailMessagePart {
  partId: string
  mimeType: string
  filename: string
  headers: GmailHeader[]
  body: {
    size: number
    data?: string
  }
  parts?: GmailMessagePart[]
}

export interface GmailRawMessage {
  id: string
  threadId: string
  labelIds?: string[]
  snippet: string
  historyId?: string
  internalDate: string
  payload?: {
    partId?: string
    mimeType: string
    filename?: string
    headers: GmailHeader[]
    body?: {
      size: number
      data?: string
    }
    parts?: GmailMessagePart[]
  }
  sizeEstimate?: number
}

export interface ParsedEmail {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  subject: string
  from: string
  to: string
  date: string
  timestamp: number
  bodyHtml: string
  bodyPlain: string
  isUnread: boolean
  isStarred: boolean
  isImportant: boolean
}

export interface GmailLabel {
  id: string
  name: string
  type: string
  messagesTotal?: number
  messagesUnread?: number
}

export interface SendEmailPayload {
  to: string
  subject: string
  bodyHtml: string
  cc?: string
  bcc?: string
  inReplyTo?: string
  threadId?: string
}

// Decode base64url string safely in browser
export function decodeBase64Url(base64UrlStr: string): string {
  try {
    const base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/')
    const decodedBinary = atob(base64)
    const bytes = Uint8Array.from(decodedBinary, (c) => c.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    try {
      return atob(base64UrlStr.replace(/-/g, '+').replace(/_/g, '/'))
    } catch {
      return ''
    }
  }
}

// Encode UTF-8 string to base64url for RFC 2822 raw transmission
export function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function extractBodyContent(payload?: GmailRawMessage['payload']): {
  html: string
  plain: string
} {
  let html = ''
  let plain = ''

  if (!payload) return { html, plain }

  const traverse = (part: GmailMessagePart | GmailRawMessage['payload']) => {
    if (!part) return

    if (part.mimeType === 'text/html' && part.body?.data) {
      html += decodeBase64Url(part.body.data)
    } else if (part.mimeType === 'text/plain' && part.body?.data) {
      plain += decodeBase64Url(part.body.data)
    }

    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(traverse)
    }
  }

  traverse(payload)

  if (!html && payload.body?.data && payload.mimeType === 'text/html') {
    html = decodeBase64Url(payload.body.data)
  }
  if (!plain && payload.body?.data && payload.mimeType === 'text/plain') {
    plain = decodeBase64Url(payload.body.data)
  }

  return { html, plain }
}

export function parseGmailMessage(msg: GmailRawMessage): ParsedEmail {
  const headers = msg.payload?.headers || []
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

  const subject = getHeader('subject') || '(No Subject)'
  const from = getHeader('from') || 'Unknown Sender'
  const to = getHeader('to') || ''
  const date = getHeader('date') || ''
  const timestamp = parseInt(msg.internalDate || '0', 10) || Date.now()

  const { html, plain } = extractBodyContent(msg.payload)
  const labels = msg.labelIds || []

  return {
    id: msg.id,
    threadId: msg.threadId,
    labelIds: labels,
    snippet: msg.snippet || '',
    subject,
    from,
    to,
    date,
    timestamp,
    bodyHtml: html,
    bodyPlain: plain || msg.snippet || '',
    isUnread: labels.includes('UNREAD'),
    isStarred: labels.includes('STARRED'),
    isImportant: labels.includes('IMPORTANT'),
  }
}

export class GmailService {
  private static baseUrl = 'https://gmail.googleapis.com/gmail/v1/users/me'

  static async listLabels(accessToken: string): Promise<GmailLabel[]> {
    const res = await fetch(`${this.baseUrl}/labels`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to load Gmail labels: ${err}`)
    }
    const data = await res.json()
    return data.labels || []
  }

  static async listMessages(
    accessToken: string,
    options: {
      query?: string
      maxResults?: number
      pageToken?: string
      labelIds?: string[]
    } = {}
  ): Promise<{
    messages: { id: string; threadId: string }[]
    nextPageToken?: string
    resultSizeEstimate?: number
  }> {
    const params = new URLSearchParams()
    if (options.query) params.set('q', options.query)
    if (options.maxResults) params.set('maxResults', options.maxResults.toString())
    if (options.pageToken) params.set('pageToken', options.pageToken)
    if (options.labelIds && options.labelIds.length > 0) {
      options.labelIds.forEach((l) => params.append('labelIds', l))
    }

    const res = await fetch(`${this.baseUrl}/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to fetch messages: ${err}`)
    }

    return await res.json()
  }

  static async getMessage(accessToken: string, messageId: string): Promise<ParsedEmail> {
    const res = await fetch(`${this.baseUrl}/messages/${messageId}?format=full`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to fetch message details [${messageId}]: ${err}`)
    }

    const rawMsg: GmailRawMessage = await res.json()
    return parseGmailMessage(rawMsg)
  }

  static async batchGetMessages(accessToken: string, messageIds: string[]): Promise<ParsedEmail[]> {
    const promises = messageIds.map((id) =>
      this.getMessage(accessToken, id).catch((err) => {
        console.warn(`Failed to load message ${id}:`, err)
        return null
      })
    )
    const results = await Promise.all(promises)
    return results.filter((m): m is ParsedEmail => m !== null)
  }

  static async sendEmail(
    accessToken: string,
    payload: SendEmailPayload,
    userEmail?: string
  ): Promise<{ id: string; threadId: string }> {
    const boundary = `====_Crestline_Boundary_${Date.now()}====`
    const rawLines = [
      `To: ${payload.to}`,
      userEmail ? `From: ${userEmail}` : '',
      payload.cc ? `Cc: ${payload.cc}` : '',
      payload.bcc ? `Bcc: ${payload.bcc}` : '',
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
      payload.inReplyTo ? `In-Reply-To: ${payload.inReplyTo}` : '',
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      payload.bodyHtml.replace(/<[^>]*>?/gm, ''),
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      payload.bodyHtml,
      '',
      `--${boundary}--`,
    ].filter((line) => line !== '')

    const rawMessage = encodeBase64Url(rawLines.join('\r\n'))

    const body: { raw: string; threadId?: string } = { raw: rawMessage }
    if (payload.threadId) {
      body.threadId = payload.threadId
    }

    const res = await fetch(`${this.baseUrl}/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to send email: ${err}`)
    }

    return await res.json()
  }

  static async modifyMessage(
    accessToken: string,
    messageId: string,
    addLabelIds: string[] = [],
    removeLabelIds: string[] = []
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/messages/${messageId}/modify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addLabelIds, removeLabelIds }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to modify labels for [${messageId}]: ${err}`)
    }
  }

  static async trashMessage(accessToken: string, messageId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/messages/${messageId}/trash`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to trash message [${messageId}]: ${err}`)
    }
  }

  static async untrashMessage(accessToken: string, messageId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/messages/${messageId}/untrash`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to untrash message [${messageId}]: ${err}`)
    }
  }

  static async deleteMessage(accessToken: string, messageId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/messages/${messageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to permanently delete message [${messageId}]: ${err}`)
    }
  }
}
