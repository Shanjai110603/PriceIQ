export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background py-16 px-6">
            <div className="max-w-3xl mx-auto prose prose-invert prose-green">
                <h1 className="text-4xl font-black mb-8 text-foreground">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last Updated: January 16, 2026</p>

                <section className="space-y-6 text-muted-foreground">
                    <p>
                        At <strong>PriceIQ</strong>, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our website.
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Data We Collect</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Rate Data:</strong> When you submit a rate, we collect the hourly/project rate, skill, years of experience, and broad location (Country/City). We <strong>DO NOT</strong> collect your specific street address or employer name.</li>
                        <li><strong>Usage Data:</strong> We collect anonymous data about how you interact with our charts and search features to improve the platform.</li>
                        <li><strong>Authentication:</strong> If you sign up, we store your email address securely via Supabase Auth.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Data</h3>
                    <p>
                        The primary purpose of data collection is to generate aggregate market insights. Your individual rate submission is anonymized and pooled with thousands of others to calculate medians, averages, and percentiles.
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Data Sharing</h3>
                    <p>
                        We do not sell your personal data. We engage in "Open Data" practices where aggregated, anonymized statistics may be shared publicly to help the freelance community.
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Cookies</h3>
                    <p>
                        We use minimal local storage and cookies to maintain your login session and track whether you have contributed data (to unlock features).
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Contact</h3>
                    <p>
                        For any privacy concerns, please contact us at privacy@priceiq.com.
                    </p>
                </section>
            </div>
        </main>
    )
}
