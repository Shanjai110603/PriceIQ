"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
    Calculator,
    Sliders,
    CreditCard,
    Briefcase,
    Handshake,
    Wallet,
    ArrowLeftRight,
    Clock,
    Banknote
} from "lucide-react"

export function ProfitabilityCalculator() {
    // State for inputs
    const [incomeGoal, setIncomeGoal] = useState(100000)
    const [daysPerWeek, setDaysPerWeek] = useState(5)
    const [hoursPerDay, setHoursPerDay] = useState(6)
    const [vacationWeeks, setVacationWeeks] = useState(4)
    const [nonBillablePercent, setNonBillablePercent] = useState(25)
    const [expenses, setExpenses] = useState(5000)
    const [taxRate, setTaxRate] = useState(25)

    // State for results


    // Calculate Financials
    const results = useMemo(() => {
        const weeksPerYear = 52
        const workingWeeks = weeksPerYear - vacationWeeks
        const totalDays = workingWeeks * daysPerWeek
        const totalHours = totalDays * hoursPerDay

        // Adjust for non-billable time (marketing, admin, etc.)
        const billableHours = totalHours * ((100 - nonBillablePercent) / 100)

        // Calculate Financials: EarningsBeforeTax = NetGoal / (1 - TaxRate)
        const earningsBeforeTax = incomeGoal / (1 - (taxRate / 100))
        const requiredAnnualRevenue = earningsBeforeTax + expenses

        const hourlyMinimum = requiredAnnualRevenue / (billableHours || 1) // Avoid div by 0

        return {
            hourlyRate: Math.ceil(hourlyMinimum),
            dailyRate: Math.ceil(hourlyMinimum * hoursPerDay),
            monthlyRate: Math.ceil(requiredAnnualRevenue / 12),
            annualRevenue: Math.ceil(requiredAnnualRevenue),
            billableHours: Math.floor(billableHours),
            netIncome: incomeGoal
        }
    }, [incomeGoal, daysPerWeek, hoursPerDay, vacationWeeks, nonBillablePercent, expenses, taxRate])

    // Platform Fee Data
    const platforms = [
        { name: "Direct / Invoice", fee: 0, fixed: 0, icon: <Banknote className="h-5 w-5" /> },
        { name: "Upwork", fee: 10, fixed: 0, icon: <Briefcase className="h-5 w-5" /> },
        { name: "Fiverr", fee: 20, fixed: 0, icon: <Handshake className="h-5 w-5" /> },
        { name: "Stripe", fee: 2.9, fixed: 0.30, icon: <CreditCard className="h-5 w-5" /> },
        { name: "PayPal", fee: 3.49, fixed: 0.49, icon: <Wallet className="h-5 w-5" /> },
    ]

    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold uppercase tracking-wider">
                        <Calculator className="h-5 w-5" />
                        Freelance Profitability Engine
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground">
                        What Should You Charge?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stop guessing. Reverse-engineer your hourly rate based on your life goals, expenses, and taxes.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: INPUTS */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                                <Sliders className="h-6 w-6 text-primary" />
                                Configuration
                            </h2>

                            <div className="space-y-8">
                                {/* 1. Income Goal */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Annual Net Income Goal</label>
                                        <div className="text-2xl font-black text-primary">${incomeGoal.toLocaleString('en-US')}</div>
                                    </div>
                                    <input
                                        type="range"
                                        min="20000"
                                        max="500000"
                                        step="5000"
                                        value={incomeGoal}
                                        onChange={(e) => setIncomeGoal(Number(e.target.value))}
                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/90"
                                        aria-label="Annual Net Income Goal"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground font-bold">
                                        <span>$20k</span>
                                        <span>$250k</span>
                                        <span>$500k+</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Billable Time */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Time Availability</label>

                                        <div className="bg-muted/50 p-4 rounded-xl space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-foreground font-medium">Days / Week</span>
                                                    <span className="font-bold text-foreground/80">{daysPerWeek}</span>
                                                </div>
                                                <input type="range" min="1" max="7" value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))} className="w-full h-1 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-primary" aria-label="Days per week" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-foreground font-medium">Hours / Day</span>
                                                    <span className="font-bold text-foreground/80">{hoursPerDay}h</span>
                                                </div>
                                                <input type="range" min="1" max="12" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} className="w-full h-1 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-primary" aria-label="Hours per day" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-foreground font-medium">Vacation Weeks</span>
                                                    <span className="font-bold text-foreground/80">{vacationWeeks}w</span>
                                                </div>
                                                <input type="range" min="0" max="12" value={vacationWeeks} onChange={(e) => setVacationWeeks(Number(e.target.value))} className="w-full h-1 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-primary" aria-label="Vacation weeks" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expenses & Taxes */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Business Costs</label>

                                        <div className="bg-muted/50 p-4 rounded-xl space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-foreground font-medium">Non-Billable Time</span>
                                                    <span className="font-bold text-foreground/80">{nonBillablePercent}%</span>
                                                </div>
                                                <input type="range" min="0" max="50" step="5" value={nonBillablePercent} onChange={(e) => setNonBillablePercent(Number(e.target.value))} className="w-full h-1 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-primary" aria-label="Non-billable time percentage" />
                                                <p className="text-[10px] text-muted-foreground mt-1">Admin, marketing, learning</p>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-foreground font-medium">Tax Rate</span>
                                                    <span className="font-bold text-foreground/80">{taxRate}%</span>
                                                </div>
                                                <input type="range" min="0" max="50" step="1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full h-1 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-primary" aria-label="Tax rate percentage" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-foreground font-medium">Annual Expenses</span>
                                                    <span className="font-bold text-foreground/80">${expenses}</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={expenses}
                                                    onChange={(e) => setExpenses(Number(e.target.value))}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-1 text-sm font-bold text-foreground"
                                                    aria-label="Annual Expenses"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Platform Fees Table */}
                        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                                Platform Fee Impact
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-left">
                                            <th className="py-3 px-4 font-bold text-muted-foreground">Platform</th>
                                            <th className="py-3 px-4 font-bold text-muted-foreground text-right">You Quote</th>
                                            <th className="py-3 px-4 font-bold text-muted-foreground text-right">You Keep</th>
                                            <th className="py-3 px-4 font-bold text-muted-foreground text-right">Fee/Yr</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platforms.map(p => {
                                            const feePerHr = (results.hourlyRate * (p.fee / 100)) + p.fixed
                                            const netRate = results.hourlyRate - feePerHr
                                            const annualLoss = feePerHr * results.billableHours

                                            return (
                                                <tr key={p.name} className="border-b border-border hover:bg-muted/20 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-foreground flex items-center gap-2">
                                                        <span className="text-muted-foreground">{p.icon}</span>
                                                        {p.name}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-muted-foreground">${results.hourlyRate.toFixed(0)}</td>
                                                    <td className="py-3 px-4 text-right font-bold text-primary">${netRate.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-right text-red-500">-${annualLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                        {/* Main Primary Card */}
                        <div className="bg-gradient-to-br from-primary to-green-600 rounded-3xl p-8 text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-2xl rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <p className="font-bold opacity-80 mb-1 uppercase tracking-wider text-sm">Your Target Hourly Rate</p>
                                <div className="text-7xl md:text-8xl font-black tracking-tighter mb-4">
                                    ${results.hourlyRate}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/10">
                                    <div>
                                        <p className="text-xs font-bold opacity-60 uppercase">Daily Rate</p>
                                        <p className="text-xl font-black">${results.dailyRate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold opacity-60 uppercase">Project (40h)</p>
                                        <p className="text-xl font-black">${results.hourlyRate * 40}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                    <Banknote className="h-5 w-5" />
                                    <span className="text-xs font-bold uppercase">Gross Revenue</span>
                                </div>
                                <div className="text-2xl font-black text-foreground">
                                    ${results.annualRevenue.toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Pre-tax annual</div>
                            </div>

                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                                    <Clock className="h-5 w-5" />
                                    <span className="text-xs font-bold uppercase">Billable Hours</span>
                                </div>
                                <div className="text-2xl font-black text-foreground">
                                    {results.billableHours.toLocaleString('en-US')}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Per year</div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-muted p-6 rounded-2xl text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Is this rate realistic? Check market data to compare.
                            </p>
                            <Link href="/explore" className="block w-full bg-foreground text-background py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Check Market Rates
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
