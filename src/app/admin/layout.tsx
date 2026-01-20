"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ShieldAlert, Loader2 } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.replace('/login')
                return
            }

            // Check if user is admin
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (error || profile?.role !== 'admin') {
                // If not admin, show unauthorized or redirect
                setIsAuthorized(false)
                // Optional: router.replace('/')
            } else {
                setIsAuthorized(true)
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
                    <ShieldAlert className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-black text-foreground">Access Denied</h1>
                <p className="text-muted-foreground max-w-md">
                    You do not have permission to view this area. Currently, specific database permissions are required.
                </p>
                <div className="text-sm bg-muted p-4 rounded-lg font-mono text-left">
                    <p>To enable admin access for development:</p>
                    <p className="text-xs text-muted-foreground mt-2">
                        update profiles set role = 'admin' where email = 'your-email@example.com';
                    </p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-foreground text-background font-bold rounded-lg hover:opacity-90"
                >
                    Return Home
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-lg flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        Admin Dashboard
                    </h1>
                    <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        Environment: {process.env.NODE_ENV}
                    </div>
                </div>
            </header>
            <main className="p-6">
                {children}
            </main>
        </div>
    )
}
