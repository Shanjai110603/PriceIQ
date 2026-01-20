"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface RateDistributionChartProps {
    skillId: number
    locationId?: number | null
    skillName: string
}

export function RateDistributionChart({ skillId, locationId, skillName }: RateDistributionChartProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const { data: chartData, error } = await supabase.rpc('get_rate_distribution', {
                    target_skill_id: skillId,
                    target_location_id: locationId || null
                })

                if (error) throw error

                // Format for Recharts
                const formatted = chartData?.map((d: any) => ({
                    range: `$${d.bucket_floor}`,
                    count: d.frequency,
                    fullRange: `$${d.bucket_floor} - $${d.bucket_ceiling}`
                })) || []

                setData(formatted)
            } catch (err) {
                console.error("Chart fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [skillId, locationId])

    if (loading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />
    }

    if (data.length === 0) {
        return null // Don't show empty chart, keeps UI clean
    }

    return (
        <Card className="shadow-sm border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rate Distribution for {skillName}</CardTitle>
                <CardDescription>Frequency of hourly rates submitted</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="range"
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
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload
                                    return (
                                        <div className="bg-background border border-border p-2 rounded-lg shadow-lg text-sm">
                                            <div className="font-bold mb-1">{item.fullRange}</div>
                                            <div>Count: <span className="font-mono">{item.count}</span></div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        {/* Use CSS variable or fallback color */}
                        <Bar
                            dataKey="count"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
