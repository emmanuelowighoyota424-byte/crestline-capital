/**
 * Crestline Capital - Admin Server-Side Secrets
 *
 * ⚠️  SERVER-ONLY: This file must NEVER be imported from client components ('use client').
 * It contains credentials that must never reach the browser bundle.
 * Import this only from API route handlers and server components/layouts.
 */

// Default 48-char hexadecimal master key (192-bit entropy)
export const ADMIN_MASTER_KEY = '4a8f9b2c3d4e5f60718293a4b5c6d7e8f90123456789abcd'

// Designated Primary Administrator Credentials
export const ADMIN_DEFAULT_CREDENTIALS = {
  email: 'owighoyotaemmanuel424@gmail.com',
  password: 'Owighoyota12345',
  name: 'Emmanuel Owighoyota',
  role: 'SUPER_ADMIN' as const,
}
