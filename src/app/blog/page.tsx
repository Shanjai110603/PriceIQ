"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    read_time: string
    og_image_url: string | null
    published_at: string
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPosts() {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('id, slug, title, excerpt, category, read_time, og_image_url, published_at')
                .eq('published', true)
                .order('published_at', { ascending: false })

            if (!error && data) {
                setPosts(data)
            }
            setLoading(false)
        }
        fetchPosts()
    }, [])

    return (
        <main className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">PriceIQ Blog</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Market insights, pricing strategies, and freelance trends backed by real data.
                    </p>
                </header>

                {loading ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card border border-border rounded-3xl p-6 animate-pulse">
                                <div className="aspect-[2/1] bg-muted rounded-2xl mb-6"></div>
                                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl-soft transition-all group"
                            >
                                {/* Thumbnail */}
                                {post.og_image_url ? (
                                    <div className="relative aspect-[2/1] w-full overflow-hidden">
                                        <Image
                                            src={post.og_image_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-[2/1] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                        <div className="text-6xl font-black text-primary/20">P</div>
                                    </div>
                                )}

                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                                            {post.category}
                                        </span>
                                        <span className="text-muted-foreground">{post.read_time}</span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                        Read Article
                                        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
