"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { CheckCircle2, AlertCircle, ChevronDown, Send } from "lucide-react"
import { toast } from "sonner"

export default function SubmitPage() {
    const [submitted, setSubmitted] = useState(false)
    const [skills, setSkills] = useState<{ id: number, name: string }[]>([])
    const [locations, setLocations] = useState<{ id: number, city: string, country: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [honeypot, setHoneypot] = useState("") // Security honeypot

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: skillsData, error: skillsError } = await supabase
                    .from('skills')
                    .select('id, name')
                    .order('name')

                const { data: locationsData, error: locationsError } = await supabase
                    .from('locations')
                    .select('id, city, country')
                    .order('country, city')

                if (skillsError) throw skillsError
                if (locationsError) throw locationsError

                setSkills(skillsData || [])
                setLocations(locationsData || [])
            } catch (err) {
                console.error("Error fetching form data:", err)
                setError("Failed to load form data. Please refresh.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        // Validate inputs
        const skillName = formData.get('skill_name') as string
        const locationName = formData.get('location_name') as string
        const hourlyRate = parseFloat(formData.get('hourly_rate') as string)
        const yearsExperience = parseFloat(formData.get('years_experience') as string)
        const seniority = formData.get('seniority') as string
        const projectType = formData.get('project_type') as string // Get project type from form

        // Strict validation: Must match database EXACTLY
        const skill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
        // For location: check full string match OR if it's "Remote"
        const location = locations.find(l =>
            `${l.city}, ${l.country}`.toLowerCase() === locationName.toLowerCase() ||
            (locationName.toLowerCase().includes('remote') && l.city === 'Remote')
        )

        if (!skill) {
            setError(`Skill '${skillName}' not found. Please select from the list.`)
            setSubmitting(false)
            return
        }

        if (!location) {
            setError(`Location '${locationName}' not found. Please select from the list.`)
            setSubmitting(false)
            return
        }

        try {
            // Get current user (optional, can be null for anonymous)
            const { data: { session } } = await supabase.auth.getSession()

            const { error: submitError } = await supabase
                .from('rate_submissions')
                .insert({
                    user_id: session?.user?.id || null, // Capture user ID if logged in
                    skill_id: skill.id,
                    location_id: location.id,
                    hourly_rate: hourlyRate,
                    years_experience: yearsExperience,
                    seniority_level: seniority.charAt(0).toUpperCase() + seniority.slice(1), // Title case (Junior, Mid...)
                    project_type: projectType.charAt(0).toUpperCase() + projectType.slice(1), // Use selected project type
                    is_approved: true, // Auto-approve for MVP demo (usually false)
                    fraud_score: 0
                })

            if (submitError) throw submitError

            toast.success("Rate Submitted Successfully!", {
                description: "Your data has been sent for verification."
            })

            // Mark user as contributor to unlock insights
            localStorage.setItem('has_submitted', 'true');

            // Trigger Email (Fire and forget, don't await blocking user)
            // In a real app, you might call an API route here to send an email
            // e.g., fetch('/api/send-submission-email', { method: 'POST', body: JSON.stringify({ skill: skill.name, location: location.city }) })
            console.log("Email trigger placeholder: Submission successful, consider sending notification email.")

            // Reset form but stay on page
            setSubmitted(false)
            // e.currentTarget.reset() // Better to just clear form manually or let user submit another?
            // Let's reload or clear state.
            window.location.reload() // Simple reset for MVP
        } catch (err: any) {
            console.error("Submission error:", err)
            toast.error("Submission Failed", {
                description: err.message || "Please try again."
            })
            setError(err.message || "Failed to submit rate. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen py-12 px-6 bg-background">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black text-foreground">Submit Your Rate</h1>
                    <p className="text-muted-foreground">
                        Anonymous. Secure. Helpful. Join 10,000+ freelancers sharing transparent pricing data.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card p-8 md:p-10 rounded-3xl shadow-lg-soft border border-border space-y-8 relative">

                    {loading && (
                        <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {error}
                        </div>
                    )}

                    {/* Honeypot Field (Hidden) */}
                    <input
                        type="text"
                        name="website_url_hp"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    {/* Skill & Location */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Skill / Role</label>
                            <input
                                required
                                type="text"
                                name="skill_name"
                                list="skills-list"
                                placeholder="e.g. React"
                                className="w-full bg-muted/50 border-transparent rounded-xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background transition-colors placeholder:text-muted-foreground/50"
                            />
                            <datalist id="skills-list">
                                {skills.map(skill => (
                                    <option key={skill.id} value={skill.name} />
                                ))}
                            </datalist>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Location</label>
                            <input
                                required
                                type="text"
                                name="location_name"
                                list="locations-list"
                                placeholder="City, Country"
                                className="w-full bg-muted/50 border-transparent rounded-xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background transition-colors placeholder:text-muted-foreground/50"
                            />
                            <datalist id="locations-list">
                                {locations.map(loc => (
                                    <option key={loc.id} value={`${loc.city}, ${loc.country}`} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Rate & Currency */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Hourly Rate</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                            <input
                                required
                                type="number"
                                name="hourly_rate"
                                placeholder="0.00"
                                step="0.01"
                                min="5"
                                max="500"
                                className="w-full bg-muted/50 border-transparent rounded-xl p-4 pl-10 font-bold text-2xl text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background transition-colors placeholder:text-muted-foreground/50"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-muted px-3 py-1 rounded-lg text-xs font-bold text-muted-foreground">
                                USD / Hr
                            </div>
                        </div>
                    </div>

                    {/* Experience & Seniority */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Years Experience</label>
                            <input
                                required
                                type="number"
                                name="years_experience"
                                placeholder="e.g. 5"
                                min="0"
                                max="50"
                                className="w-full bg-muted/50 border-transparent rounded-xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background transition-colors placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Seniority Level</label>
                            <div className="relative">
                                <select name="seniority" className="w-full bg-muted/50 border-transparent rounded-xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/50 appearance-none focus:bg-background transition-colors">
                                    <option value="junior">Junior (0-2 years)</option>
                                    <option value="mid">Mid-Level (3-5 years)</option>
                                    <option value="senior">Senior (5-8 years)</option>
                                    <option value="expert">Expert (8+ years)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Project Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Most Common Project Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer">
                                <input type="radio" name="project_type" value="hourly" className="peer sr-only" defaultChecked />
                                <div className="p-4 rounded-xl bg-muted/50 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                    <div className="font-bold text-foreground">Hourly</div>
                                    <div className="text-xs text-muted-foreground">I bill by time</div>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="project_type" value="fixed" className="peer sr-only" />
                                <div className="p-4 rounded-xl bg-muted/50 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                    <div className="font-bold text-foreground">Fixed Price</div>
                                    <div className="text-xs text-muted-foreground">I bill by project</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin h-5 w-5 border-2 border-b-0 border-current rounded-full"></span>
                                Submitting...
                            </span>
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                Submit My Rate (Anonymous)
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-muted-foreground">
                        By submitting, you agree to our Terms. Your data is anonymized and aggregated.
                    </p>

                </form>
            </div>
        </main>
    )
}
