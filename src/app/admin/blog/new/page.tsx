"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

export default function NewBlogPostPage() {
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("Guides")
    const [readTime, setReadTime] = useState("5 min read")
    const [ogImage, setOgImage] = useState("")
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    // Auto-generate slug from title
    useEffect(() => {
        if (title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setSlug(generatedSlug)
        }
    }, [title])

    // Auto-calculate read time
    useEffect(() => {
        if (content) {
            const words = content.split(/\s+/).length
            const minutes = Math.ceil(words / 200) // ~200 words per minute
            setReadTime(`${minutes} min read`)
        }
    }, [content])

    async function checkAdmin() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session || session.user.user_metadata?.role !== 'admin') {
            toast.error('Access denied')
            router.push('/')
            return false
        }
        return true
    }

    async function saveDraft() {
        if (!await checkAdmin()) return

        if (!title || !slug || !excerpt || !content) {
            toast.error('Please fill in all required fields')
            return
        }

        setSaving(true)

        const { data: { session } } = await supabase.auth.getSession()

        const { error } = await supabase.from('blog_posts').insert({
            slug,
            title,
            excerpt,
            content,
            category,
            read_time: readTime,
            author_id: session!.user.id,
            og_image_url: ogImage || null,
            published: false
        })

        setSaving(false)

        if (error) {
            toast.error('Failed to save draft')
            console.error(error)
        } else {
            toast.success('Draft saved!')
            router.push('/admin/blog')
        }
    }

    async function publishPost() {
        if (!await checkAdmin()) return

        if (!title || !slug || !excerpt || !content) {
            toast.error('Please fill in all required fields')
            return
        }

        setSaving(true)

        const { data: { session } } = await supabase.auth.getSession()

        const { error } = await supabase.from('blog_posts').insert({
            slug,
            title,
            excerpt,
            content,
            category,
            read_time: readTime,
            author_id: session!.user.id,
            og_image_url: ogImage || null,
            published: true,
            published_at: new Date().toISOString()
        })

        setSaving(false)

        if (error) {
            toast.error('Failed to publish post')
            console.error(error)
        } else {
            toast.success('Post published!')
            router.push('/admin/blog')
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/blog"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog Management
                    </Link>
                </div>

                <div>
                    <h1 className="text-4xl font-black text-foreground">Create New Blog Post</h1>
                    <p className="text-muted-foreground mt-2">Write and publish a new article</p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="How to Price Your Freelance Services"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            URL Slug *
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">/blog/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="how-to-price-freelance-services"
                                className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    {/* Category & Read Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
                            >
                                <option>Guides</option>
                                <option>Market Trends</option>
                                <option>Data Analysis</option>
                                <option>Case Studies</option>
                                <option>News</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">
                                Read Time
                            </label>
                            <input
                                type="text"
                                value={readTime}
                                onChange={(e) => setReadTime(e.target.value)}
                                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Excerpt * (for cards & SEO)
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="A brief summary of what this article covers..."
                            rows={3}
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                        />
                    </div>

                    {/* OG Image */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            OG Image URL (optional)
                        </label>
                        <input
                            type="text"
                            value={ogImage}
                            onChange={(e) => setOgImage(e.target.value)}
                            placeholder="/blog/my-post-og.png"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Content * (Markdown supported)
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your article content here... You can use Markdown formatting."
                            rows={20}
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground font-mono text-sm resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Supports Markdown: **bold**, *italic*, [links](url), # headings, etc.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-6 border-t border-border">
                        <button
                            onClick={saveDraft}
                            disabled={saving}
                            className="flex-1 bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="h-5 w-5" />
                            {saving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button
                            onClick={publishPost}
                            disabled={saving}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Eye className="h-5 w-5" />
                            {saving ? 'Publishing...' : 'Publish Now'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
