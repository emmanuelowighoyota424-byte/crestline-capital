/**
 * Resend integration - the single place transactional email leaves the app.
 *
 * Configuration:
 *   RESEND_API_KEY     required; enables live sending
 *   RESEND_FROM_EMAIL  optional; default sender, e.g. "Crestline Capital <mail@yourdomain.com>"
 *   RESEND_REPLY_TO    optional; default Reply-To address
 *
 * Two things matter here:
 *  - The Resend client is created lazily. Building it at module scope throws when
 *    the API key is absent, which previously crashed every route that imported an
 *    email helper.
 *  - The sender address comes from configuration. Until a domain is verified in
 *    Resend, only `onboarding@resend.dev` is accepted and it delivers solely to the
 *    account owner's own address.
 */

import { Resend } from 'resend'

/** Resend's sandbox sender - works before a custom domain is verified. */
export const RESEND_SANDBOX_FROM = 'Crestline Capital <onboarding@resend.dev>'

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

export function resendFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || RESEND_SANDBOX_FROM
}

export function resendReplyTo(): string | undefined {
  return process.env.RESEND_REPLY_TO?.trim() || undefined
}

let client: Resend | null = null

/** The shared Resend client, created on first use. */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  if (!client) {
    client = new Resend(apiKey)
  }
  return client
}

export interface SendEmailInput {
  to: string | string[]
  subject: string
  html: string
  text?: string
  /** Overrides the configured default sender. */
  from?: string
  /** Overrides the configured default Reply-To. */
  replyTo?: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
  /** True when nothing was attempted because RESEND_API_KEY is absent. */
  skipped?: boolean
  timestamp: Date
}

/**
 * Send one transactional email.
 *
 * Never throws: failures come back as `{ success: false, error }` so callers can
 * report an honest outcome instead of claiming the email was delivered.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const timestamp = new Date()

  if (!isResendConfigured()) {
    return {
      success: false,
      skipped: true,
      error: 'RESEND_API_KEY is not configured - email was not sent',
      timestamp,
    }
  }

  const replyTo = input.replyTo?.trim() || resendReplyTo()

  try {
    const response = await getResendClient().emails.send({
      from: input.from?.trim() || resendFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
      // Resend expects `reply_to`; a `replyTo` option is silently ignored.
      ...(replyTo ? { reply_to: replyTo } : {}),
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return { success: true, messageId: response.data?.id, timestamp }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send email'
    console.error('[Resend] send failed:', message)
    return { success: false, error: message, timestamp }
  }
}

/** Provider status for health checks and diagnostics. Never exposes the key. */
export function resendStatus() {
  const configured = isResendConfigured()
  return {
    provider: 'resend',
    configured,
    mode: configured ? ('live' as const) : ('not_configured' as const),
    from: resendFromAddress(),
    usingSandboxSender: !process.env.RESEND_FROM_EMAIL?.trim(),
  }
}
