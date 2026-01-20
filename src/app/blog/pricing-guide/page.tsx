import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { StructuredData, getArticleSchema } from "@/components/structured-data"
import Image from "next/image"

export const metadata: Metadata = {
    title: "How to Price Your Freelance Services",
    description: "A comprehensive guide to pricing your freelance work based on market data, value, and strategy.",
    openGraph: {
        title: "How to Price Your Freelance Services in 2026",
        description: "A comprehensive guide to pricing your freelance work based on market data, value, and strategy.",
        images: ['/blog/pricing-guide.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "How to Price Your Freelance Services",
        description: "A comprehensive guide to pricing your freelance work",
        images: ['/blog/pricing-guide.png'],
    }
}

const articleSchema = getArticleSchema({
    title: "How to Price Your Freelance Services",
    description: "A comprehensive guide to pricing your freelance work based on market data, value, and strategy.",
    datePublished: "2026-01-16",
    author: "PriceIQ Team",
    image: "/blog/pricing-guide.png"
})

export default function PricingGuideBlogPost() {
    return (
        <>
            <StructuredData data={articleSchema} />
            <main className="min-h-screen bg-background py-12 px-6">
                <article className="max-w-3xl mx-auto">
                    {/* Header */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    <header className="mb-12 space-y-6">
                        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                            Guides
                        </div>

                        {/* Hero Image */}
                        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-border">
                            <Image
                                src="/blog/pricing-guide.png"
                                alt="How to Price Your Freelance Services"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                            How to Price Your Freelance Services in 2026
                        </h1>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>January 16, 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>8 min read</span>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-invert prose-green max-w-none space-y-8">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Pricing is one of the most challenging aspects of freelancing. Charge too little and you'll burn out. Charge too much and you'll lose clients. Here's how to find the sweet spot using data and strategy.
                        </p>

                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">1. Understand Your Market Rate</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Before setting your rate, you need to know what the market will bear. Use platforms like <Link href="/explore" className="text-primary hover:underline">PriceIQ</Link> to research rates for your specific skill and location.
                        </p>
                        <div className="bg-card p-6 rounded-2xl border border-border my-8">
                            <h3 className="text-xl font-bold text-foreground mb-4">2026 Market Benchmarks</h3>
                            <ul className="space-y-3 text-muted-foreground">
                                <li><strong>Junior React Developer (US):</strong> $35-60/hr</li>
                                <li><strong>Mid-Level (3-5 years):</strong> $70-100/hr</li>
                                <li><strong>Senior (5+ years):</strong> $100-160/hr</li>
                                <li><strong>UI/UX Designer (Mid):</strong> $60-100/hr</li>
                                <li><strong>Python Developer (Senior):</strong> $100-200/hr</li>
                            </ul>
                            <p className="text-xs text-muted-foreground mt-4">Source: PriceIQ Database (Jan 2026)</p>
                        </div>

                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">2. Calculate Your Baseline</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your hourly rate should cover more than just work time. Use this formula:
                        </p>
                        <div className="bg-muted/50 p-6 rounded-xl border border-border font-mono text-sm my-6">
                            <p className="text-foreground font-bold mb-2">Desired Annual Salary = $80,000</p>
                            <p className="text-muted-foreground">÷ 1,000 billable hours/year (accounting for vacation, admin, marketing)</p>
                            <p className="text-muted-foreground">= $80/hr baseline</p>
                            <p className="text-primary font-bold mt-2">+ 30% overhead (taxes, software, insurance) = $104/hr</p>
                        </div>

                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">3. Choose Your Pricing Model</h2>

                        <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Hourly Pricing</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Best for:</strong> Ongoing retainers, unpredictable scopes, maintenance work
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>✅ Simple to track and invoice</li>
                            <li>✅ Low risk for scope creep</li>
                            <li>❌ Penalizes efficiency (faster = less money)</li>
                        </ul>

                        <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Project-Based Pricing</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Best for:</strong> Well-defined deliverables, website builds, app features
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>✅ Rewards efficiency</li>
                            <li>✅ Easier for client budgeting</li>
                            <li>❌ Risk of scope creep without clear contracts</li>
                        </ul>

                        <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Value-Based Pricing</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Best for:</strong> High-impact work (conversion optimization, revenue-driving features)
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>✅ Highest earning potential</li>
                            <li>✅ Aligns your success with client's ROI</li>
                            <li>❌ Requires strong negotiation skills</li>
                        </ul>

                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">4. Adjust for These Factors</h2>
                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h4 className="font-bold text-foreground mb-3">Increase Your Rate If:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>✅ You have specialized, in-demand skills</li>
                                    <li>✅ You have 5+ years of experience</li>
                                    <li>✅ Tight deadline or weekend work</li>
                                    <li>✅ Client has high budget / enterprise</li>
                                </ul>
                            </div>
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h4 className="font-bold text-foreground mb-3">Consider Discounting If:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>🤝 Long-term retainer (guaranteed income)</li>
                                    <li>🤝 Portfolio-building project (great testimonial)</li>
                                    <li>🤝 Referral potential from well-known client</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">5. Handle The Money Conversation</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Most freelancers hate negotiating. Here are proven scripts:
                        </p>

                        <div className="bg-muted/50 p-6 rounded-2xl border border-border my-6">
                            <p className="text-sm font-bold text-primary mb-2">When Asked "What's Your Rate?"</p>
                            <p className="text-muted-foreground text-sm italic">
                                "My rate for this type of project is typically $X-$Y per hour, depending on scope and timeline. Can you tell me more about your budget and goals?"
                            </p>
                        </div>

                        <div className="bg-muted/50 p-6 rounded-2xl border border-border my-6">
                            <p className="text-sm font-bold text-primary mb-2">When Countering a Low Offer</p>
                            <p className="text-muted-foreground text-sm italic">
                                "I appreciate your offer, but based on market rates for my experience level [cite PriceIQ data], I typically charge $X. I'm confident the value I bring will exceed that investment."
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">6. Raise Your Rates Regularly</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Inflation alone justifies a 3-5% annual increase. Review your rates every 6-12 months and adjust based on:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>New skills or certifications</li>
                            <li>Increased demand (fully booked = time to raise rates)</li>
                            <li>Market trends (check <Link href="/explore" className="text-primary hover:underline">updated PriceIQ data</Link>)</li>
                        </ul>

                        <div className="bg-primary/10 border border-primary/20 p-8 rounded-2xl my-12 text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Price Confidently?</h3>
                            <p className="text-muted-foreground mb-6">
                                Explore real-time rate data for your skill and location
                            </p>
                            <Link href="/explore" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                View Market Rates
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
        </>
    )
}
