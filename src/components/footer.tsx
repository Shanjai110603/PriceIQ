import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t border-border py-12 px-6 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-lg">
                                P
                            </div>
                            <span className="text-xl font-black text-foreground">PriceIQ</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The most accurate freelance pricing intelligence platform.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase text-muted-foreground">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">Explore Rates</Link></li>
                            <li><Link href="/submit" className="text-muted-foreground hover:text-primary transition-colors">Submit Rate</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase text-muted-foreground">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase text-muted-foreground">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/guide" className="text-muted-foreground hover:text-primary transition-colors">Pricing Guide</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">© 2026 PriceIQ. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
