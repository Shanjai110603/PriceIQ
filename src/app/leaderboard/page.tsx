"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Medal, Trophy, Star } from "lucide-react"

interface LeaderboardEntry {
    id: string
    full_name: string
    avatar_url: string
    score: number // Placeholder for submission count or points
    rank: number
    badges?: string[]
}

// Mock data for MVP since we might not have many real users yet
const MOCK_LEADERS: LeaderboardEntry[] = [
    { id: '1', full_name: 'Alex Johnson', avatar_url: '', score: 142, rank: 1, badges: ['verified', 'pioneer'] },
    { id: '2', full_name: 'Sarah Chen', avatar_url: '', score: 98, rank: 2, badges: ['verified'] },
    { id: '3', full_name: 'Mike Smith', avatar_url: '', score: 75, rank: 3, badges: ['pioneer'] },
    { id: '4', full_name: 'Emma Wilson', avatar_url: '', score: 45, rank: 4, badges: [] },
    { id: '5', full_name: 'David Brown', avatar_url: '', score: 32, rank: 5, badges: [] },
]

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In a real app, query 'profiles' joined with 'rate_submissions' count
        // For MVP demo, we'll mix real users (if any) with mock high scores
        async function fetchLeaders() {
            try {
                // Fetch real top users if we had them
                // const { data } = await supabase.from('profiles').select('*').limit(5)
                setLeaders(MOCK_LEADERS)
            } catch (error) {
                console.error("Error fetching leaderboard", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaders()
    }, [])

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
                    <Trophy className="h-10 w-10 text-yellow-500" />
                    Community Leaderboard
                </h1>
                <p className="text-muted-foreground text-lg">
                    Top contributors help keep freelancing fair for everyone.
                </p>
            </div>

            <Card className="border-border/50 shadow-lg">
                <CardHeader className="bg-muted/30 pb-4">
                    <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-7">Contributor</div>
                        <div className="col-span-3 text-right">Points</div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {leaders.map((leader) => (
                        <div
                            key={leader.id}
                            className="grid grid-cols-12 items-center p-4 border-b last:border-0 hover:bg-muted/20 transition-colors"
                        >
                            <div className="col-span-2 flex justify-center">
                                {leader.rank === 1 && <Medal className="h-6 w-6 text-yellow-500" />}
                                {leader.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                                {leader.rank === 3 && <Medal className="h-6 w-6 text-amber-600" />}
                                {leader.rank > 3 && <span className="font-bold text-muted-foreground">#{leader.rank}</span>}
                            </div>
                            <div className="col-span-7 flex items-center gap-4">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarImage src={leader.avatar_url} />
                                    <AvatarFallback>{leader.full_name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-foreground">{leader.full_name}</p>
                                        {/* Render Badges */}
                                        {leader.badges?.includes('verified') && (
                                            <span title="Verified Contributor" className="h-4 w-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px]">✓</span>
                                        )}
                                        {leader.badges?.includes('pioneer') && (
                                            <span title="Early Adopter" className="h-4 w-4 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px]">🚀</span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        <span>Top Contributor</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-lg">
                                {leader.score}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
