// Event tracking utility for Vercel Analytics
import { track } from '@vercel/analytics';

export const analytics = {
    // Search Events
    searchPerformed: (skill: string, location?: string) => {
        track('search_performed', {
            skill,
            location: location || 'global',
            timestamp: new Date().toISOString()
        });
    },

    // Submission Events
    rateSubmitted: (skillId: number, hourlyRate: number, location: string) => {
        track('rate_submitted', {
            skill_id: skillId,
            hourly_rate: hourlyRate,
            location,
            timestamp: new Date().toISOString()
        });
    },

    // Auth Events
    userSignedUp: (method: 'email' | 'google') => {
        track('user_signup', {
            method,
            timestamp: new Date().toISOString()
        });
    },

    userLoggedIn: (method: 'email' | 'google') => {
        track('user_login', {
            method,
            timestamp: new Date().toISOString()
        });
    },

    // Chart Events
    chartExpanded: (skill: string, chartType: 'distribution' | 'trends' | 'geo') => {
        track('chart_expanded', {
            skill,
            chart_type: chartType,
            timestamp: new Date().toISOString()
        });
    },

    // Blog Events
    blogPostViewed: (slug: string, scrollDepth?: number) => {
        track('blog_post_viewed', {
            post_slug: slug,
            scroll_depth: scrollDepth || 0,
            timestamp: new Date().toISOString()
        });
    },

    // CTA Events
    ctaClicked: (ctaType: 'submit' | 'explore' | 'signup' | 'leaderboard', location: string) => {
        track('cta_clicked', {
            cta_type: ctaType,
            page_location: location,
            timestamp: new Date().toISOString()
        });
    },

    // Skill Page Events
    skillPageViewed: (skill: string) => {
        track('skill_page_viewed', {
            skill,
            timestamp: new Date().toISOString()
        });
    }
};

// Usage Monitoring (for free tier tracking)
export const getMonthlyEventCount = async () => {
    // Vercel Analytics Dashboard will show this
    // Free tier: 2,500 events/month
    console.log('Check Vercel Dashboard: https://vercel.com/analytics');
};
