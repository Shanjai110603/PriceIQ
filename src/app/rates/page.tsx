export default function RatesIndexPage() {
    return (
        <main className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">
                        Freelance Rates by Skill
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore verified hourly rates for 100+ freelance skills based on real market data.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                        'React', 'Node.js', 'Python', 'UI/UX Design', 'DevOps',
                        'iOS Development', 'Android Development', 'Data Science',
                        'Machine Learning', 'Blockchain', 'Cybersecurity', 'Technical Writing',
                        'Motion Graphics', 'Product Design', 'Copywriting', 'SEO'
                    ].map((skill) => (
                        <a
                            key={skill}
                            href={`/rates/${skill.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            className="bg-card p-6 rounded-2xl border border-border hover:border-primary hover:shadow-xl-soft transition-all group"
                        >
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {skill}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">View Rates →</div>
                        </a>
                    ))}
                </div>

                <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Don't see your skill?
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Use our advanced search to explore rates for 200+ skills
                    </p>
                    <a
                        href="/explore"
                        className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        Search All Skills
                    </a>
                </div>
            </div>
        </main>
    )
}
