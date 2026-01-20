import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Explore Rates",
    description: "Search and compare freelance rates by skill and location. View market distribution and trends.",
}

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
