"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Check, X, Filter, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Submission {
    id: string
    hourly_rate: number
    years_experience: number
    seniority_level: string
    created_at: string
    is_approved: boolean
    skills: { name: string }    // Joined via query
    locations: { city: string, country: string } // Joined
}

export default function AdminPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending'>('all')

    const fetchSubmissions = async () => {
        setLoading(true)
        try {
            // Note: RLS must allow this read. 
            // Querying joined tables requires slightly complex syntax or multiple calls.
            // Supabase simpler join:
            const { data, error } = await supabase
                .from('rate_submissions')
                .select(`
                    id, hourly_rate, years_experience, seniority_level, created_at, is_approved,
                    skills ( name ),
                    locations ( city, country )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Flatten data for easier usage if needed
            setSubmissions(data as any[])
        } catch (err) {
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            if (action === 'approve') {
                const { error } = await supabase
                    .from('rate_submissions')
                    .update({ is_approved: true, is_verified: true })
                    .eq('id', id)
                if (error) throw error
                toast.success("Submission Approved")
            } else {
                // Reject logic: Soft delete or Hard delete?
                // Let's hard delete for cleanup in MVP
                const { error } = await supabase
                    .from('rate_submissions')
                    .delete()
                    .eq('id', id)
                if (error) throw error
                toast.success("Submission Rejected")
            }

            // Refresh local state
            fetchSubmissions()
        } catch (err) {
            console.error("Action error:", err)
            toast.error("Action Failed")
        }
    }

    const filteredSubmissions = filter === 'pending'
        ? submissions.filter(s => !s.is_approved)
        : submissions

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-foreground">Rate Submissions</h2>
                    <p className="text-muted-foreground">Manage and moderate incoming price data.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                        Pending Not Reviewed
                    </button>
                    <button
                        onClick={fetchSubmissions}
                        className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 ml-2"
                        title="Refresh"
                    >
                        <RefreshCcw className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Skill / Role</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Rate</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-10 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="px-6 py-4 flex justify-end gap-2">
                                            <Skeleton className="h-9 w-9 rounded-lg" />
                                            <Skeleton className="h-9 w-9 rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                <Filter className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold text-foreground">No submissions found</h3>
                                                <p className="text-muted-foreground max-w-sm mx-auto">
                                                    {filter === 'pending'
                                                        ? "Great job! All pending submissions have been reviewed."
                                                        : "No rate data has been submitted yet."}
                                                </p>
                                            </div>
                                            {filter === 'pending' && (
                                                <button
                                                    onClick={() => setFilter('all')}
                                                    className="text-primary font-bold hover:underline"
                                                >
                                                    View All History
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-foreground">
                                            {/* Safely access nested props */}
                                            {/* @ts-ignore - Supabase types are dynamic */}
                                            {sub.skills?.name}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {/* @ts-ignore */}
                                            {sub.locations?.city}, {sub.locations?.country}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-primary">
                                            ${sub.hourly_rate}/hr
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{sub.seniority_level}</span>
                                                <span className="text-xs text-muted-foreground">{sub.years_experience} YOE</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.is_approved ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    <Check className="h-3 w-3" /> Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!sub.is_approved && (
                                                    <button
                                                        onClick={() => handleAction(sub.id, 'approve')}
                                                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(sub.id, 'reject')}
                                                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                                                    title="Reject / Delete"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
