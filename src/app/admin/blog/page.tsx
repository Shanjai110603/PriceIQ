"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string
    category: string
    read_time: string
    published: boolean
    created_at: string
    updated_at: string
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAdmin()
        fetchPosts()
    }, [])

    async function checkAdmin() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/auth/login')
            return
        }

        const role = session.user.user_metadata?.role
        if (role !== 'admin') {
            toast.error('Access denied: Admin only')
            router.push('/')
            return
        }

        setIsAdmin(true)
    }

    async function fetchPosts() {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Failed to load posts')
            console.error(error)
        } else {
            setPosts(data || [])
        }
        setLoading(false)
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        const { error } = await supabase
            .from('blog_posts')
            .update({
                published: !currentStatus,
                published_at: !currentStatus ? new Date().toISOString() : null
            })
            .eq('id', id)

        if (error) {
            toast.error('Failed to update post')
        } else {
            toast.success(currentStatus ? 'Post unpublished' : 'Post published!')
            fetchPosts()
        }
    }

    async function deletePost(id: string) {
        if (!confirm('Are you sure you want to delete this post?')) return

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('Failed to delete post')
        } else {
            toast.success('Post deleted')
            fetchPosts()
        }
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Checking permissions...</h1>
                    <p className="text-muted-foreground">Please wait</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-foreground">Blog Management</h1>
                        <p className="text-muted-foreground mt-2">Create and manage blog posts</p>
                    </div>
                    <Link
                        href="/admin/blog/new"
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        New Post
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-card border border-border rounded-3xl p-12 text-center">
                        <h2 className="text-xl font-bold text-foreground mb-2">No posts yet</h2>
                        <p className="text-muted-foreground mb-6">Create your first blog post to get started</p>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Create Post
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl-soft transition-all"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
                                            {post.published ? (
                                                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-bold">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
                                            <span>{post.read_time}</span>
                                            <span>/{post.slug}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => togglePublish(post.id, post.published)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            title={post.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {post.published ? (
                                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-green-500" />
                                            )}
                                        </button>
                                        <Link
                                            href={`/admin/blog/edit/${post.id}`}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-5 w-5 text-muted-foreground" />
                                        </Link>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
