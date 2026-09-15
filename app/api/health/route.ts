import { NextResponse } from "next/server"

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

  return NextResponse.json({
    status: "healthy",
    application: "Crestline Capital",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    checks,
    uptime: process.uptime(),
  })
}
