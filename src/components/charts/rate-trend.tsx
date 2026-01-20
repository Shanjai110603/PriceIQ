"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface RateTrendChartProps {
    skillId: number
    locationId?: number | null
    skillName: string
}

export function RateTrendChart({ skillId, locationId, skillName }: RateTrendChartProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const { data: chartData, error } = await supabase.rpc('get_rate_trends', {
                    target_skill_id: skillId,
                    target_location_id: locationId || null
                })

                if (error) throw error

                setData(chartData || [])
            } catch (err) {
                console.error("Trend chart fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [skillId, locationId])

    if (loading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />
    }

    if (data.length < 2) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                Not enough historical data for trends yet.
            </div>
        )
    }

    return (
        <Card className="shadow-sm border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rate Trends for {skillName}</CardTitle>
                <CardDescription>Average hourly rate over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            domain={['dataMin - 10', 'dataMax + 10']}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload
                                    return (
                                        <div className="bg-background border border-border p-2 rounded-lg shadow-lg text-sm">
                                            <div className="font-bold mb-1">{item.month}</div>
                                            <div>Avg: <span className="font-mono font-bold">${item.avg_rate}</span></div>
                                            <div className="text-xs text-muted-foreground mt-1">{item.sample_count} submissions</div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="avg_rate"
                            stroke="currentColor"
                            strokeWidth={2}
                            dot={{ fill: "currentColor" }}
                            className="stroke-primary fill-primary"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
