"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBanking } from "@/hooks/use-banking"

/** Sandbox demo access, mirroring the credentials seeded in lib/customer/session.ts. */
const SANDBOX_ACCESS = { identifier: "Emmanuel", password: "Owighoyota12345" }

/** Only same-origin paths are honoured, so `?returnTo=` cannot redirect off-site. */
function safeReturnTo(): string {
  if (typeof window === "undefined") return "/"
  const requested = new URLSearchParams(window.location.search).get("returnTo")
  if (requested && requested.startsWith("/") && !requested.startsWith("//")) return requested
  return "/"
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]">
      {children}
    </span>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { updateUserProfile } = useBanking()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Someone with a live session should never see the sign-in form.
  useEffect(() => {
    let cancelled = false
    fetch("/api/customer/auth?action=session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.authenticated) router.replace(safeReturnTo())
      })
      .catch(() => {
        // A failed probe just means we keep showing the form.
      })
    return () => {
      cancelled = true
    }
  }, [router])

  const useSandboxCredentials = useCallback(() => {
    setIdentifier(SANDBOX_ACCESS.identifier)
    setPassword(SANDBOX_ACCESS.password)
    setError("")
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    setError("")

    if (!identifier.trim() || !password) {
      setError("Enter your email and password to continue.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", identifier: identifier.trim(), password, remember }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data?.authenticated) {
        setError(data?.error || "We could not sign you in. Please try again.")
        return
      }

      // The server session is the source of truth; these keys keep the signed-in
      // shell (dashboard header, greeting) in step with it.
      try {
        localStorage.setItem("crestline_logged_in", "true")
        localStorage.setItem("crestline_user_id", String(data.customer?.id ?? ""))
        localStorage.setItem("crestline_user_name", String(data.customer?.name ?? ""))
        localStorage.setItem("crestline_user_email", String(data.customer?.email ?? ""))
        localStorage.setItem("crestline_last_login", new Date().toISOString())
      } catch {
        // Private browsing / storage disabled — the session cookie still applies.
      }

      updateUserProfile({
        name: data.customer?.name,
        email: data.customer?.email,
      })

      router.replace(safeReturnTo())
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Online banking"
      title="Sign in to your account"
      subtitle="Welcome back. Enter your details to reach your dashboard."
      footer={
        <>
          New to Crestline Capital?{" "}
          <Link href="/register" className="font-semibold text-[#38bdf8] hover:text-[#0ea5e9]">
            Open an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-[#f43f5e]/30 bg-[#f43f5e]/10 px-4 py-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f43f5e]" />
            <p className="text-sm text-[#fecdd3]">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-[#cbd5e1]">
            Email or sign-in name
          </Label>
          <div className="relative">
            <FieldIcon>
              <Mail className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="h-11 border-[#1e293b] bg-[#0b0f19]/60 pl-10 text-[#f8fafc] placeholder:text-[#64748b] focus-visible:border-[#38bdf8] focus-visible:ring-[#38bdf8]/25"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#cbd5e1]">
            Password
          </Label>
          <div className="relative">
            <FieldIcon>
              <Lock className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border-[#1e293b] bg-[#0b0f19]/60 pl-10 pr-11 text-[#f8fafc] placeholder:text-[#64748b] focus-visible:border-[#38bdf8] focus-visible:ring-[#38bdf8]/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#64748b] transition-colors hover:text-[#38bdf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]/40"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="remember" className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              className="border-[#334155] data-[state=checked]:border-[#38bdf8] data-[state=checked]:bg-[#38bdf8]"
            />
            <span className="text-sm text-[#94a3b8]">Keep me signed in</span>
          </label>
          <Link href="/contact" className="text-sm font-medium text-[#38bdf8] hover:text-[#0ea5e9]">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-[#38bdf8] text-sm font-semibold text-[#0b0f19] transition-all hover:bg-[#0ea5e9] hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in securely
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-[#64748b]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
          Protected by encrypted sessions and sign-in rate limiting
        </p>
      </form>

      {/* Sandbox access — clearly labelled demo data, not a real customer. */}
      <div className="mt-7 rounded-xl border border-[#1e293b] bg-[#0b0f19]/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f59e0b]">
              <KeyRound className="h-3.5 w-3.5" />
              Sandbox access
            </p>
            <p className="mt-2 font-mono text-xs text-[#94a3b8]">
              {SANDBOX_ACCESS.identifier}
              <br />
              {SANDBOX_ACCESS.password}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={useSandboxCredentials}
            className="shrink-0 border-[#1e293b] bg-transparent text-xs text-[#cbd5e1] hover:border-[#38bdf8]/40 hover:bg-[#161e2e] hover:text-white"
          >
            Use demo login
          </Button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[#64748b]">
          Demo customer account for this sandbox environment. It holds simulated balances
          only — no real funds, cards or deposits are connected.
        </p>
      </div>
    </AuthShell>
  )
}
