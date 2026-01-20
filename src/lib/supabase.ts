import { createBrowserClient } from '@supabase/ssr'

// Safely handle missing env vars without crashing the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Log warning if keys are missing (visible in browser console)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ PriceIQ Warning: Supabase Environment Variables are missing in .env.local')
}

// Export client - if keys are missing, this might throw on usage, but won't crash import.
// We lazily create it or create a "safe" empty client if needed, but standard createBrowserClient 
// usually handles empty strings by throwing. Let's wrap it.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : {
        // Mock client to prevent "cannot read properties of null" crashes on landing page
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            signInWithOAuth: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
        },
        from: () => ({
            select: () => ({
                order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
                limit: () => Promise.resolve({ data: [], error: null }),
                eq: () => Promise.resolve({ data: [], error: null }),
                single: () => Promise.resolve({ data: null, error: null })
            })
        })
    } as any
