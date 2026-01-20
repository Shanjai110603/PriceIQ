import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabase } from '@/lib/supabase';

// Vercel Cron Logic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // 1. Authenticate Cron (Header check)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // In dev, we might allow it, but for prod enforce this
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.log("Cron triggered (skipping auth for dev demo)...");
    }

    console.log('🕷️ Starting ethical scrape job...');

    try {
        // 2. Mock Source (Indeed/Glassdoor discourage scraping, so we use a mock target or generic page)
        // For specific crawling, you'd iterate a list of URLs from your DB
        // const targetUrl = 'https://remoteok.com/remote-react-jobs'; 

        // DEMO: We will interpret a "mock content" string to demonstrate regex extraction
        const mockHtml = `
      <div class="job-card">
        <h2>Senior React Developer</h2>
        <p>Location: Remote</p>
        <p>Salary: $120,000 - $150,000 per year</p> 
      </div>
      <div class="job-card">
        <h2>Node.js Engineer</h2>
        <p>Location: London</p>
        <p>Rate: $60 - $80 / hr</p>
      </div>
    `;

        const $ = cheerio.load(mockHtml);
        const extractedData: any[] = [];

        // 3. Extract logic
        $('.job-card').each((i, el) => {
            const title = $(el).find('h2').text();
            const text = $(el).text();

            // Regex to find hourly rates: "$50 - $100 / hr" or "$60/hr"
            const hourlyRegex = /\$(\d+)\s*-?\s*\$?(\d+)?\s*\/\s*hr/i;
            const match = text.match(hourlyRegex);

            if (match) {
                extractedData.push({
                    skill: title.includes('React') ? 'React' : 'Node.js', // Simple classifier
                    location: 'Remote', // Simplified
                    rate_min: parseInt(match[1]),
                    rate_max: match[2] ? parseInt(match[2]) : parseInt(match[1]),
                    source: 'Scraper'
                });
            }
        });

        // 4. Save to DB (marked as unverified)
        // const { error } = await supabase.from('rate_submissions').insert(...)

        return NextResponse.json({
            success: true,
            extracted: extractedData.length,
            sample: extractedData
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
