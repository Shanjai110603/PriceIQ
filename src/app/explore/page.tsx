"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Search, MapPin, SearchX, Plus, BarChart3 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { RateDistributionChart } from "@/components/charts/rate-distribution"
import { RateTrendChart } from "@/components/charts/rate-trend"
import { GeoRateChart } from "@/components/charts/geo-rate-chart"
import { analytics } from "@/lib/analytics"

interface RateData {
    p25: number
    p50: number
    p75: number
    p90: number
    sample_count: number
}

interface SearchResult extends RateData {
    id: string
    skill: string
    location: string
    seniority: string
    count: number // Alias for sample_count due to UI structure
}

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [locationTerm, setLocationTerm] = useState("")
    const [skills, setSkills] = useState<{ id: number, name: string }[]>([])
    const [locations, setLocations] = useState<{ id: number, city: string, country: string }[]>([])

    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searching, setSearching] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'distribution' | 'trends' | 'geo'>('distribution')

    // Unlock State (Gate Logic)
    const [isUnlocked, setIsUnlocked] = useState(false)

    // Check Access (LocalStorage OR Admin Role)
    useEffect(() => {
        async function checkAccess() {
            // 1. Check LocalStorage
            const hasSubmitted = typeof window !== 'undefined' ? localStorage.getItem('has_submitted') === 'true' : false;

            if (hasSubmitted) {
                setIsUnlocked(true)
                return
            }

            // 2. Check Admin Role (Async)
            const { data: { session } } = await supabase.auth.getSession();
            // Simple check: Role is 'admin' OR email contains 'admin' (for demo flexibility)
            if (session?.user?.user_metadata?.role === 'admin' || session?.user?.email?.includes('admin')) {
                setIsUnlocked(true)
                localStorage.setItem('has_submitted', 'true') // Cache it for future
            }
        }
        checkAccess()
    }, [])

    // Fetch initial dicts
    useEffect(() => {
        async function init() {
            const { data: skillsData } = await supabase.from('skills').select('id, name')
            const { data: locData } = await supabase.from('locations').select('id, city, country')
            if (skillsData) setSkills(skillsData)
            if (locData) setLocations(locData)
        }
        init()
    }, [])

    // Execute Search
    const handleSearch = async () => {
        setSearching(true)

        try {
            const term = searchTerm.toLowerCase()
            const locTerm = locationTerm.toLowerCase()

            // Filter client-side lists first to find IDs
            let foundSkills = skills.filter(s => s.name.toLowerCase().includes(term))
            // If empty search, try standard popular ones or just React
            if (!term && foundSkills.length === 0) {
                foundSkills = skills.filter(s => ['React', 'Node.js', 'UI/UX Design'].includes(s.name))
            }

            const foundLocs = locations.filter(l =>
                l.city.toLowerCase().includes(locTerm) ||
                l.country.toLowerCase().includes(locTerm) ||
                (locTerm === 'remote' && l.city === 'Remote')
            )
            // If no location found but term exists, search global. If location found, use first match.
            const locToQuery = locationTerm && foundLocs.length > 0 ? foundLocs[0] : null

            // If absolutely nothing found for skill, show empty
            if (term && foundSkills.length === 0) {
                setResults([])
                setSearching(false)
                return
            }

            const newResults: SearchResult[] = []

            // Limit to top 5 skills to avoid spamming RPC
            const skillsToQuery = foundSkills.slice(0, 5)

            for (const skill of skillsToQuery) {
                const { data, error } = await supabase.rpc('get_market_rates', {
                    target_skill_id: skill.id,           // Fixed param name
                    target_location_id: locToQuery?.id || null
                })

                if (data && data.length > 0) {
                    const stats = data[0]
                    // Only show if we have data samples
                    if (stats.total_count > 0) {
                        newResults.push({
                            id: `${skill.id}-${locToQuery?.id || 'global'}`,
                            skill: skill.name,
                            location: locToQuery ? `${locToQuery.city}, ${locToQuery.country}` : "Global",
                            seniority: "All Levels",
                            p25: stats.p25_rate,      // Fixed field names
                            p50: stats.p50_rate,
                            p75: stats.p75_rate,
                            p90: stats.p90_rate,
                            sample_count: stats.total_count,
                            count: stats.total_count
                        })
                    }
                }
            }

            setResults(newResults)

            // Track search event
            if (term) {
                analytics.searchPerformed(term, locTerm || 'global')
            }

        } catch (err) {
            console.error("Search error:", err)
        } finally {
            setSearching(false)
        }
    }

    // Initial load search (Trigger popularity)
    useEffect(() => {
        if (skills.length > 0) {
            // Small delay to ensure state updates
            setTimeout(() => handleSearch(), 100)
        }
    }, [skills.length])

    return (
        <main className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header / Search Section */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">
                        Explore Freelance Rates
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Search real market rates verified by the PriceIQ community.
                    </p>

                    <div className="max-w-4xl mx-auto bg-card p-4 rounded-3xl shadow-lg-soft border border-border flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Skill (e.g. React, Design)"
                                className="w-full pl-12 pr-4 py-4 bg-muted/50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 font-bold text-foreground placeholder:text-muted-foreground/50 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                list="skills-list"
                            />
                            <datalist id="skills-list">
                                {skills.map(s => <option key={s.id} value={s.name} />)}
                            </datalist>
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Location (e.g. US, Remote)"
                                className="w-full pl-12 pr-4 py-4 bg-muted/50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 font-bold text-foreground placeholder:text-muted-foreground/50 transition-colors"
                                value={locationTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                list="locations-list"
                            />
                            <datalist id="locations-list">
                                {locations.map(l => <option key={l.id} value={`${l.city}, ${l.country}`} />)}
                            </datalist>
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={searching}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:grayscale"
                        >
                            {searching ? (
                                <span className="animate-spin h-5 w-5 border-2 border-b-0 border-current rounded-full"></span>
                            ) : (
                                <>
                                    <Search className="h-5 w-5" />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searching ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-10 w-16" />
                                        <Skeleton className="h-12 w-20" />
                                        <Skeleton className="h-10 w-16" />
                                    </div>
                                    <Skeleton className="h-2 w-full rounded-full" />
                                </div>
                            </div>
                        ))
                    ) : results.length > 0 ? (
                        results.map((rate, i) => (
                            <div key={i} className="group bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl-soft transition-all hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

                                <div className="relative">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-6 w-full">
                                        <div>
                                            <h3 className="text-xl font-black text-foreground mb-1">{rate.skill}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                {rate.location}
                                            </div>
                                        </div>
                                        <div className="bg-muted px-3 py-1 rounded-full text-xs font-bold text-muted-foreground whitespace-nowrap">
                                            {rate.count} samples
                                        </div>
                                    </div>

                                    {/* Rate Stats */}
                                    <div className="space-y-4">
                                        <div className="flex items-end justify-between">
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">P25</div>
                                                <div className="text-xl font-bold text-muted-foreground">${rate.p25 || 0}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-primary uppercase mb-1">Median</div>
                                                <div className="text-3xl font-black text-foreground">${rate.p50 || 0}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">P90</div>
                                                <div className="text-xl font-bold text-muted-foreground">${rate.p90 || 0}</div>
                                            </div>
                                        </div>

                                        {/* Visual Bar */}
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                                            <div className="h-full bg-transparent flex-1"></div>
                                            <div className="h-full bg-muted-foreground/30 w-[15%] rounded-l-full"></div>
                                            <div className="h-full bg-primary w-[40%]"></div>
                                            <div className="h-full bg-muted-foreground/30 w-[10%] rounded-r-full"></div>
                                            <div className="h-full bg-transparent flex-1"></div>
                                        </div>

                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Low</span>
                                            <span>High</span>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-4">
                                            {expandedId === rate.id ? (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 relative">

                                                    {/* "Give-to-Get" Gate Logic - Quick LocalStorage Check */}
                                                    {(() => {
                                                        const hasSubmitted = typeof window !== 'undefined' ? localStorage.getItem('has_submitted') === 'true' : false;

                                                        // If NOT submitted, show blur overlay
                                                        if (!hasSubmitted) {
                                                            return (
                                                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border border-dashed border-primary/20 p-6 text-center">
                                                                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                                                                        <BarChart3 className="h-6 w-6 text-primary" />
                                                                    </div>
                                                                    <h3 className="font-bold text-lg mb-2">Unlock Market Insights</h3>
                                                                    <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                                                                        To keep this community fair, please contribute your own rate (anonymously) to unlock detailed charts.
                                                                    </p>
                                                                    <Link href="/submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold text-sm hover:bg-primary/90 transition-colors">
                                                                        Add My Rate to Unlock
                                                                    </Link>
                                                                </div>
                                                            )
                                                        }

                                                        // If submitted, return null (allow content below to show)
                                                        return null;
                                                    })()}

                                                    <div className="flex p-1 bg-muted rounded-lg">
                                                        {(['distribution', 'trends', 'geo'] as const).map((tab) => (
                                                            <button
                                                                key={tab}
                                                                onClick={() => setActiveTab(tab)}
                                                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab
                                                                    ? 'bg-background text-foreground shadow-sm'
                                                                    : 'text-muted-foreground hover:text-foreground'
                                                                    }`}
                                                            >
                                                                {tab === 'distribution' && 'Distribution'}
                                                                {tab === 'trends' && 'Trends'}
                                                                {tab === 'geo' && 'Top Locations'}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="min-h-[300px]">
                                                        {activeTab === 'distribution' && (
                                                            <RateDistributionChart
                                                                skillId={parseInt(rate.id.split('-')[0])}
                                                                locationId={rate.id.split('-')[1] === 'global' ? null : parseInt(rate.id.split('-')[1])}
                                                                skillName={rate.skill}
                                                            />
                                                        )}
                                                        {activeTab === 'trends' && (
                                                            <RateTrendChart
                                                                skillId={parseInt(rate.id.split('-')[0])}
                                                                locationId={rate.id.split('-')[1] === 'global' ? null : parseInt(rate.id.split('-')[1])}
                                                                skillName={rate.skill}
                                                            />
                                                        )}
                                                        {activeTab === 'geo' && (
                                                            <GeoRateChart
                                                                skillId={parseInt(rate.id.split('-')[0])}
                                                                skillName={rate.skill}
                                                            />
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => setExpandedId(null)}
                                                        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        Close Insights
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setExpandedId(rate.id)
                                                        setActiveTab('distribution')
                                                    }}
                                                    className="w-full py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <BarChart3 className="h-4 w-4" />
                                                    View Market Insights
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchX className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No rates found</h3>
                            <p className="text-muted-foreground">
                                {searching ? "Crunching the data..." : "Try searching for specific skills (e.g. React) and locations."}
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="bg-primary/10 rounded-3xl p-10 text-center space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Don't see your skill?</h2>
                    <p className="text-muted-foreground">Be the first to contribute data for your role and unlock full access.</p>
                    <Link href="/submit" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                        <Plus className="h-5 w-5" />
                        Submit Your Rate
                    </Link>
                </div>
            </div>
        </main>
    )
}
