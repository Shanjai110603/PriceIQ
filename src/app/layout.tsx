import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import Link from "next/link";
import { StructuredData, OrganizationSchema, WebsiteSchema, WebApplicationSchema } from "@/components/structured-data";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PriceIQ - Freelance Rate Discovery Engine",
    template: "%s | PriceIQ"
  },
  description: "Discover real market rates for freelancers. Search by skill (React, Node.js) and location to benchmark your pricing with verified community data.",
  keywords: ["freelance rates", "salary transparency", "developer rates", "designer rates", "market price"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://priceiq.vercel.app",
    title: "PriceIQ - Real Freelance Rates",
    description: "Stop guessing your rate. See what others are charging in your location.",
    siteName: "PriceIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "PriceIQ - Freelance Rate Explorer",
    description: "Benchmark your freelance rates with real community data.",
    creator: "@priceiq",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={OrganizationSchema} />
        <StructuredData data={WebsiteSchema} />
        <StructuredData data={WebApplicationSchema} />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />

          {children}

          <Footer />
          <Toaster richColors position="top-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
