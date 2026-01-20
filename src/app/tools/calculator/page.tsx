"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CalculatorPage() {
    // State for inputs
    const [incomeGoal, setIncomeGoal] = useState(100000)
    const [daysPerWeek, setDaysPerWeek] = useState(5)
    const [hoursPerDay, setHoursPerDay] = useState(6)
    const [vacationWeeks, setVacationWeeks] = useState(4)
    const [nonBillablePercent, setNonBillablePercent] = useState(25)
    const [expenses, setExpenses] = useState(5000)
    const [taxRate, setTaxRate] = useState(25)

    // State for results
    const [results, setResults] = useState({
        hourlyRate: 0,
        dailyRate: 0,
        monthlyRate: 0,
        annualRevenue: 0,
        billableHours: 0,
        netIncome: 0
    })

    // Calculate whenever inputs change
    useEffect(() => {
        // 1. Calculate Time Availability
        const weeksPerYear = 52
        const workingWeeks = weeksPerYear - vacationWeeks
        const totalDays = workingWeeks * daysPerWeek
        const totalHours = totalDays * hoursPerDay

        // Adjust for non-billable time (marketing, admin, etc.)
        const billableHours = totalHours * ((100 - nonBillablePercent) / 100)

        // 2. Calculate Financials
        // Formula: We need enough Gross Revenue to cover:
        // - Net Income Goal (What goes in pocket)
        // - Expenses
        // - Taxes (Calculated on Gross Revenue usually, or (Gross-Exp)? Let's assume Tax is on (Gross-Exp) i.e. Profit)
        // Warning: Simplified tax logic. 
        // Let Needs = IncomeGoal + Expenses
        // Gross - (Gross-Exp)*TaxRate = Needs ? No.
        // Let's use: Gross = (NetGoal + Expenses) / (1 - TaxRate) -> This assumes tax is on EVERYTHING which is conservative/safe.
        // Better: EarningsBeforeTax = NetGoal / (1 - TaxRate)
        // GrossRevenue = EarningsBeforeTax + Expenses

        const earningsBeforeTax = incomeGoal / (1 - (taxRate / 100))
        const requiredAnnualRevenue = earningsBeforeTax + expenses

        const hourlyMinimum = requiredAnnualRevenue / billableHours

        setResults({
            hourlyRate: Math.ceil(hourlyMinimum),
            dailyRate: Math.ceil(hourlyMinimum * hoursPerDay),
            monthlyRate: Math.ceil(requiredAnnualRevenue / 12),
            annualRevenue: Math.ceil(requiredAnnualRevenue),
            billableHours: Math.floor(billableHours),
            netIncome: incomeGoal
        })
    }, [incomeGoal, daysPerWeek, hoursPerDay, vacationWeeks, nonBillablePercent, expenses, taxRate])

    // Platform Fee Data
    const platforms = [
        { name: "Direct / Invoice", fee: 0, fixed: 0, icon: "payments" },
        { name: "Upwork", fee: 10, fixed: 0, icon: "work" }, // Simplified avg
        { name: "Fiverr", fee: 20, fixed: 0, icon: "handshake" },
        { name: "Stripe", fee: 2.9, fixed: 0.30, icon: "credit_card" },
        { name: "PayPal", fee: 3.49, fixed: 0.49, icon: "account_balance_wallet" },
    ]

    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-lg">calculate</span>
                        Freelance Profitability Engine
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#121811] dark:text-white">
                        What Should You Charge?
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stop guessing. Reverse-engineer your hourly rate based on your life goals, expenses, and taxes.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: INPUTS */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white dark:bg-[#1a2915] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-[#121811] dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                Configuration
                            </h2>

                            <div className="space-y-8">
                                {/* 1. Income Goal */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Annual Net Income Goal</label>
                                        <div className="text-2xl font-black text-primary">${incomeGoal.toLocaleString()}</div>
                                    </div>
                                    <input
                                        type="range"
                                        min="20000"
                                        max="500000"
                                        step="5000"
                                        value={incomeGoal}
                                        onChange={(e) => setIncomeGoal(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:accent-green-400"
                                        aria-label="Annual Net Income Goal"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 font-bold">
                                        <span>$20k</span>
                                        <span>$250k</span>
                                        <span>$500k+</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Billable Time */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block">Time Availability</label>

                                        <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-[#121811] dark:text-white font-medium">Days / Week</span>
                                                    <span className="font-bold">{daysPerWeek}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="7"
                                                    value={daysPerWeek}
                                                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                                                    className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                                    aria-label="Days per week"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-[#121811] dark:text-white font-medium">Hours / Day</span>
                                                    <span className="font-bold">{hoursPerDay}h</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="12"
                                                    value={hoursPerDay}
                                                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                                                    className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                                    aria-label="Hours per day"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-[#121811] dark:text-white font-medium">Vacation Weeks</span>
                                                    <span className="font-bold">{vacationWeeks}w</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="12"
                                                    value={vacationWeeks}
                                                    onChange={(e) => setVacationWeeks(Number(e.target.value))}
                                                    className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                                    aria-label="Vacation weeks"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expenses & Taxes */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block">Business Costs</label>

                                        <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-[#121811] dark:text-white font-medium">Non-Billable Time</span>
                                                    <span className="font-bold">{nonBillablePercent}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    step="5"
                                                    value={nonBillablePercent}
                                                    onChange={(e) => setNonBillablePercent(Number(e.target.value))}
                                                    className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                                    aria-label="Non-billable time percentage"
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1">Admin, marketing, learning</p>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-[#121811] dark:text-white font-medium">Tax Rate</span>
                                                    <span className="font-bold">{taxRate}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    step="1"
                                                    value={taxRate}
                                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                                    className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                                    aria-label="Tax rate percentage"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="text-[#121811] dark:text-white font-medium">Annual Expenses</span>
                                                    <span className="font-bold">${expenses}</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={expenses}
                                                    onChange={(e) => setExpenses(Number(e.target.value))}
                                                    className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-1 text-sm font-bold text-[#121811] dark:text-white"
                                                    aria-label="Annual Expenses"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Platform Fees Table */}
                        <div className="bg-white dark:bg-[#1a2915] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-[#121811] dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">compare_arrows</span>
                                Platform Fee Impact
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5 text-left">
                                            <th className="py-3 px-4 font-bold text-gray-500">Platform</th>
                                            <th className="py-3 px-4 font-bold text-gray-500 text-right">You Quote</th>
                                            <th className="py-3 px-4 font-bold text-gray-500 text-right">You Keep</th>
                                            <th className="py-3 px-4 font-bold text-gray-500 text-right">Fee/Yr</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platforms.map(p => {
                                            const feePerHr = (results.hourlyRate * (p.fee / 100)) + p.fixed
                                            const netRate = results.hourlyRate - feePerHr
                                            const annualLoss = feePerHr * results.billableHours

                                            return (
                                                <tr key={p.name} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-[#121811] dark:text-white flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-gray-400 text-lg">{p.icon}</span>
                                                        {p.name}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-gray-500">${results.hourlyRate.toFixed(0)}</td>
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
                        <div className="bg-gradient-to-br from-primary to-green-600 rounded-3xl p-8 text-[#121811] relative overflow-hidden shadow-xl shadow-primary/20">
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
                            <div className="bg-white dark:bg-[#1a2915] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined">payments</span>
                                    <span className="text-xs font-bold uppercase">Gross Revenue</span>
                                </div>
                                <div className="text-2xl font-black text-[#121811] dark:text-white">
                                    ${results.annualRevenue.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Pre-tax annual</div>
                            </div>

                            <div className="bg-white dark:bg-[#1a2915] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined">schedule</span>
                                    <span className="text-xs font-bold uppercase">Billable Hours</span>
                                </div>
                                <div className="text-2xl font-black text-[#121811] dark:text-white">
                                    {results.billableHours.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Per year</div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-2xl text-center space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Is this rate realistic? Check market data to compare.
                            </p>
                            <Link href="/explore" className="block w-full bg-[#121811] dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Check Market Rates
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
