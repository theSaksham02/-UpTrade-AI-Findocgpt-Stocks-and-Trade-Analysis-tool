"use client"

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import Aurora from "@/components/Aurora"
import { FeaturesSection } from "@/components/features-section"
import UptradeCopilot from "@/components/uptrade-copilot"
import { AIAnalysisSection } from "@/components/ai-analysis-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PerformanceSection } from "@/components/performance-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = Math.min(scrolled / documentHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#131722' }}>
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ opacity: Math.max(0.3, 1 - scrollProgress * 0.7) }}>
          <Aurora colorStops={["#2962FF", "#089981", "#1e222d"]} amplitude={0.8} blend={0.4} speed={0.5} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          <HeroSection />
          <FeaturesSection />
          <AIAnalysisSection />
          <PerformanceSection />
          <PricingSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </div>
        <UptradeCopilot />
      </main>
    </div>
  )
}
