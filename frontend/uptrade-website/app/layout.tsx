import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { SentryClientInit } from "@/components/monitoring/sentry-client-init"
import { SITE_URL } from "@/lib/site-url"
import { Instrument_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"

// UpTrade type system: Instrument Serif (headlines), IBM Plex Sans (UI/body), IBM Plex Mono (numbers)
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-ut-display",
  display: "swap",
})

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

const code = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
})

const defaultTitle = "UpTrade — charts, an open forecasting model and backtests"
const description =
  "Live charts for stocks, ETFs, indices and crypto, an ARIMA forecast drawn with its error band, and 5-year backtests you can check. Free while in beta."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s · UpTrade",
  },
  description,
  applicationName: "UpTrade",
  openGraph: {
    type: "website",
    siteName: "UpTrade",
    title: defaultTitle,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`font-sans antialiased ${display.variable} ${body.variable} ${code.variable} min-h-screen relative bg-[#0a0b0d] selection:bg-amber-300/30`}>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Suspense fallback={null}>
            <NavigationTransition />
            <PageTransition>{children}</PageTransition>
          </Suspense>
          <SpeedInsights />
          <Analytics />
          <SentryClientInit />
        </div>
      </body>
    </html>
  )
}
