'use client'

import { useState, useEffect } from 'react'
// Header and Footer handled by layout
import { Hero } from './sections/Hero'
// Placeholder imports for now
import { FeaturesGrid } from './sections/FeaturesGrid'
import { Pricing } from './sections/Pricing'
import { CTA } from './sections/CTA'
import { AboutUs } from './sections/AboutUs'

export function LandingPage() {
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight - windowHeight
            const scrolled = window.scrollY
            const progress = Math.min(scrolled / documentHeight, 1)
            setScrollProgress(progress)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-[#0b0e14] overflow-hidden font-sans text-slate-300">
            {/* Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#2962FF]/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#089981]/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10">
                {/* Header handled by layout */}

                <main>
                    <Hero />
                    {/* We will add other sections here as we create them */}
                    <div id="features">
                        <FeaturesGrid />
                    </div>
                    <div id="comparison">
                        <Pricing />
                    </div>
                    <AboutUs />
                    <CTA />
                </main>

                {/* Footer handled by layout */}
            </div>
        </div>
    )
}
