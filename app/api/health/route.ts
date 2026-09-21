import { NextResponse } from "next/server"
import { resendStatus } from "@/lib/resend"
import { convexStatus } from "@/lib/convex"

export async function GET() {
  const checks: Record<string, string> = {}

  // Database connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    checks.database = supabaseUrl && supabaseKey ? "configured" : "not_configured"
  } catch {
    checks.database = "error"
  }

  // Service role
  checks.service_role = process.env.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "not_configured"

  // Transactional email (Resend)
  const email = resendStatus()
  checks.email = email.configured ? "configured" : "not_configured"

  // Reactive backend (Convex) - probed with a real query, so a deployment that is
  // configured but not reachable is reported as such instead of looking healthy.
  const convex = await convexStatus()
  checks.convex = convex.mode

  return NextResponse.json({
    // The app process itself is up; per-dependency state is reported below.
    status: "healthy",
    application: "Chase",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    checks,
    providers: { email, convex },
    uptime: process.uptime(),
  })
}
