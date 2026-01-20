import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
    envConfig.NEXT_PUBLIC_SUPABASE_URL,
    envConfig.SUPABASE_SERVICE_ROLE_KEY // MUST use service role to bypass RLS if needed, or ensuring policy allows insert
);

// Configuration
const TARGET_SKILLS = ['React', 'Node.js', 'UI/UX Design', 'Python', 'DevOps'];
const LOCATIONS_TIERS = {
    high: ['San Francisco, USA', 'New York, USA', 'London, UK'],
    mid: ['Remote', 'Berlin, Germany', 'Toronto, Canada'],
    low: ['Bangalore, India', 'Lagos, Nigeria', 'Manila, Philippines']
};

const RANDOM_SENIORITY = ['Junior', 'Mid', 'Senior', 'Lead'];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function getBaseRate(tier, seniority) {
    let base = 0;
    if (tier === 'high') base = 80;
    if (tier === 'mid') base = 40;
    if (tier === 'low') base = 15;

    if (seniority === 'Junior') base *= 0.6;
    if (seniority === 'Mid') base *= 1.0;
    if (seniority === 'Senior') base *= 1.5;
    if (seniority === 'Lead') base *= 2.0;

    // Add randomness +/- 20%
    const variance = (Math.random() * 0.4) - 0.2;
    return Math.round(base * (1 + variance));
}

async function seed() {
    console.log('🌱 Starting realistic seed...');

    // 1. Get Skill IDs
    const { data: skills } = await supabase.from('skills').select('id, name');
    const skillMap = {};
    skills.forEach(s => skillMap[s.name] = s.id);

    // 2. Get Location IDs
    const { data: locations } = await supabase.from('locations').select('id, city, country');
    const locMap = {}; // "City, Country" -> ID
    locations.forEach(l => locMap[`${l.city}, ${l.country}`] = l.id);
    // Also map just "Remote" if it exists
    const remote = locations.find(l => l.city === 'Remote');
    if (remote) locMap['Remote'] = remote.id;

    const entries = [];

    for (let i = 0; i < 200; i++) {
        const skillName = TARGET_SKILLS[Math.floor(Math.random() * TARGET_SKILLS.length)];
        const skillId = skillMap[skillName];
        if (!skillId) continue;

        const tierKey = Object.keys(LOCATIONS_TIERS)[Math.floor(Math.random() * 3)]; // high, mid, low
        const tierCities = LOCATIONS_TIERS[tierKey];
        const cityName = tierCities[Math.floor(Math.random() * tierCities.length)];
        const locationId = locMap[cityName] || locMap['Remote'] || locations[0].id; // Fallback

        const seniority = RANDOM_SENIORITY[Math.floor(Math.random() * RANDOM_SENIORITY.length)];
        const rate = getBaseRate(tierKey, seniority);

        // Spread dates over last 6 months
        const date = randomDate(new Date(Date.now() - 15552000000), new Date()); // ~6 months

        entries.push({
            skill_id: skillId,
            location_id: locationId,
            hourly_rate: rate,
            years_experience: seniority === 'Junior' ? 1 : seniority === 'Mid' ? 4 : 8,
            seniority_level: seniority,
            project_type: 'Hourly',
            is_approved: true, // Auto-approve for demo
            created_at: date
        });
    }

    const { error } = await supabase.from('rate_submissions').insert(entries);

    if (error) {
        console.error('❌ Insert failed:', error);
    } else {
        console.log(`✅ Successfully planted ${entries.length} realistic rate submissions!`);
    }
}

seed();
