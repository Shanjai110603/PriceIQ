import Script from 'next/script'

interface StructuredDataProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

// Organization Schema
export const OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PriceIQ',
    description: 'Open-source freelance pricing intelligence platform providing verified market rate data for developers, designers, and creatives.',
    url: 'https://priceiq.com',
    logo: 'https://priceiq.com/logo.png',
    sameAs: [
        'https://twitter.com/priceiq',
        'https://github.com/priceiq'
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@priceiq.com',
        contactType: 'Customer Support'
    }
}

// Website Schema
export const WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PriceIQ',
    url: 'https://priceiq.com',
    description: 'Democratizing freelance pricing with transparent, community-driven market data.',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://priceiq.com/explore?skill={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
    }
}

// WebApplication Schema
export const WebApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PriceIQ',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    description: 'Free market rate intelligence platform for freelancers and independent contractors.',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    screenshot: 'https://priceiq.com/screenshot.png',
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150'
    }
}

// Dataset Schema (for the rate data)
export const DatasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Global Freelance Rate Database',
    description: 'Community-sourced database of verified freelance hourly rates across 50+ skills and 100+ locations.',
    creator: {
        '@type': 'Organization',
        name: 'PriceIQ'
    },
    distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://priceiq.com/api/rates'
    },
    temporalCoverage: '2024/..',
    spatialCoverage: {
        '@type': 'Place',
        name: 'Worldwide'
    }
}

// FAQ Schema
export const FAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Is PriceIQ free to use?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! PriceIQ is completely free. You can explore market rates, submit your own, and access detailed analytics at no cost.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is my data anonymous?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. We never store personal identifiable information. Your submissions are pooled with thousands of others to generate aggregate statistics.'
            }
        },
        {
            '@type': 'Question',
            name: 'How accurate is the data?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Our algorithm filters outliers and spam. All rates are verified through multiple checks including IP validation, statistical analysis, and community moderation.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I contribute data?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! Contributing your rate helps keep our data fresh and unlocks advanced chart features. Visit the Submit page to add your rate anonymously.'
            }
        }
    ]
}

// Breadcrumb Schema Generator
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    }
}

// Article Schema Generator (for blog posts)
export function getArticleSchema(article: {
    title: string
    description: string
    datePublished: string
    dateModified?: string
    author: string
    image?: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
            '@type': 'Person',
            name: article.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'PriceIQ',
            logo: {
                '@type': 'ImageObject',
                url: 'https://priceiq.com/logo.png'
            }
        },
        image: article.image || 'https://priceiq.com/og-image.png'
    }
}
