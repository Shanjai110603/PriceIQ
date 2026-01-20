import Link from 'next/link'
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Users,
  Globe,
  BarChart3,
  Rocket,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { ProfitabilityCalculator } from '@/components/profitability-calculator'
import { SITE_METRICS } from '@/lib/constants'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Enhanced with pattern background */}
      <section className="relative overflow-hidden pattern-bg py-20 lg:py-32 px-6">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              100% Free • Data-Driven • No BS
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-foreground">
              Know What to Charge.
              <br />
              <span className="text-primary">Earn What You Deserve.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              The most <strong className="text-foreground">accurate freelance pricing intelligence platform</strong>.
              Discover real market rates backed by crowdsourced data from 500+ freelancers worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6 justify-center pt-8">
              <Link
                href="/explore"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-lg-soft hover:shadow-xl-soft hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <TrendingUp className="h-6 w-6" />
                Explore Freelance Rates
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/submit"
                className="glass-strong border-2 border-border px-10 py-5 rounded-2xl font-bold text-lg hover:border-primary transition-all text-foreground"
              >
                Submit Your Rate
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 border-2 border-background flex items-center justify-center text-white font-bold text-xs">
                      {i}
                    </div>
                  ))}
                </div>
                <span><strong className="text-foreground">{SITE_METRICS.trustedUsers}</strong> trusted users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span><strong className="text-foreground">{SITE_METRICS.verifiedRates}</strong> verified rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span><strong className="text-foreground">{SITE_METRICS.countries}</strong> countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
              Why PriceIQ?
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
              Stop Guessing. Start Earning.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by freelancers, for freelancers. We solve the pricing problem once and for all.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-background/50 p-10 rounded-3xl border-2 border-transparent hover:border-primary transition-all hover:shadow-xl-soft">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-foreground">Real Market Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                See actual rates from <strong>P25 to P90 percentiles</strong>. No more guessing if you're charging too much or too little. Data straight from real freelancers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-background/50 p-10 rounded-3xl border-2 border-transparent hover:border-secondary transition-all hover:shadow-xl-soft">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-foreground">Fraud-Free Intel</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every submission is <strong>validated and verified</strong>. We detect and remove fake rates using AI so you get clean, accurate intelligence.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-background/50 p-10 rounded-3xl border-2 border-transparent hover:border-purple-500 transition-all hover:shadow-xl-soft">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-foreground">Crowdsourced Truth</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built from <strong>real freelancer submissions</strong>, not job listings. Our data comes from people like you, not recruiters or platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <ProfitabilityCalculator />

      {/* How It Works */}
      <section className="py-24 px-6 pattern-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
              Three Steps to Pricing Confidence
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: 1, icon: <Search className="h-5 w-5" />, title: "Search Your Skill", desc: "Enter your skill (React, Python, Design, etc.) and location to see real market rates from verified sources." },
              { step: 2, icon: <BarChart3 className="h-5 w-5" />, title: "Compare Rates", desc: "View P25, P50, P75, and P90 percentiles. Know exactly where you stand vs. the market." },
              { step: 3, icon: <Rocket className="h-5 w-5" />, title: "Price Confidently", desc: "Use data-backed rates in your proposals. Stop leaving money on the table. Earn what you deserve." }
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center text-3xl font-black mx-auto group-hover:scale-110 transition-transform shadow-lg">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { icon: <Users className="h-10 w-10" />, value: SITE_METRICS.trustedUsers, label: "Trusted Users" },
              { icon: <CheckCircle2 className="h-10 w-10" />, value: SITE_METRICS.verifiedRates, label: "Verified Rates" },
              { icon: <Sparkles className="h-10 w-10" />, value: SITE_METRICS.skillsCovered, label: "Skills Covered" },
              { icon: <Globe className="h-10 w-10" />, value: SITE_METRICS.countries, label: "Countries" }
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-5xl font-black text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-primary to-green-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48"></div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black">
            Ready to know your worth?
          </h2>
          <p className="text-2xl opacity-90">
            Join {SITE_METRICS.trustedUsers} freelancers using PriceIQ to price smarter. 100% free. Forever.
          </p>
          <div className="flex flex-wrap gap-6 justify-center pt-4">
            <Link
              href="/explore"
              className="bg-foreground text-background px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-xl hover:bg-black/80 transition-all hover:scale-105"
            >
              <Search className="h-6 w-6" />
              Start Exploring Rates
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
