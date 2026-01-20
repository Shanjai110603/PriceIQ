export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark pattern-bg">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#1a2915] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-primary/5">
                {children}
            </div>
        </div>
    )
}
