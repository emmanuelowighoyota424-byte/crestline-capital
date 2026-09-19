import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/toaster"
import { BankingProvider } from "@/lib/banking-context"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b0f19",
}

export const metadata: Metadata = {
  title: {
    default: "Crestline Capital — Premium Digital Banking",
    template: "%s | Crestline Capital",
  },
  description:
    "Experience the future of banking with Crestline Capital. Secure, intelligent, and beautifully designed digital banking for personal and business accounts.",
  keywords: [
    "digital banking",
    "fintech",
    "personal banking",
    "business banking",
    "savings",
    "investments",
    "loans",
    "cards",
    "transfers",
  ],
  authors: [{ name: "Crestline Capital" }],
  creator: "Crestline Capital",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Crestline Capital",
    title: "Crestline Capital — Premium Digital Banking",
    description:
      "Secure, intelligent digital banking for personal and business accounts.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Crestline Capital",
    "description": "Secure, intelligent digital banking for personal and business accounts. High-yield savings, global wires, and double-entry ledger treasury.",
    "url": "https://crestlinecapital.vercel.app",
    "logo": "https://crestlinecapital.vercel.app/icon.svg",
    "currenciesAccepted": "USD, EUR, GBP",
    "paymentAccepted": "Wire, ACH, Card, Check",
    "priceRange": "$$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Banking & Treasury Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "High-Yield Cash Sweeps (4.85% APY)"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Institutional Fedwire & SWIFT Settlement"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Crestline Platinum Visa Debit"
          }
        }
      ]
    }
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden overscroll-none touch-pan-y bg-[#0b0f19] text-[#f8fafc]">
        <ErrorBoundary>
          <ConvexClientProvider>
            <BankingProvider>
              {children}
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </BankingProvider>
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
