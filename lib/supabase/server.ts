/**
 * Server-side database client — Prisma-backed, Supabase-compatible API.
 * Replaces the old @supabase/supabase-js server client.
 */
export { createDbClient as createClient, createDbClient as createServiceClient } from './client'
