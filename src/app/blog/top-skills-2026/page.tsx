import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, TrendingUp, DollarSign } from "lucide-react"
import { StructuredData, getArticleSchema } from "@/components/structured-data"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Top 10 Highest-Paying Freelance Skills 2026",
    description: "Discover which freelance skills command the highest rates in 2026, based on verified market data from thousands of professionals.",
    openGraph: {
        title: "Top 10 Highest-Paying Freelance Skills 2026",
        description: "AI/ML tops the list at $180/hr. See which skills command premium rates.",
        images: ['/blog/top-skills.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Top 10 Highest-Paying Freelance Skills 2026",
        description: "AI/ML tops the list at $180/hr",
        images: ['/blog/top-skills.png'],
    }
}

const articleSchema = getArticleSchema({
    title: "Top 10 Highest-Paying Freelance Skills 2026",
    description: "Discover which freelance skills command the highest rates in 2026, based on verified market data.",
    datePublished: "2026-01-16",
    author: "PriceIQ Team",
    image: "/blog/top-skills.png"
})

const topSkills = [
    {
        rank: 1,
        skill: "AI/ML Engineering",
        avgRate: "$180/hr",
        p90Rate: "$250/hr",
        yoyGrowth: "+42%",
        description: "Machine learning model development, LLM fine-tuning, AI integration",
        demandReason: "ChatGPT explosion created massive demand for AI specialists"
    },
    {
        rank: 2,
        skill: "Blockchain/Smart Contracts",
        avgRate: "$165/hr",
        p90Rate: "$220/hr",
        yoyGrowth: "+28%",
        description: "Solidity, Web3 development, DeFi protocols",
        demandReason: "Institutional crypto adoption driving enterprise blockchain projects"
    },
    {
        rank: 3,
        skill: "DevOps/Cloud Architecture",
        avgRate: "$155/hr",
        p90Rate: "$210/hr",
        yoyGrowth: "+18%",
        description: "AWS/Azure architecture, Kubernetes, CI/CD pipelines",
        demandReason: "Every company migrating to cloud infrastructure"
    },
    {
        rank: 4,
        skill: "Cybersecurity Consulting",
        avgRate: "$150/hr",
        p90Rate: "$200/hr",
        yoyGrowth: "+22%",
        description: "Penetration testing, compliance audits, incident response",
        demandReason: "Rising data breaches forcing companies to invest in security"
    },
    {
        rank: 5,
        skill: "iOS/Swift Development",
        avgRate: "$140/hr",
        p90Rate: "$190/hr",
        yoyGrowth: "+12%",
        description: "SwiftUI, App Store optimization, Apple ecosystem apps",
        demandReason: "iOS users spend 2x more than Android, driving premium demand"
    },
    {
        rank: 6,
        skill: "Data Science/Analytics",
        avgRate: "$130/hr",
        p90Rate: "$180/hr",
        yoyGrowth: "+15%",
        description: "Python, SQL, Tableau, predictive modeling",
        demandReason: "Every B2B SaaS needs data-driven decision making"
    },
    {
        rank: 7,
        skill: "React/Next.js (Senior)",
        avgRate: "$120/hr",
        p90Rate: "$170/hr",
        yoyGrowth: "+10%",
        description: "Full-stack Next.js, advanced React patterns, performance optimization",
        demandReason: "Next.js becoming the standard for modern web apps"
    },
    {
        rank: 8,
        skill: "Product Design (UX/UI)",
        avgRate: "$115/hr",
        p90Rate: "$165/hr",
        yoyGrowth: "+14%",
        description: "Figma, design systems, user research, prototyping",
        demandReason: "Startup boom creating demand for conversion-focused design"
    },
    {
        rank: 9,
        skill: "Motion Graphics/3D",
        avgRate: "$110/hr",
        p90Rate: "$160/hr",
        yoyGrowth: "+25%",
        description: "After Effects, Blender, Cinema 4D, brand animations",
        demandReason: "Video content dominating social media marketing"
    },
    {
        rank: 10,
        skill: "Technical Writing",
        avgRate: "$95/hr",
        p90Rate: "$140/hr",
        yoyGrowth: "+8%",
        description: "API documentation, developer docs, SaaS content",
        demandReason: "Developer tooling boom requires clear documentation"
    }
]

export default function TopSkillsBlogPost() {
    return (
        <>
            <StructuredData data={articleSchema} />
            <main className="min-h-screen bg-background py-12 px-6">
                <article className="max-w-4xl mx-auto">
                    {/* Header */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    <header className="mb-12 space-y-6">
                        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                            Market Trends
                        </div>

                        {/* Hero Image */}
                        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-border">
                            <Image
                                src="/blog/top-skills.png"
                                alt="Top 10 Highest-Paying Freelance Skills 2026"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                            Top 10 Highest-Paying Freelance Skills in 2026
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Data-driven analysis of the most lucrative freelance skills based on 10,000+ verified rate submissions.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>January 16, 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>6 min read</span>
                            </div>
                        </div>
                    </header>

                    {/* Intro */}
                    <div className="prose prose-invert max-w-none mb-12">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Not all freelance skills are created equal. Using real market data from the <Link href="/" className="text-primary hover:underline">PriceIQ database</Link>, we analyzed median hourly rates across 200+ skills to identify which ones command the highest premiums in 2026.
                        </p>
                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl my-8">
                            <p className="text-sm text-muted-foreground mb-0">
                                <strong className="text-foreground">Methodology:</strong> Rates based on P50 (median) and P90 (90th percentile) data from verified freelancers with 5+ years of experience in the United States. YoY growth calculated from January 2025 baseline.
                            </p>
                        </div>
                    </div>

                    {/* Rankings */}
                    <div className="space-y-6 mb-12">
                        {topSkills.map((item) => (
                            <div key={item.rank} className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl-soft transition-all">
                                <div className="flex items-start gap-6">
                                    <div className="bg-primary/10 text-primary font-black text-3xl w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {item.rank}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-2xl font-bold text-foreground">{item.skill}</h3>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-2xl font-black text-primary">{item.avgRate}</div>
                                                <div className="text-xs text-muted-foreground">median</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                <span className="text-green-500 font-bold">{item.yoyGrowth}</span>
                                                <span className="text-muted-foreground">vs 2025</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">Top 10%: {item.p90Rate}</span>
                                            </div>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <p className="text-xs text-muted-foreground">
                                                <strong className="text-foreground">Why it pays:</strong> {item.demandReason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Analysis Section */}
                    <div className="prose prose-invert max-w-none space-y-8 my-16">
                        <h2 className="text-3xl font-bold text-foreground">Key Takeaways</h2>

                        <h3 className="text-2xl font-bold text-foreground mt-8">AI is the New Gold Rush</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            The explosion of ChatGPT and generative AI has created unprecedented demand for ML engineers. Companies are paying premium rates for anyone who can integrate LLMs, build AI features, or fine-tune models for specific use cases.
                        </p>

                        <h3 className="text-2xl font-bold text-foreground mt-8">Specialization &gt; Generalization</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Notice a trend? The highest-paid skills are highly specialized. Generic "full-stack developer" or "graphic designer" roles max out around $60-80/hr. Specialists in AI, blockchain, or cybersecurity command 2-3x that rate.
                        </p>

                        <h3 className="text-2xl font-bold text-foreground mt-8">Video/Motion Graphics Surging</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            With 25% YoY growth, motion graphics is the sneaky winner. TikTok and short-form video content exploded demand for animated brand content, product demos, and social media creatives.
                        </p>

                        <div className="bg-card border border-border p-8 rounded-2xl my-12">
                            <h3 className="text-xl font-bold text-foreground mb-4">Honorable Mentions (Just Missed Top 10)</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-bold text-foreground">Solana/Rust Development</p>
                                    <p className="text-muted-foreground">$105/hr • +35% YoY</p>
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">SEO/Growth Marketing</p>
                                    <p className="text-muted-foreground">$90/hr • +12% YoY</p>
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Conversion Copywriting</p>
                                    <p className="text-muted-foreground">$85/hr • +18% YoY</p>
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Flutter Development</p>
                                    <p className="text-muted-foreground">$80/hr • +8% YoY</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-foreground mt-12">How to Break Into High-Paying Skills</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you're currently charging $40-60/hr, here's how to transition into a higher-paying niche:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                            <li><strong className="text-foreground">Pick ONE skill from the list</strong> that aligns with your existing background</li>
                            <li><strong className="text-foreground">Build 2-3 portfolio projects</strong> showcasing that specific skill</li>
                            <li><strong className="text-foreground">Offer a discounted rate</strong> for your first 3 clients to build testimonials</li>
                            <li><strong className="text-foreground">Raise rates every 6 months</strong> as you gain experience and case studies</li>
                        </ol>

                        <div className="bg-primary/10 border border-primary/20 p-8 rounded-2xl my-12 text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-4">Want to See Rates for YOUR Skill?</h3>
                            <p className="text-muted-foreground mb-6">
                                Explore real-time market data for 200+ freelance skills and locations
                            </p>
                            <Link href="/explore" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                Explore Market Rates
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
        </>
    )
}
