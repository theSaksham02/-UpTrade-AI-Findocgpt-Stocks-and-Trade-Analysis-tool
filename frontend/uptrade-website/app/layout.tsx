import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google"
import { RouteBackground } from "@/components/route-background"

// UpTrade type system: Space Grotesk (display), IBM Plex Sans (UI/body), JetBrains Mono (numbers)
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ut-display",
  display: "swap",
})

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

const code = JetBrains_Mono({
  subsets: ["latin"],
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
      <body className={`font-sans antialiased ${display.variable} ${body.variable} ${code.variable} min-h-screen relative bg-black selection:bg-blue-500/30`}>
        <RouteBackground />
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
