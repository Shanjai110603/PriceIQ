import Link from "next/link"
import { ArrowRight, BarChart2, DollarSign, Search } from "lucide-react"

export default function GuidePage() {
    return (
        <main className="min-h-screen bg-background py-16 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">How to Use PriceIQ</h1>
                    <p className="text-xl text-muted-foreground">Master your freelance pricing strategy in 3 simple steps.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Step 1 */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">1. Explore Market Rates</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Use the <strong>Explore</strong> page to search for your specific skill (e.g., "React Developer") and location. View the P50 (Median) and P90 (Top Tier) rates to understand the market range.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">2. Submit Your Rate</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Contribute to the community by anonymously submitting your own rate. This helps keep the data fresh and unlocks detailed percentile charts for deeper analysis.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <BarChart2 className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">3. Optimize Your Pricing</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Use the data to negotiate better. If you are in the 25th percentile but have 5 years of experience, it's time to raise your rates.
                        </p>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-3xl p-8 md:p-12 border border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Pro Tips for Pricing</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="font-bold text-primary text-xl">01</span>
                            <div>
                                <h4 className="font-bold text-foreground">Charge by Value, Not Just Time</h4>
                                <p className="text-muted-foreground text-sm">Hourly rates are great for benchmarks, but consider project-based or value-based pricing for higher margins.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-primary text-xl">02</span>
                            <div>
                                <h4 className="font-bold text-foreground">Factor in Overheads</h4>
                                <p className="text-muted-foreground text-sm">Remember that your rate needs to cover taxes, software, health insurance, and unpaid vacation time. Rule of thumb: add 30% to your desired salary hourly equivalent.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-primary text-xl">03</span>
                            <div>
                                <h4 className="font-bold text-foreground">Regularly Re-evaluate</h4>
                                <p className="text-muted-foreground text-sm">Review your rates every 6 months. As you gain skills and the market changes (inflation!), your rates should evolve.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        Start Exploring Market Rates <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </main>
    )
}
