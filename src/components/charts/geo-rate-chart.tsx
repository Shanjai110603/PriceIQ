"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface GeoRateChartProps {
    skillId: number
    skillName: string
}

export function GeoRateChart({ skillId, skillName }: GeoRateChartProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const { data: chartData, error } = await supabase.rpc('get_geo_rates', {
                    target_skill_id: skillId
                })

                if (error) throw error

                setData(chartData || [])
            } catch (err) {
                console.error("Geo chart fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [skillId])

    if (loading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />
    }

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                Not enough location data yet.
            </div>
        )
    }

    return (
        <Card className="shadow-sm border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Locations for {skillName}</CardTitle>
                <CardDescription>Average rates by top cities/countries</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="location_name"
                            type="category"
                            width={100}
                            stroke="#888888"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload
                                    return (
                                        <div className="bg-background border border-border p-2 rounded-lg shadow-lg text-sm">
                                            <div className="font-bold mb-1">{item.location_name}</div>
                                            <div>Avg: <span className="font-mono font-bold">${item.avg_rate}</span></div>
                                            <div className="text-xs text-muted-foreground mt-1">{item.sample_count} samples</div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey="avg_rate"
                            fill="currentColor"
                            radius={[0, 4, 4, 0]}
                            className="fill-primary"
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
