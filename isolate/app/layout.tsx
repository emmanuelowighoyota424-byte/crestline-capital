import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/toaster"
import { BankingProvider } from "@/lib/banking-context"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#D71E28",
}

export const metadata: Metadata = {
  title: {
    default: "Crestline Capital — Digital Banking",
    template: "%s | Crestline Capital",
  },
  description:
    "Bank with confidence. Crestline Capital offers personal and business banking solutions with secure digital banking, credit cards, loans, and more.",
  keywords: [
    "banking",
    "personal banking",
    "business banking",
    "credit cards",
    "loans",
    "mortgages",
    "savings",
    "checking",
    "digital banking",
    "Crestline Capital",
  ],
  authors: [{ name: "Crestline Capital" }],
  creator: "Crestline Capital",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Crestline Capital",
    title: "Crestline Capital — Digital Banking",
    description:
      "Bank with confidence. Secure digital banking for personal and business accounts.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BankOrCreditUnion",
              name: "Crestline Capital",
              description:
                "Crestline Capital offers personal and business banking solutions with secure digital banking, credit cards, loans, and more.",
              url: "https://crestlinecapital.com",
              currenciesAccepted: "USD",
              paymentAccepted: "Wire, ACH, Card, Check",
              priceRange: "$$",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Banking Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Crestline Total Checking",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Crestline Premier Savings",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Crestline Platinum Card",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased overflow-x-hidden overscroll-none bg-white text-[#2D2D2D]`}>
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
