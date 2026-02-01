import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Roboto_Mono } from "next/font/google"
import Aurora from "@/components/Aurora"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
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
      <body className={`font-sans antialiased ${inter.variable} ${robotoMono.variable} min-h-screen relative bg-black selection:bg-blue-500/30`}>
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora colorStops={["#0066FF", "#00FF99", "#00CC88"]} amplitude={1.0} blend={0.5} speed={0.5} />
        </div>
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
