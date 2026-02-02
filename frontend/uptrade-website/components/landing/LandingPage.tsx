'use client'

import { useState, useEffect } from 'react'
import { Hero } from './sections/Hero'
import { BentoGrid } from './ui/BentoGrid'
import { ScrollStory } from './sections/ScrollStory'
import { Pricing } from './sections/Pricing'
import { CTA } from './sections/CTA'
import { AboutUs } from './sections/AboutUs'
import { LiveTicker } from './ui/LiveTicker'
import { BackgroundEffects } from './ui/BackgroundEffects'
import { BrowserMockup } from './ui/BrowserMockup'

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
        <div className="overflow-hidden font-sans text-slate-300">
            {/* Animated Background Effects */}
            <BackgroundEffects />

            <div className="relative z-10">
                <main>
                    {/* Hero Section with Terminal */}
                    <Hero />

                    {/* Live Ticker Marquee */}
                    <LiveTicker />

                    {/* Product Preview Section */}
                    <section className="py-20 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    The Platform Pros Use
                                </h2>
                                <p className="text-[#868993] text-lg max-w-xl mx-auto">
                                    Switch between TradeX scoring and VisualX sentiment analysis with one click.
                                </p>
                            </div>
                            <BrowserMockup className="shadow-2xl shadow-[#000]/50" />
                        </div>
                    </section>

                    {/* Bento Grid Features */}
                    <div id="features">
                        <BentoGrid />
                    </div>

                    {/* Scroll Story: Divergence Demo */}
                    <ScrollStory />

                    {/* Pricing */}
                    <div id="pricing">
                        <Pricing />
                    </div>

                    {/* About Us */}
                    <AboutUs />

                    {/* CTA */}
                    <CTA />
                </main>
            </div>
        </div>
    )
}
