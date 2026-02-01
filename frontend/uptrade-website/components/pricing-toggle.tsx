"use client"

import { motion } from "framer-motion"

interface PricingToggleProps {
    isAnnual: boolean
    onToggle: () => void
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
    return (
        <div className="flex items-center justify-center gap-4 mb-12">
            <span
                className={`text-sm font-medium transition-colors duration-300 ${!isAnnual ? 'text-white' : 'text-[var(--tv-text-muted)]'
                    }`}
            >
                Monthly
            </span>

            <button
                onClick={onToggle}
                className="relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--tv-blue)] focus:ring-offset-2 focus:ring-offset-[var(--tv-bg-dark)]"
                style={{ backgroundColor: isAnnual ? 'var(--tv-blue)' : 'var(--tv-surface-hover)' }}
                aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
            >
                <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ left: isAnnual ? '2.25rem' : '0.25rem' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>

            <div className="flex items-center gap-2">
                <span
                    className={`text-sm font-medium transition-colors duration-300 ${isAnnual ? 'text-white' : 'text-[var(--tv-text-muted)]'
                        }`}
                >
                    Annual
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full"
                    style={{
                        backgroundColor: 'var(--tv-green-bg)',
                        color: 'var(--tv-green)'
                    }}
                >
                    Save 16%
                </span>
            </div>
        </div>
    )
}
