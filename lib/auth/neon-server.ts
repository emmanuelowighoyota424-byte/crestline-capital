import { createNeonAuth } from '@neondatabase/auth/next/server';

export const neonAuth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'http://localhost:3000',
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || 'dummy-secret-at-least-32-chars-long-placeholder-123',
    sessionDataTtl: 300, // 5 minutes session cache
  },
});
