export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background py-16 px-6">
            <div className="max-w-3xl mx-auto prose prose-invert prose-green">
                <h1 className="text-4xl font-black mb-8 text-foreground">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last Updated: January 16, 2026</p>

                <section className="space-y-6 text-muted-foreground">
                    <p>
                        Welcome to PriceIQ. By accessing our website, you agree to be bound by these Terms of Service.
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Use of Data</h3>
                    <p>
                        The data provided on PriceIQ is for informational purposes only. While we verify submissions to the best of our ability, we do not guarantee the 100% accuracy of market rates. You should not rely solely on this data for legal or financial contracts.
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. User Contributions</h3>
                    <p>
                        By submitting data to PriceIQ, you grant us a perpetual, irrevocable, worldwide license to use, display, and analyze that data in aggregate form. You warrant that any data you submit is truthful and accurate to your knowledge.
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Prohibited Conduct</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Submitting false or malicious data.</li>
                        <li>Scraping our database for commercial resale.</li>
                        <li>Attempting to reverse-engineer user identities.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Limitation of Liability</h3>
                    <p>
                        PriceIQ operates "as-is". We are not liable for any lost profits or damages arising from your use of free market data found on this platform.
                    </p>
                </section>
            </div>
        </main>
    )
}
