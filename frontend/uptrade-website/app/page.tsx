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

  // Interpolate between black and purple based on scroll
  const backgroundColor = scrollProgress < 0.4 
    ? `rgb(0, 0, 0)` // Black for first 40%
    : scrollProgress < 0.7
    ? `rgb(${Math.floor(46 * (scrollProgress - 0.4) / 0.3)}, ${Math.floor(16 * (scrollProgress - 0.4) / 0.3)}, ${Math.floor(60 * (scrollProgress - 0.4) / 0.3)})` // Transition to purple
    : `rgb(46, 16, 60)` // Dark purple (#2e103c)

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor, transition: 'background-color 0.3s ease' }}>
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ opacity: 1 - scrollProgress * 0.7 }}>
          <Aurora colorStops={["#6b21a8", "#8b5cf6", "#7c3aed"]} amplitude={1.2} blend={0.6} speed={0.8} />
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
