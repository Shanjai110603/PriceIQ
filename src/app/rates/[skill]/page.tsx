import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, TrendingUp, Users, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StructuredData, getBreadcrumbSchema } from '@/components/structured-data'

interface SkillPageProps {
    params: Promise<{
        skill: string
    }>
}

// Generate static params for top 100 skills
export async function generateStaticParams() {
    const { data: skills } = await supabase
        .from('skills')
        .select('name')
        .limit(100)

    if (!skills) return []

    return skills.map((skill: { name: string }) => ({
        skill: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
    const { skill } = await params
    const skillName = skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return {
        title: `${skillName} Hourly Rates 2026 - Freelance Pricing Data`,
        description: `Average ${skillName} hourly rate is based on verified market data. See P25, P50, P90 benchmarks for freelance ${skillName.toLowerCase()} by location and experience level.`,
        keywords: [
            `${skillName} hourly rate`,
            `freelance ${skillName} rates`,
            `${skillName} pricing`,
            `how much do ${skillName} charge`,
            `${skillName} salary`
        ],
        openGraph: {
            title: `${skillName} Rates 2026`,
            description: `See real ${skillName} hourly rates from verified freelancers worldwide.`,
        }
    }
}

export default async function SkillRatePage({ params }: SkillPageProps) {
    const { skill: skillSlug } = await params
    // Convert slug back to skill name
    const skillName = skillSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Fetch skill data
    const { data: skill } = await supabase
        .from('skills')
        .select('id, name')
        .ilike('name', skillName)
        .single()

    if (!skill) {
        notFound()
    }

    // Fetch market rates
    const { data: ratesData } = await supabase.rpc('get_market_rates', {
        target_skill_id: skill.id,
        target_location_id: null
    })

    const rates = ratesData?.[0] || {
        p25_rate: 0,
        p50_rate: 0,
        p75_rate: 0,
        p90_rate: 0,
        total_count: 0
    }

    // Fetch location breakdown (top 5 locations)
    const { data: locationData } = await supabase
        .from('rate_submissions')
        .select(`
      hourly_rate,
      locations (city, country)
    `)
        .eq('skill_id', skill.id)
        .eq('is_approved', true)
        .limit(100)

    // Calculate location averages
    const locationStats = locationData?.reduce((acc: any, curr: any) => {
        if (!curr.locations) return acc
        const locKey = `${curr.locations.city}, ${curr.locations.country}`
        if (!acc[locKey]) {
            acc[locKey] = { rates: [], count: 0 }
        }
        acc[locKey].rates.push(curr.hourly_rate)
        acc[locKey].count++
        return acc
    }, {}) || {}

    const topLocations = Object.entries(locationStats)
        .map(([location, data]: [string, any]) => ({
            location,
            avgRate: Math.round(data.rates.reduce((a: number, b: number) => a + b, 0) / data.count),
            count: data.count
        }))
        .sort((a, b) => b.avgRate - a.avgRate)
        .slice(0, 5)

    // Breadcrumb schema
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: 'https://priceiq.com' },
        { name: 'Rates', url: 'https://priceiq.com/rates' },
        { name: skillName, url: `https://priceiq.com/rates/${skill}` }
    ])

    return (
        <>
            <StructuredData data={breadcrumbSchema} />
            <main className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/rates" className="hover:text-primary transition-colors">Rates</Link>
                        <span>/</span>
                        <span className="text-foreground">{skill.name}</span>
                    </nav>

                    {/* Header */}
                    <header className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black text-foreground">
                            {skill.name} Hourly Rates in 2026
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl">
                            Real market data from {rates.total_count} verified freelance {skill.name.toLowerCase()} professionals worldwide.
                        </p>
                    </header>

                    {/* Main Stats */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-card p-6 rounded-2xl border border-border">
                            <div className="text-sm text-muted-foreground mb-2">25th Percentile</div>
                            <div className="text-3xl font-black text-foreground">${rates.p25_rate}</div>
                            <div className="text-xs text-muted-foreground mt-1">Entry Level</div>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-primary shadow-lg">
                            <div className="text-sm text-primary mb-2 font-bold">Median Rate</div>
                            <div className="text-4xl font-black text-primary">${rates.p50_rate}</div>
                            <div className="text-xs text-muted-foreground mt-1">Most Common</div>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border">
                            <div className="text-sm text-muted-foreground mb-2">75th Percentile</div>
                            <div className="text-3xl font-black text-foreground">${rates.p75_rate}</div>
                            <div className="text-xs text-muted-foreground mt-1">Experienced</div>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border">
                            <div className="text-sm text-muted-foreground mb-2">90th Percentile</div>
                            <div className="text-3xl font-black text-foreground">${rates.p90_rate}</div>
                            <div className="text-xs text-muted-foreground mt-1">Top 10%</div>
                        </div>
                    </div>

                    {/* Location Breakdown */}
                    {topLocations.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-primary" />
                                Rates by Location
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {topLocations.map((loc, i) => (
                                    <div key={i} className="bg-card p-6 rounded-xl border border-border flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-foreground">{loc.location}</div>
                                            <div className="text-xs text-muted-foreground">{loc.count} data points</div>
                                        </div>
                                        <div className="text-2xl font-black text-primary">${loc.avgRate}/hr</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* How to Price Section */}
                    <section className="bg-muted/30 p-8 md:p-12 rounded-3xl border border-border space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">How to Price Your {skill.name} Services</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-muted-foreground">
                                The median {skill.name.toLowerCase()} charges <strong className="text-primary">${rates.p50_rate}/hr</strong>. However, your rate should depend on:
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><strong className="text-foreground">Experience Level:</strong> Junior (0-2 years), Mid-level (3-5 years), Senior (5+ years)</li>
                                <li><strong className="text-foreground">Location:</strong> Rates in San Francisco are 2-3x higher than global remote rates</li>
                                <li><strong className="text-foreground">Specialization:</strong> Niche expertise can command 30-50% premium</li>
                                <li><strong className="text-foreground">Project Complexity:</strong> Urgent or complex projects justify higher rates</li>
                            </ul>
                        </div>
                        <Link href="/blog/pricing-guide" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                            Read Full Pricing Guide <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Link>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-primary/10 border border-primary/20 p-8 md:p-12 rounded-3xl text-center space-y-6">
                        <h2 className="text-3xl font-bold text-foreground">Ready to Explore More Rates?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Compare {skill.name} rates with 200+ other skills. Search by location, experience level, and project type.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/explore" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                Explore All Rates
                            </Link>
                            <Link href="/submit" className="bg-background text-foreground border border-border px-8 py-3 rounded-xl font-bold hover:bg-muted transition-colors">
                                Submit Your Rate
                            </Link>
                        </div>
                    </section>

                    {/* Related Skills */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">Related Skills</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['React', 'Node.js', 'Python', 'UI/UX Design'].map((relatedSkill) => (
                                <Link
                                    key={relatedSkill}
                                    href={`/rates/${relatedSkill.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    className="bg-card p-4 rounded-xl border border-border hover:border-primary transition-colors text-center"
                                >
                                    <div className="font-bold text-foreground">{relatedSkill}</div>
                                    <div className="text-xs text-muted-foreground mt-1">View Rates</div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
