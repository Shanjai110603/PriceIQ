"use server"

import { sendEmail } from "@/lib/email"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

// Server-side Supabase client (Service Role for admin tasks if needed, but here generic)
// Note: In Next.js Server Actions, we can use a direct client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for IP checks/admin tasks
)

export async function submitRate(formData: any) {
    const headersList = headers()
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1"

    console.log("Processing submission from IP:", ip)

    // 1. IP Fraud Check (Basic Rate Limiting)
    // Check if this IP has submitted more than 3 times in the last 24 hours
    const { count, error: countError } = await supabase
        .from('rate_submissions')
        .select('*', { count: 'exact', head: true })
    // .eq('ip_address', ip) // Assuming we added ip_column, or we just log it for now.
    // For MVP without migration, we'll skip DB Check and just return error if suspicious.

    // Simulating specific IP ban or limit
    if (ip === '0.0.0.0') {
        return { success: false, message: "Blocked: Suspicious activity detected." }
    }

    // 2. Insert Data
    const { error } = await supabase.from('rate_submissions').insert({
        ...formData,
        is_verified: false, // Default to unverified
        is_approved: true, // Auto-approve for demo, usually false
        // ip_address: ip // Optional: Add column in schema if you want to store it
    })

    if (error) {
        console.error("Submission error:", error)
        return { success: false, message: error.message }
    }

    // 3. Email Notification (Fire & Forget)
    // await sendSubmissionEmail(...) 

    return { success: true, message: "Rate submitted successfully" }
}

export async function sendWelcomeEmail(email: string, name: string) {
    return await sendEmail({
        to: email,
        subject: "Welcome to PriceIQ! 🚀",
        html: `
            <h1>Welcome, ${name}!</h1>
            <p>Thanks for joining the PriceIQ community.</p>
            <p>You can now explore real market rates and contribute your own to help transparency in the freelance world.</p>
            <br/>
            <p>- The PriceIQ Team</p>
        `
    })
}

export async function sendSubmissionEmail(email: string) {
    return await sendEmail({
        to: email,
        subject: "Rate Submitted Successfully ✅",
        html: `
            <h1>Thanks for sharing!</h1>
            <p>Your rate data has been submitted for review.</p>
            <p>Once approved, it will be aggregated into our global anonymous statistics.</p>
        `
    })
}
