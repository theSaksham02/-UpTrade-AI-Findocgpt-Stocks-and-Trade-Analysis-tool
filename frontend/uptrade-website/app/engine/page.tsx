'use client'

import { GlassmorphismNav } from '@/components/glassmorphism-nav'
import MultiChartGrid from '@/components/multi-chart-grid'

export default function EnginePage() {
    return (
        <div className="min-h-screen bg-transparent">
            <GlassmorphismNav />
            <div className="pt-16">
                <MultiChartGrid />
            </div>
        </div>
    )
}
