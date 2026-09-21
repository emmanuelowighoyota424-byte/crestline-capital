'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { User } from 'firebase/auth'
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  setCachedAccessToken,
} from '@/lib/gmail/gmail-auth'
import {
  GmailService,
  ParsedEmail,
  SendEmailPayload,
} from '@/lib/gmail/gmail-service'
import { GoogleSignInButton } from '@/components/gmail/google-sign-in-button'
import {
  Mail,
  Inbox,
  Star,
  Send,
  FileText,
  Trash2,
  RefreshCw,
  Search,
  PenSquare,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowLeft,
  Reply,
  Forward,
  ShieldCheck,
  ExternalLink,
  LogOut,
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  Columns,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Filter,
  Sparkles,
  Paperclip,
  Calendar,
  Lock,
} from 'lucide-react'

const QUICK_TEMPLATES = [
  {
    title: 'Wire Transfer Confirmation Advice',
    subject: 'Crestline Capital: Outgoing Wire Transfer Execution Advice',
    body: `<p>Dear Valued Client,</p>
<p>Please be advised that your domestic wire transfer instruction has been accepted by the Federal Reserve Fedwire funds service.</p>
<ul>
  <li><strong>Originating Account:</strong> Private Treasury Checking (*4821)</li>
  <li><strong>Amount:</strong> $250,000.00 USD</li>
  <li><strong>Execution Status:</strong> SETTLED / FINAL</li>
  <li><strong>IMAD Reference:</strong> 20260919MMQF001C002891</li>
</ul>
<p>If you have any questions, please contact your private wealth banker.</p>
<p>Sincerely,<br/><strong>Crestline Capital Wire Operations & Treasury Services</strong></p>`,
  },
  {
    title: 'Account Balance & Portfolio Audit Statement',
    subject: 'Official Monthly Account Balance & Sweep Statement',
    body: `<p>To Whom It May Concern,</p>
<p>Attached is the verified ledger statement for the designated institutional deposit accounts maintained at Crestline Capital.</p>
<p>All deposits are insured up to statutory limits and held in air-gapped sovereign liquidity reserves.</p>
<p>Warm regards,<br/><strong>Crestline Capital Private Wealth Management</strong></p>`,
  },
  {
    title: 'KYC & Beneficial Ownership Document Submission',
    subject: 'AML / CIP Verification Documentation - Crestline Institutional',
    body: `<p>Compliance & Diligence Department,</p>
<p>Please find submitted herewith our updated Corporate Entity Resolution and Beneficial Ownership certification for annual regulatory review.</p>
<p>Thank you,<br/><strong>Compliance & Treasury Officer</strong></p>`,
  },
  {
    title: 'Security Advisory: New Device Authorization',
    subject: 'Security Alert: New Sign-In Recognized on Your Account',
    body: `<p>Security Alert Notification,</p>
<p>An authorized cryptographic access token was issued for your account. If you initiated this session, no further action is necessary. If this was not you, please contact the fraud hotline immediately.</p>
<p><strong>Crestline Capital Information Security Desk</strong></p>`,
  },
]

interface GmailClientProps {
  embedded?: boolean
  initialViewMode?: 'split' | 'list'
  className?: string
  defaultHeight?: string
}

export default function GmailClient({
  embedded = false,
  initialViewMode = 'split',
  className = '',
  defaultHeight = 'min-h-[680px]',
}: GmailClientProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Layout & View State
  const [viewMode, setViewMode] = useState<'split' | 'list'>(initialViewMode)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [activeFolder, setActiveFolder] = useState<'INBOX' | 'STARRED' | 'SENT' | 'DRAFT' | 'TRASH'>('INBOX')
  const [filterType, setFilterType] = useState<'ALL' | 'UNREAD' | 'STARRED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<ParsedEmail[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ParsedEmail | null>(null)
  const [copiedRawText, setCopiedRawText] = useState(false)

  // Inline Quick Reply state
  const [inlineReplyText, setInlineReplyText] = useState('')
  const [isSendingInlineReply, setIsSendingInlineReply] = useState(false)

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeCc, setComposeCc] = useState('')
  const [composeBcc, setComposeBcc] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Confirmation Modal State (MANDATORY per Workspace Skill for Mutating Actions)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'send_email' | 'trash_email' | 'delete_email'
    title: string
    description: string
    onConfirm: () => Promise<void>
  } | null>(null)

  const [notificationBanner, setNotificationBanner] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationBanner({ text, type })
    setTimeout(() => setNotificationBanner(null), 5000)
  }

  // Auth Initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user)
        setAccessToken(token)
      },
      () => {
        setCurrentUser(null)
        setAccessToken(null)
      }
    )
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    setIsAuthenticating(true)
    setAuthError(null)
    try {
      const result = await googleSignIn()
      if (result) {
        setCurrentUser(result.user)
        setAccessToken(result.accessToken)
        showNotification(`Connected as ${result.user.email} with full Gmail access!`)
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err)
      setAuthError(err.message || 'Failed to authenticate with Google. Please try again.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleSignOut = async () => {
    await logout()
    setCurrentUser(null)
    setAccessToken(null)
    setMessages([])
    setSelectedMessage(null)
    showNotification('Disconnected Gmail session.')
  }

  // Load Messages from Gmail API
  const loadMessages = useCallback(
    async (folder = activeFolder, query = searchQuery) => {
      if (!accessToken) return
      setIsLoadingMessages(true)
      try {
        let labelIds: string[] = []
        if (folder === 'INBOX') labelIds = ['INBOX']
        else if (folder === 'STARRED') labelIds = ['STARRED']
        else if (folder === 'SENT') labelIds = ['SENT']
        else if (folder === 'DRAFT') labelIds = ['DRAFT']
        else if (folder === 'TRASH') labelIds = ['TRASH']

        const listRes = await GmailService.listMessages(accessToken, {
          labelIds,
          query: query.trim() || undefined,
          maxResults: 25,
        })

        if (!listRes.messages || listRes.messages.length === 0) {
          setMessages([])
          return
        }

        const details = await GmailService.batchGetMessages(
          accessToken,
          listRes.messages.map((m) => m.id)
        )
        setMessages(details)

        // If split view and no selected message yet, optionally keep or select first on large desktop
        if (details.length > 0 && !selectedMessage && window.innerWidth >= 1280) {
          setSelectedMessage(details[0])
        }
      } catch (err: any) {
        console.error('Failed to load Gmail messages:', err)
        showNotification(err.message || 'Failed to load emails from Gmail', 'error')
      } finally {
        setIsLoadingMessages(false)
      }
    },
    [accessToken, activeFolder, searchQuery, selectedMessage]
  )

  useEffect(() => {
    if (accessToken) {
      loadMessages(activeFolder, searchQuery)
    }
  }, [accessToken, activeFolder, loadMessages, searchQuery])

  // Filter messages based on filterType
  const filteredMessages = messages.filter((msg) => {
    if (filterType === 'UNREAD') return msg.isUnread
    if (filterType === 'STARRED') return msg.isStarred
    return true
  })

  // Prompt Confirmation before Sending Email
  const promptSendConfirmation = () => {
    if (!composeTo.trim()) {
      alert('Recipient email (To) is required.')
      return
    }
    if (!composeSubject.trim()) {
      alert('Email subject is required.')
      return
    }

    setConfirmDialog({
      isOpen: true,
      type: 'send_email',
      title: 'Confirm Email Dispatch',
      description: `Are you sure you want to send this email to "${composeTo}" with subject "${composeSubject}" from your authenticated Gmail account (${currentUser?.email})? This action will permanently deliver the message through Google servers.`,
      onConfirm: async () => {
        setConfirmDialog(null)
        setIsSending(true)
        try {
          if (!accessToken) throw new Error('Missing Gmail access token')
          const payload: SendEmailPayload = {
            to: composeTo,
            subject: composeSubject,
            bodyHtml: composeBody || '<p>(Empty Message)</p>',
            cc: composeCc.trim() || undefined,
            bcc: composeBcc.trim() || undefined,
          }

          await GmailService.sendEmail(accessToken, payload, currentUser?.email || undefined)
          showNotification(`Email successfully sent to ${composeTo}!`)
          setIsComposeOpen(false)
          setComposeTo('')
          setComposeCc('')
          setComposeBcc('')
          setComposeSubject('')
          setComposeBody('')
          if (activeFolder === 'SENT') {
            loadMessages('SENT')
          }
        } catch (err: any) {
          console.error('Error sending email:', err)
          showNotification(err.message || 'Failed to send email via Gmail API', 'error')
        } finally {
          setIsSending(false)
        }
      },
    })
  }

  // Prompt Confirmation before Trashing Email
  const promptTrashConfirmation = (email: ParsedEmail) => {
    setConfirmDialog({
      isOpen: true,
      type: 'trash_email',
      title: 'Confirm Move to Trash',
      description: `Are you sure you want to move the email "${email.subject}" from "${email.from}" to Gmail Trash?`,
      onConfirm: async () => {
        setConfirmDialog(null)
        try {
          if (!accessToken) throw new Error('Missing access token')
          await GmailService.trashMessage(accessToken, email.id)
          showNotification(`Moved "${email.subject}" to Trash`)
          setMessages((prev) => prev.filter((m) => m.id !== email.id))
          if (selectedMessage?.id === email.id) {
            setSelectedMessage(null)
          }
        } catch (err: any) {
          showNotification(err.message || 'Failed to move email to trash', 'error')
        }
      },
    })
  }

  // Toggle Star on Email
  const toggleStar = async (e: React.MouseEvent, email: ParsedEmail) => {
    e.stopPropagation()
    if (!accessToken) return
    const isCurrentlyStarred = email.isStarred
    try {
      setMessages((prev) =>
        prev.map((m) => (m.id === email.id ? { ...m, isStarred: !isCurrentlyStarred } : m))
      )
      if (selectedMessage?.id === email.id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isStarred: !isCurrentlyStarred } : null))
      }

      if (isCurrentlyStarred) {
        await GmailService.modifyMessage(accessToken, email.id, [], ['STARRED'])
      } else {
        await GmailService.modifyMessage(accessToken, email.id, ['STARRED'], [])
      }
    } catch (err: any) {
      showNotification('Failed to update star status', 'error')
      loadMessages()
    }
  }

  // Reply handler modal
  const handleReply = (email: ParsedEmail) => {
    setComposeTo(email.from)
    setComposeSubject(email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`)
    setComposeBody(
      `<br/><br/><blockquote>On ${email.date}, ${email.from} wrote:<br/>${email.bodyHtml || email.bodyPlain}</blockquote>`
    )
    setIsComposeOpen(true)
  }

  // Forward handler modal
  const handleForward = (email: ParsedEmail) => {
    setComposeTo('')
    setComposeSubject(email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`)
    setComposeBody(
      `<br/><br/>---------- Forwarded message ---------<br/>From: ${email.from}<br/>Date: ${email.date}<br/>Subject: ${email.subject}<br/>To: ${email.to}<br/><br/>${email.bodyHtml || email.bodyPlain}`
    )
    setIsComposeOpen(true)
  }

  // Send Quick Inline Reply right from the split-pane reading view
  const handleSendInlineReply = () => {
    if (!selectedMessage || !inlineReplyText.trim()) return

    const recipient = selectedMessage.from
    const subject = selectedMessage.subject.startsWith('Re:')
      ? selectedMessage.subject
      : `Re: ${selectedMessage.subject}`

    setConfirmDialog({
      isOpen: true,
      type: 'send_email',
      title: 'Confirm Quick Reply Dispatch',
      description: `Send reply directly to ${recipient} for "${subject}"?`,
      onConfirm: async () => {
        setConfirmDialog(null)
        setIsSendingInlineReply(true)
        try {
          if (!accessToken) throw new Error('Missing access token')
          const payload: SendEmailPayload = {
            to: recipient,
            subject: subject,
            bodyHtml: `<p>${inlineReplyText.replace(/\n/g, '<br/>')}</p><br/><blockquote style="border-left: 2px solid #38bdf8; padding-left: 8px; color: #94a3b8;">On ${selectedMessage.date}, ${selectedMessage.from} wrote:<br/>${selectedMessage.bodyHtml || selectedMessage.bodyPlain}</blockquote>`,
          }

          await GmailService.sendEmail(accessToken, payload, currentUser?.email || undefined)
          showNotification(`Reply dispatched to ${recipient}!`)
          setInlineReplyText('')
        } catch (err: any) {
          showNotification(err.message || 'Failed to send quick reply', 'error')
        } finally {
          setIsSendingInlineReply(false)
        }
      },
    })
  }

  // Copy plain text content
  const handleCopyBody = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedRawText(true)
    setTimeout(() => setCopiedRawText(false), 2000)
    showNotification('Email content copied to clipboard')
  }

  // Navigate through message list in reader
  const navigateMessage = (direction: 'prev' | 'next') => {
    if (!selectedMessage || filteredMessages.length === 0) return
    const currentIndex = filteredMessages.findIndex((m) => m.id === selectedMessage.id)
    if (currentIndex === -1) return

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= 0 && newIndex < filteredMessages.length) {
      setSelectedMessage(filteredMessages[newIndex])
    }
  }

  const currentMessageIndex = selectedMessage
    ? filteredMessages.findIndex((m) => m.id === selectedMessage.id)
    : -1

  return (
    <div
      className={`w-full ${defaultHeight} bg-[#0b0f19] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-200 ${className}`}
    >
      {/* Top Header Bar */}
      <header className="px-5 py-3.5 bg-[#111827] border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 via-amber-500/10 to-blue-500/20 border border-[#334155] flex items-center justify-center text-red-400 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Gmail Communications Hub</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                Google Workspace Live
              </span>
              {viewMode === 'split' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/20">
                  <Columns className="w-3 h-3" />
                  <span>Split-Pane Mode</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#94a3b8] hidden sm:block">
              Side-by-side reading pane: inspect incoming emails, verify wire advices, and reply without leaving the dashboard.
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle Button */}
            <div className="hidden md:flex items-center bg-[#161e2e] border border-[#1e293b] rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                title="Split-Pane View (Side-by-side email reader)"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-[#38bdf8] text-[#0b0f19] font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="text-[11px]">Split Pane</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Standard Single-Column List View"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#38bdf8] text-[#0b0f19] font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[11px]">List View</span>
              </button>
            </div>

            {/* Compose Button */}
            <button
              type="button"
              onClick={() => setIsComposeOpen(true)}
              className="px-3.5 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] flex items-center gap-1.5 cursor-pointer"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>

            {/* User Session Profile Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#161e2e] border border-[#1e293b] rounded-xl text-xs">
              <div className="w-6 h-6 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] font-bold text-[10px] overflow-hidden shrink-0">
                {currentUser.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-3 h-3" />
                )}
              </div>
              <div className="hidden lg:block">
                <span className="text-white font-medium text-xs block truncate max-w-[130px]">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out of Gmail"
                className="p-1 text-[#64748b] hover:text-red-400 transition-colors ml-0.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notification Toast */}
      {notificationBanner && (
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between border-b transition-all ${
            notificationBanner.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notificationBanner.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            )}
            <span>{notificationBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationBanner(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Container */}
      {!currentUser ? (
        /* Not Signed In State */
        <div className="flex-1 flex items-center justify-center p-8 bg-[#0b0f19]">
          <div className="max-w-md w-full p-8 bg-[#161e2e] border border-[#1e293b] rounded-2xl text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 via-amber-500/20 to-blue-500/20 border border-[#334155] flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.15)]">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white tracking-tight">Connect Gmail to Dashboard</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Read emails side-by-side without leaving your dashboard, dispatch certified wire notices, and review institutional records.
              </p>
            </div>

            <div className="p-3.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#38bdf8] font-semibold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Split-Pane Workspace Features</span>
              </div>
              <ul className="text-[#94a3b8] space-y-1 text-[11px] list-disc list-inside">
                <li>Read message bodies immediately alongside your inbox list</li>
                <li>Quick reply with built-in banking advice templates</li>
                <li>Search threads and manage starred messages instantly</li>
                <li>Strict client-side token handling in-memory</li>
              </ul>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <GoogleSignInButton
                onClick={handleSignIn}
                loading={isAuthenticating}
                label="Sign in with Google"
              />
            </div>

            <p className="text-[10px] text-[#64748b]">
              OAuth 2.0 authorized scopes: gmail.readonly, gmail.compose, gmail.modify
            </p>
          </div>
        </div>
      ) : (
        /* Authenticated Gmail View with Split-Pane */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Collapsible Left Folder Navigation */}
          <aside
            className={`transition-all duration-200 bg-[#0f172a] border-r border-[#1e293b] p-3 flex flex-col gap-1.5 shrink-0 ${
              isNavCollapsed ? 'w-16 items-center' : 'w-full md:w-52'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-1">
              {!isNavCollapsed && (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                  Mailboxes
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                className="hidden md:flex p-1 text-[#64748b] hover:text-white rounded-lg hover:bg-[#1e293b] cursor-pointer"
                title={isNavCollapsed ? 'Expand folders' : 'Collapse folders'}
              >
                {isNavCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            </div>

            <nav className="space-y-1 text-xs w-full">
              {[
                { id: 'INBOX', name: 'Inbox', icon: Inbox, count: messages.filter((m) => m.isUnread).length },
                { id: 'STARRED', name: 'Starred', icon: Star, count: messages.filter((m) => m.isStarred).length },
                { id: 'SENT', name: 'Sent', icon: Send },
                { id: 'DRAFT', name: 'Drafts', icon: FileText },
                { id: 'TRASH', name: 'Trash', icon: Trash2 },
              ].map((folder) => {
                const Icon = folder.icon
                const isActive = activeFolder === folder.id
                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => {
                      setActiveFolder(folder.id as any)
                      // Keep selectedMessage if in split mode or clear if switching contexts
                    }}
                    title={folder.name}
                    className={`w-full flex items-center ${
                      isNavCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                    } rounded-xl font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold'
                        : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#38bdf8]' : 'text-[#64748b]'}`} />
                      {!isNavCollapsed && <span>{folder.name}</span>}
                    </div>
                    {!isNavCollapsed && folder.count && folder.count > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#38bdf8] text-[#0b0f19] font-bold">
                        {folder.count}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </nav>

            {!isNavCollapsed && (
              <div className="mt-auto pt-3 border-t border-[#1e293b] text-[10px] text-[#64748b] space-y-1 hidden md:block">
                <div className="flex items-center justify-between">
                  <span>Sync Status:</span>
                  <span className="text-emerald-400 font-mono">Live OAuth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Account:</span>
                  <span className="text-slate-300 font-mono truncate max-w-[90px]">{currentUser.email}</span>
                </div>
              </div>
            )}
          </aside>

          {/* Center / Split Layout */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Left/List Pane */}
            <section
              className={`flex flex-col border-r border-[#1e293b] bg-[#0b0f19] transition-all min-h-0 ${
                viewMode === 'split'
                  ? selectedMessage
                    ? 'w-full md:w-5/12 lg:w-4/12 hidden md:flex shrink-0'
                    : 'w-full md:w-5/12 lg:w-4/12 flex shrink-0'
                  : selectedMessage
                  ? 'hidden'
                  : 'w-full flex'
              }`}
            >
              {/* Search & Quick Filter Bar */}
              <div className="p-2.5 bg-[#111827] border-b border-[#1e293b] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadMessages()}
                      placeholder="Search emails..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-xs text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => loadMessages()}
                    disabled={isLoadingMessages}
                    title="Refresh mailbox"
                    className="p-1.5 bg-[#161e2e] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white rounded-xl border border-[#1e293b] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-[#38bdf8]' : ''}`} />
                  </button>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setFilterType('ALL')}
                    className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === 'ALL'
                        ? 'bg-[#1e293b] text-white font-semibold'
                        : 'text-[#64748b] hover:text-slate-300'
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('UNREAD')}
                    className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === 'UNREAD'
                        ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-semibold'
                        : 'text-[#64748b] hover:text-slate-300'
                    }`}
                  >
                    Unread ({messages.filter((m) => m.isUnread).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('STARRED')}
                    className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      filterType === 'STARRED'
                        ? 'bg-amber-400/20 text-amber-300 font-semibold'
                        : 'text-[#64748b] hover:text-slate-300'
                    }`}
                  >
                    Starred ({messages.filter((m) => m.isStarred).length})
                  </button>
                </div>
              </div>

              {/* Message List Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b]/60">
                {isLoadingMessages ? (
                  <div className="p-8 text-center text-[#94a3b8] space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#38bdf8]" />
                    <p className="text-xs">Fetching Gmail inbox...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-[#64748b] space-y-2">
                    <Mail className="w-6 h-6 mx-auto text-[#334155]" />
                    <p className="text-xs font-semibold text-slate-300">No emails in this view</p>
                    <p className="text-[11px]">Clear search or select another folder</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isSelected = selectedMessage?.id === msg.id
                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-3.5 flex flex-col gap-1.5 cursor-pointer transition-all border-l-2 ${
                          isSelected
                            ? 'bg-[#162238] border-l-[#38bdf8] shadow-inner'
                            : msg.isUnread
                            ? 'bg-[#111927] border-l-amber-400/80 hover:bg-[#162032]'
                            : 'bg-transparent border-l-transparent hover:bg-[#131b2c]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => toggleStar(e, msg)}
                              className={`shrink-0 p-0.5 transition-colors cursor-pointer ${
                                msg.isStarred ? 'text-amber-400' : 'text-[#475569] hover:text-amber-400'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                            <span
                              className={`text-xs truncate ${
                                msg.isUnread ? 'text-white font-bold' : 'text-slate-300 font-medium'
                              }`}
                            >
                              {msg.from.replace(/<.*?>/, '').trim()}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#64748b] font-mono shrink-0">
                            {new Date(msg.timestamp).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={`text-xs truncate ${
                              isSelected
                                ? 'text-[#38bdf8] font-semibold'
                                : msg.isUnread
                                ? 'text-[#f1f5f9] font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {msg.subject || '(No Subject)'}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#64748b] line-clamp-1 leading-normal">
                          {msg.snippet}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </section>

            {/* Right / Reader Pane (Split-Pane Reading View) */}
            <section
              className={`flex-1 flex flex-col bg-[#0b0f19] min-h-0 overflow-hidden ${
                viewMode === 'list' && !selectedMessage ? 'hidden md:flex' : 'flex'
              }`}
            >
              {selectedMessage ? (
                /* Active Email Reading Pane */
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Reading Pane Header Bar */}
                  <div className="px-4 py-3 bg-[#111827] border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Back button for mobile or list mode */}
                      <button
                        type="button"
                        onClick={() => setSelectedMessage(null)}
                        className="px-2.5 py-1 bg-[#161e2e] hover:bg-[#1e293b] text-slate-300 text-xs rounded-lg flex items-center gap-1 border border-[#1e293b] transition-colors cursor-pointer md:hidden"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>

                      {/* Navigation arrows through email threads */}
                      <div className="flex items-center bg-[#161e2e] border border-[#1e293b] rounded-lg p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => navigateMessage('prev')}
                          disabled={currentMessageIndex <= 0}
                          title="Previous email"
                          className="p-1 text-[#94a3b8] hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono px-2 text-[#64748b]">
                          {currentMessageIndex + 1} of {filteredMessages.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigateMessage('next')}
                          disabled={currentMessageIndex >= filteredMessages.length - 1}
                          title="Next email"
                          className="p-1 text-[#94a3b8] hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Action controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleReply(selectedMessage)}
                        className="px-2.5 py-1 bg-[#161e2e] hover:bg-[#1e293b] text-slate-200 text-xs rounded-lg flex items-center gap-1 border border-[#1e293b] transition-colors cursor-pointer"
                        title="Reply to sender"
                      >
                        <Reply className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleForward(selectedMessage)}
                        className="px-2.5 py-1 bg-[#161e2e] hover:bg-[#1e293b] text-slate-200 text-xs rounded-lg flex items-center gap-1 border border-[#1e293b] transition-colors cursor-pointer"
                        title="Forward email"
                      >
                        <Forward className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Forward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyBody(selectedMessage.bodyPlain || selectedMessage.bodyHtml)
                        }
                        className="p-1.5 rounded-lg border border-[#1e293b] bg-[#161e2e] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white cursor-pointer"
                        title="Copy email body text"
                      >
                        {copiedRawText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleStar(e, selectedMessage)}
                        className={`p-1.5 rounded-lg border border-[#1e293b] bg-[#161e2e] hover:bg-[#1e293b] cursor-pointer ${
                          selectedMessage.isStarred ? 'text-amber-400' : 'text-[#64748b]'
                        }`}
                        title="Star email"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptTrashConfirmation(selectedMessage)}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Move to trash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Email Detail Body Scrollable Area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {/* Subject Line */}
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                        {selectedMessage.subject || '(No Subject)'}
                      </h1>
                    </div>

                    {/* Sender & Security Header Card */}
                    <div className="p-3.5 bg-[#161e2e] border border-[#1e293b] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38bdf8]/30 to-indigo-500/30 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] font-bold text-sm shrink-0">
                          {selectedMessage.from.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-xs">{selectedMessage.from}</div>
                          <div className="text-[#94a3b8] text-[11px]">
                            To: {selectedMessage.to || currentUser?.email}
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right space-y-0.5 text-[11px] text-[#64748b]">
                        <div className="flex items-center sm:justify-end gap-1">
                          <Calendar className="w-3 h-3 text-[#64748b]" />
                          <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center sm:justify-end gap-1 text-emerald-400 text-[10px] font-mono">
                          <ShieldCheck className="w-3 h-3" />
                          <span>TLS 1.3 / DKIM Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Rendered Email Body */}
                    <div className="p-5 sm:p-6 bg-[#161e2e]/40 border border-[#1e293b] rounded-2xl min-h-[160px]">
                      {selectedMessage.bodyHtml ? (
                        <div
                          className="prose prose-invert max-w-none text-xs leading-relaxed overflow-x-auto text-slate-200 selection:bg-[#38bdf8]/30"
                          dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300 selection:bg-[#38bdf8]/30">
                          {selectedMessage.bodyPlain}
                        </pre>
                      )}
                    </div>

                    {/* Quick Inline Reply Box directly in the Split-Pane */}
                    <div className="pt-2">
                      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <Reply className="w-3.5 h-3.5 text-[#38bdf8]" />
                            <span>Quick Reply to {selectedMessage.from.replace(/<.*?>/, '').trim()}</span>
                          </span>
                          <span className="text-[10px] text-[#64748b]">Direct dispatch without popup</span>
                        </div>

                        {/* Quick phrase pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Confirmed and received.',
                            'Fedwire execution advice accepted.',
                            'Statement reviewed by Treasury.',
                            'Compliance verification acknowledged.',
                          ].map((phrase) => (
                            <button
                              key={phrase}
                              type="button"
                              onClick={() => setInlineReplyText(phrase)}
                              className="px-2 py-0.5 rounded-lg bg-[#161e2e] hover:bg-[#1e293b] text-[10px] text-[#94a3b8] hover:text-white border border-[#1e293b] transition-colors cursor-pointer"
                            >
                              {phrase}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={inlineReplyText}
                          onChange={(e) => setInlineReplyText(e.target.value)}
                          placeholder="Type an immediate reply..."
                          className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-xs text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none resize-none leading-relaxed"
                        />

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#64748b]">
                            From: <span className="text-slate-300 font-mono">{currentUser?.email}</span>
                          </span>

                          <button
                            type="button"
                            onClick={handleSendInlineReply}
                            disabled={!inlineReplyText.trim() || isSendingInlineReply}
                            className="px-3 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)] disabled:opacity-50 cursor-pointer"
                          >
                            {isSendingInlineReply ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Placeholder State for Right Pane in Split-View */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#64748b] space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#161e2e] to-[#1e293b] border border-[#334155] flex items-center justify-center text-[#38bdf8] shadow-lg">
                    <Columns className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-slate-200">Split-Pane Reading View</h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      Select any conversation from the list on the left to read email bodies, review attachments, and dispatch replies directly on this dashboard.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsComposeOpen(true)}
                      className="px-3.5 py-1.5 bg-[#161e2e] hover:bg-[#1e293b] text-slate-200 border border-[#1e293b] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PenSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Compose New</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('UNREAD')}
                      className="px-3.5 py-1.5 bg-[#161e2e] hover:bg-[#1e293b] text-slate-200 border border-[#1e293b] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Filter className="w-3.5 h-3.5 text-amber-400" />
                      <span>Filter Unread</span>
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Compose Email Modal Window */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#161e2e] border-b border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <PenSquare className="w-4 h-4 text-[#38bdf8]" />
                <span>New Gmail Message</span>
              </div>
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-3.5 flex-1 overflow-y-auto text-xs">
              {/* Quick Template Selector */}
              <div>
                <label className="text-[11px] text-[#94a3b8] block mb-1 font-medium">
                  Select Institutional Banking Template (Optional)
                </label>
                <select
                  onChange={(e) => {
                    const t = QUICK_TEMPLATES.find((item) => item.title === e.target.value)
                    if (t) {
                      setComposeSubject(t.subject)
                      setComposeBody(t.body)
                    }
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white focus:border-[#38bdf8] focus:outline-none"
                >
                  <option value="" disabled>
                    Choose a quick institutional message template...
                  </option>
                  {QUICK_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.title} value={tmpl.title}>
                      {tmpl.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* To field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[#94a3b8] font-medium">To (Recipient Email)</label>
                  <button
                    type="button"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-[10px] text-[#38bdf8] hover:underline cursor-pointer"
                  >
                    {showCcBcc ? 'Hide CC / BCC' : 'Show CC / BCC'}
                  </button>
                </div>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="e.g. client@domain.com, emmanuelowighoyota9@gmail.com"
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono focus:border-[#38bdf8] focus:outline-none"
                />
              </div>

              {showCcBcc && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#94a3b8] block mb-1">CC</label>
                    <input
                      type="email"
                      value={composeCc}
                      onChange={(e) => setComposeCc(e.target.value)}
                      placeholder="compliance@crestlinecapital.com"
                      className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono focus:border-[#38bdf8] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#94a3b8] block mb-1">BCC</label>
                    <input
                      type="email"
                      value={composeBcc}
                      onChange={(e) => setComposeBcc(e.target.value)}
                      placeholder="records@crestlinecapital.com"
                      className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono focus:border-[#38bdf8] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="text-[11px] text-[#94a3b8] block mb-1 font-medium">Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-medium focus:border-[#38bdf8] focus:outline-none"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-[11px] text-[#94a3b8] block mb-1 font-medium">Message Body (HTML / Text)</label>
                <textarea
                  rows={7}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Type your correspondence here..."
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-sans focus:border-[#38bdf8] focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#161e2e] border-t border-[#1e293b] flex items-center justify-between">
              <span className="text-[10px] text-[#64748b]">
                Sending from: <span className="text-white font-mono">{currentUser?.email}</span>
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#273549] text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={promptSendConfirmation}
                  disabled={isSending}
                  className="px-4 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Review & Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#111827] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-tight">{confirmDialog.title}</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">{confirmDialog.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#283548] text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#0b0f19] font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.25)]"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
