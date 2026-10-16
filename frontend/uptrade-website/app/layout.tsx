import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { SpeedInsights } from "@vercel/speed-insights/next"
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

export const metadata: Metadata = {
  title: "UpTrade - AI-Powered Financial Analysis & Trading Intelligence",
  description:
    "Transform your trading strategy with advanced AI-driven market analysis, real-time insights, and intelligent investment recommendations. Professional-grade financial tools for modern traders.",
  keywords: "stock trading, AI trading, financial analysis, market intelligence, investment strategy, trading tools, stock analysis, fintech",
  generator: "v0.app",
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
        </div>
      </body>
    </html>
  )
}
