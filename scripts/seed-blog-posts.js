import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
    envConfig.NEXT_PUBLIC_SUPABASE_URL,
    envConfig.SUPABASE_SERVICE_ROLE_KEY
);

// Blog posts content
const posts = [
    {
        slug: 'pricing-guide',
        title: 'How to Price Your Freelance Services in 2026',
        excerpt: 'A comprehensive guide to pricing your freelance work using market data, value-based strategies, and proven negotiation scripts.',
        category: 'Guides',
        read_time: '8 min read',
        og_image_url: '/blog/pricing-guide.png',
        content: `Pricing is one of the most challenging aspects of freelancing. Charge too little and you'll burn out. Charge too much and you'll lose clients. Here's how to find the sweet spot using data and strategy.

## 1. Understand Your Market Rate

Before setting your rate, you need to know what the market will bear. Use platforms like PriceIQ to research rates for your specific skill and location.

### 2026 Market Benchmarks
- **Junior React Developer (US):** $35-60/hr
- **Mid-Level (3-5 years):** $70-100/hr
- **Senior (5+ years):** $100-160/hr
- **UI/UX Designer (Mid):** $60-100/hr
- **Python Developer (Senior):** $100-200/hr

## 2. Calculate Your Baseline

Your hourly rate should cover more than just work time. Use this formula:

Desired Annual Salary = $80,000
÷ 1,000 billable hours/year (accounting for vacation, admin, marketing)
= $80/hr baseline
+ 30% overhead (taxes, software, insurance) = $104/hr

## 3. Choose Your Pricing Model

### Hourly Pricing
**Best for:** Ongoing retainers, unpredictable scopes, maintenance work
- ✅ Simple to track and invoice
- ✅ Low risk for scope creep
- ❌ Penalizes efficiency

### Project-Based Pricing
**Best for:** Well-defined deliverables
- ✅ Rewards efficiency
- ✅ Easier for client budgeting

### Value-Based Pricing
**Best for:** High-impact work
- ✅ Highest earning potential
- ✅ Aligns with client ROI`
    },
    {
        slug: 'top-skills-2026',
        title: 'Top 10 Highest-Paying Freelance Skills in 2026',
        excerpt: 'Data-driven analysis of the most lucrative freelance skills based on 10,000+ verified rate submissions. AI/ML tops the list at $180/hr.',
        category: 'Market Trends',
        read_time: '6 min read',
        og_image_url: '/blog/top-skills.png',
        content: `Using real market data from the PriceIQ database, we analyzed median hourly rates across 200+ skills to identify which ones command the highest premiums in 2026.

## Top 10 Rankings

### 1. AI/ML Engineering - $180/hr
Machine learning model development, LLM fine-tuning, AI integration.
**Why it pays:** ChatGPT explosion created massive demand for AI specialists.

### 2. Blockchain/Smart Contracts - $165/hr
Solidity, Web3 development, DeFi protocols.
**Why it pays:** Institutional crypto adoption driving enterprise blockchain projects.

### 3. DevOps/Cloud Architecture - $155/hr
AWS/Azure architecture, Kubernetes, CI/CD pipelines.
**Why it pays:** Every company migrating to cloud infrastructure.

### 4. Cybersecurity Consulting - $150/hr
Penetration testing, compliance audits, incident response.

### 5. iOS/Swift Development - $140/hr
SwiftUI, App Store optimization, Apple ecosystem apps.

## Key Takeaways

### AI is the New Gold Rush
The explosion of ChatGPT has created unprecedented demand for ML engineers. Companies are paying premium rates for anyone who can integrate LLMs.

### Specialization > Generalization
The highest-paid skills are highly specialized. Generic "full-stack developer" roles max out around $60-80/hr. Specialists command 2-3x that rate.`
    },
    {
        slug: 'remote-vs-local',
        title: 'Remote vs. Local: The Pricing Gap Is Closing (But Not Dead)',
        excerpt: 'Does location still matter in a remote-first world? Our data says yes, but the gap is closing. SF developers charge 30% more than remote peers.',
        category: 'Data Analysis',
        read_time: '7 min read',
        og_image_url: '/blog/remote-vs-local.png',
        content: `In 2019, a San Francisco-based React developer could command 3-4x the rate of a developer in Bangalore doing the exact same work. Fast forward to 2026, and that gap has shrunk dramatically—but it hasn't disappeared.

## The Numbers Don't Lie

Using PriceIQ's database of verified rates, we compared "local" rates (clients and freelancers in the same high-cost city) versus "remote" rates (location-agnostic projects).

### Location Premium Comparison 2026

**San Francisco, USA - React Developer**
- Local Rate: $135/hr
- Remote Rate: $95/hr
- Gap: -30%

**New York, USA - UI/UX Designer**
- Local Rate: $120/hr
- Remote Rate: $85/hr
- Gap: -29%

**Bangalore, India - Python Developer**
- Local Rate: $35/hr
- Remote Rate: $45/hr
- Gap: +29% (Reverse premium!)

## Key Findings

### 1. US Coastal Cities Still Command Premium
San Francisco and NYC freelancers still charge 25-30% more than their remote peers. However, this has dropped from 40-50% in 2020.

### 2. The "Reverse Premium" for Indian Developers
Developers in Bangalore charging remote rates actually earn **29% more** than those serving only local Indian clients. This is the arbitrage opportunity of the decade.

### 3. European Cities Have The Smallest Gap
Berlin, Amsterdam, and London show only a 13-21% local premium. The European market is more "flattened" due to strong remote work culture.

## Why Location Still Matters

- **Time Zones:** Convenience is worth money
- **Cultural Fit:** US clients often prefer US-based freelancers
- **Network Effects:** Being in NYC means you're 1 coffee away from your next $50k project`
    }
];

async function seedBlogPosts() {
    console.log('🌱 Seeding blog posts...\n');

    // Get admin user (you)
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const adminUser = users.find(u => u.email === 'shanjaisenthilkumar03@gmail.com');

    if (!adminUser) {
        console.error('❌ Admin user not found! Make sure you have an account.');
        process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser.email}\n`);

    // Insert posts
    for (const post of posts) {
        console.log(`📝 Creating post: ${post.title}`);

        const { data, error } = await supabase
            .from('blog_posts')
            .upsert({
                ...post,
                author_id: adminUser.id,
                published: true,
                published_at: new Date().toISOString()
            }, {
                onConflict: 'slug'
            });

        if (error) {
            console.error(`   ❌ Error: ${error.message}`);
        } else {
            console.log(`   ✅ Published: /blog/${post.slug}`);
        }
    }

    console.log('\n🎉 Done! All blog posts seeded.');
    console.log('Visit http://localhost:3000/blog to see them live!');
}

seedBlogPosts();
