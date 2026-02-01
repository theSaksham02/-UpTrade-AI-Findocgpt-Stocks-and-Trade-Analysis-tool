'use client'

import { GlassmorphismNav } from '@/components/glassmorphism-nav'
import ComparisonDashboard from '@/components/comparison-dashboard'

export default function TradeXComparisonPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0b0e14' }}>
            <GlassmorphismNav />
            <div className="pt-16">
                <ComparisonDashboard />
            </div>
        </div>
    )
}
