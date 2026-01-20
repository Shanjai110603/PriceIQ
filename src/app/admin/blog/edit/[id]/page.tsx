"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

export default function EditBlogPostPage() {
    const params = useParams()
    const postId = params.id as string
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("Guides")
    const [readTime, setReadTime] = useState("5 min read")
    const [ogImage, setOgImage] = useState("")
    const [published, setPublished] = useState(false)

    useEffect(() => {
        async function checkAdminAndLoadPost() {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session || session.user.user_metadata?.role !== 'admin') {
                toast.error('Access denied')
                router.push('/')
                return
            }

            // Load post
            const { data: post, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', postId)
                .single()

            if (error || !post) {
                toast.error('Post not found')
                router.push('/admin/blog')
                return
            }

            // Populate form
            setTitle(post.title)
            setSlug(post.slug)
            setExcerpt(post.excerpt)
            setContent(post.content)
            setCategory(post.category)
            setReadTime(post.read_time)
            setOgImage(post.og_image_url || '')
            setPublished(post.published)
            setLoading(false)
        }
        checkAdminAndLoadPost()
    }, [postId, router])

    async function saveChanges(publishNow = false) {
        if (!title || !slug || !excerpt || !content) {
            toast.error('Please fill in all required fields')
            return
        }

        setSaving(true)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {
            title,
            slug,
            excerpt,
            content,
            category,
            read_time: readTime,
            og_image_url: ogImage || null,
            updated_at: new Date().toISOString()
        }

        if (publishNow !== published) {
            updates.published = publishNow
            updates.published_at = publishNow ? new Date().toISOString() : null
        }

        const { error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', postId)

        setSaving(false)

        if (error) {
            toast.error('Failed to save changes')
            console.error(error)
        } else {
            toast.success('Changes saved!')
            setPublished(publishNow)
            router.push('/admin/blog')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Loading post...</p>
                </div>
            </div>
        )
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
                    <h1 className="text-4xl font-black text-foreground">Edit Blog Post</h1>
                    <p className="text-muted-foreground mt-2">Update your article</p>
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
                            onClick={() => saveChanges(false)}
                            disabled={saving}
                            className="flex-1 bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="h-5 w-5" />
                            {saving ? 'Saving...' : published ? 'Save as Draft' : 'Save Draft'}
                        </button>
                        <button
                            onClick={() => saveChanges(true)}
                            disabled={saving}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Eye className="h-5 w-5" />
                            {saving ? 'Saving...' : published ? 'Save & Keep Published' : 'Save & Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
