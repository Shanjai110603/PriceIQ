import Link from "next/link"
import { CheckCircle2, Globe2, ShieldCheck, Users2 } from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110 z-0"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight">
                        Democratizing <span className="text-primary">Freelance Rates</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        PriceIQ is the open-source source of truth for freelance pricing. We help developers, designers, and creatives charge what they're worth.
                    </p>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Why we built this</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The freelance market is opaque. Beginners undercharge, experts struggle to justify their rates, and everyone relies on outdated blog posts or hearsay.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        We believe that <strong>transparent data empowers everyone</strong>. By aggregating real-world rates from verified professionals, we create a fair marketplace where skill is rewarded efficiently.
                    </p>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                        {[
                            "100% Anonymous & Secure",
                            "Verified Community Data",
                            "Real-time Market Trends",
                            "Global Location Logic"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span className="font-medium text-foreground">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-card p-8 rounded-3xl border border-border shadow-xl space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <Globe2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Global Reach</h3>
                            <p className="text-sm text-muted-foreground">Detailed insights for 50+ countries and remote markets.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Verified Data</h3>
                            <p className="text-sm text-muted-foreground">Our smart algorithms filter out outliers and spam to ensure accuracy.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <Users2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Community First</h3>
                            <p className="text-sm text-muted-foreground">Built by freelancers, for freelancers. No corporate gatekeepers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/CTA */}
            <section className="py-20 px-6 bg-muted/30 border-t border-border text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl font-bold text-foreground">Join the Movement</h2>
                    <p className="text-muted-foreground">
                        Stop guessing. Start knowing. Contribute your rate today and unlock full access to the global database.
                    </p>
                    <Link href="/submit" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                        Add Your Rate
                    </Link>
                </div>
            </section>
        </main>
    )
}
