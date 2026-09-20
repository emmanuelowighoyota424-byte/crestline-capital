"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react"
import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBanking } from "@/hooks/use-banking"
import { fetchCustomerSession, registerAccount } from "@/lib/customer/client"

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "An uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "A lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "A number", test: (value: string) => /[0-9]/.test(value) },
  { label: "A special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"]

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]">
      {children}
    </span>
  )
}

const inputClass =
  "h-11 border-[#1e293b] bg-[#0b0f19]/60 pl-10 text-[#f8fafc] placeholder:text-[#64748b] focus-visible:border-[#38bdf8] focus-visible:ring-[#38bdf8]/25"

export default function RegisterPage() {
  const router = useRouter()
  const { updateUserProfile } = useBanking()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Already signed in? Skip the form.
  useEffect(() => {
    let cancelled = false
    void fetchCustomerSession().then((customer) => {
      if (!cancelled && customer) router.replace("/")
    })
    return () => {
      cancelled = true
    }
  }, [router])

  const passedRules = useMemo(
    () => PASSWORD_RULES.filter((rule) => rule.test(password)).length,
    [password],
  )
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return
    setError("")

    if (fullName.trim().length < 2) {
      setError("Enter your full name.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.")
      return
    }
    if (passedRules < PASSWORD_RULES.length) {
      setError("Your password does not meet all the requirements below.")
      return
    }
    if (!passwordsMatch) {
      setError("Your passwords do not match.")
      return
    }
    if (!acceptedTerms) {
      setError("Please accept the terms to open your account.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await registerAccount({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      updateUserProfile({
        name: result.customer.name,
        email: result.customer.email,
        phone: phone.trim() || undefined,
      })

      router.replace("/")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Open an account"
      title="Create your Crestline account"
      subtitle="It takes about a minute. Your account opens with a secure checking balance ready to fund."
      footer={
        <>
          Already bank with us?{" "}
          <Link href="/login" className="font-semibold text-[#38bdf8] hover:text-[#0ea5e9]">
            Sign in
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
          <Label htmlFor="fullName" className="text-[#cbd5e1]">
            Full name
          </Label>
          <div className="relative">
            <FieldIcon>
              <User className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="fullName"
              name="name"
              autoComplete="name"
              placeholder="Emmanuel Owigboyota"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#cbd5e1]">
            Email address
          </Label>
          <div className="relative">
            <FieldIcon>
              <Mail className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#cbd5e1]">
            Phone <span className="text-[#64748b]">(optional)</span>
          </Label>
          <div className="relative">
            <FieldIcon>
              <Phone className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-[#cbd5e1]">
            Password
          </Label>
          <div className="relative">
            <FieldIcon>
              <Lock className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="new-password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${inputClass} pr-11`}
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

          {password.length > 0 && (
            <div className="pt-1">
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1e293b]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      passedRules <= 2
                        ? "bg-[#f43f5e]"
                        : passedRules === 3
                          ? "bg-[#f59e0b]"
                          : "bg-[#10b981]"
                    }`}
                    style={{ width: `${(passedRules / PASSWORD_RULES.length) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-right text-xs text-[#94a3b8]">
                  {STRENGTH_LABELS[passedRules]}
                </span>
              </div>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(password)
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-2 text-xs ${met ? "text-[#10b981]" : "text-[#64748b]"}`}
                    >
                      <Check className={`h-3.5 w-3.5 ${met ? "opacity-100" : "opacity-40"}`} />
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-[#cbd5e1]">
            Confirm password
          </Label>
          <div className="relative">
            <FieldIcon>
              <Lock className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
              className={inputClass}
            />
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-[#f43f5e]">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            className="mt-0.5 border-[#334155] data-[state=checked]:border-[#38bdf8] data-[state=checked]:bg-[#38bdf8]"
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-relaxed text-[#94a3b8]">
            I agree to the{" "}
            <Link href="/terms" className="text-[#38bdf8] hover:text-[#0ea5e9]">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#38bdf8] hover:text-[#0ea5e9]">
              privacy policy
            </Link>
            .
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-[#38bdf8] text-sm font-semibold text-[#0b0f19] transition-all hover:bg-[#0ea5e9] hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening your account…
            </>
          ) : (
            "Open my account"
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-[#64748b]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
          Your details are encrypted in transit and your password is never stored in plain text
        </p>
      </form>
    </AuthShell>
  )
}
