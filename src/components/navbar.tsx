"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Menu, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User, Session } from "@supabase/supabase-js"

export function Navbar() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)

        // Check current session
        supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
            setUser(data.session?.user ?? null)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isMobileMenuOpen])

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-lg">
                        P
                    </div>
                    <span className="text-xl font-black text-foreground">PriceIQ</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/explore" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        Explore Rates
                    </Link>
                    <Link href="/submit" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        Submit Rate
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                        aria-label="Toggle theme"
                    >
                        {mounted && theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut()
                                    setUser(null)
                                    window.location.href = '/'
                                }}
                                className="bg-muted text-foreground text-sm font-bold px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                Log In
                            </Link>
                            <Link href="/signup" className="bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                Sign Up Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                        aria-label="Toggle theme"
                    >
                        {mounted && theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    <button
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col pt-24 px-6 animate-in slide-in-from-top-10 duration-200">
                    <div className="flex flex-col gap-6 text-lg font-medium">
                        <Link
                            href="/explore"
                            className="flex items-center justify-between py-2 border-b border-border text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Explore Rates
                            <span className="text-muted-foreground">→</span>
                        </Link>
                        <Link
                            href="/submit"
                            className="flex items-center justify-between py-2 border-b border-border text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Submit Rate
                            <span className="text-muted-foreground">→</span>
                        </Link>
                        <div className="pt-6 flex flex-col gap-4">
                            <Link
                                href="/auth/login"
                                className="w-full text-center py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
