import { NextResponse } from 'next/server';
import { getNeonAuthHandler } from '@/lib/auth/neon-server';

type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Neon Auth is optional in this deployment: without credentials these routes
 * report "not configured" instead of the module throwing while `next build`
 * collects page data and failing the entire build.
 */
function notConfigured() {
  return NextResponse.json(
    {
      error: 'Neon Auth not configured',
      detail: 'Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to enable these endpoints.',
      configured: false,
    },
    { status: 503 },
  );
}

export async function GET(request: Request, context: RouteContext) {
  const handler = getNeonAuthHandler();
  if (!handler) return notConfigured();
  return handler.GET(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  const handler = getNeonAuthHandler();
  if (!handler) return notConfigured();
  return handler.POST(request, context);
}
