export interface Skill {
    id: number
    name: string
    category: string
    created_at: string
}

export interface Location {
    id: number
    city: string
    country: string
    created_at: string
}

export type Seniority = 'junior' | 'mid' | 'senior' | 'expert'
export type ProjectType = 'hourly' | 'fixed'

export interface RateSubmission {
    id: string
    user_id: string | null
    skill_id: number
    location_id: number
    seniority_level: Seniority
    hourly_rate: number
    project_type: ProjectType
    years_experience: number | null
    is_approved: boolean
    is_verified: boolean
    fraud_score: number
    submitted_at: string
    approved_at: string | null
    approved_by: string | null
}

export interface MarketRates {
    p25: number
    p50: number
    p75: number
    p90: number
    sample_count: number
}

export interface RateSearchParams {
    skill_id?: number
    location_id?: number
    seniority?: Seniority
}

export interface SubmitRateData {
    skill_id: number
    location_id: number
    seniority_level: Seniority
    hourly_rate: number
    project_type: ProjectType
    years_experience?: number
}
