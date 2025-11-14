import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import Aurora from "@/components/Aurora"
import { FeaturesSection } from "@/components/features-section"
import { AIAnalysisSection } from "@/components/ai-analysis-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PerformanceSection } from "@/components/performance-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#1e3a8a", "#3b82f6", "#1e40af"]} amplitude={1.2} blend={0.6} speed={0.8} />
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
      </main>
    </div>
  )
}
