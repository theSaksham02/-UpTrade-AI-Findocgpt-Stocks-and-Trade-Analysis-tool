'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, MotionConfig, useInView, type Variants } from 'framer-motion'

// One motion vocabulary for the whole site. Everything respects the OS "reduce motion" setting.
export const EASE = [0.22, 1, 0.36, 1] as const

export function MotionProvider({ children }: { children: React.ReactNode }) {
    return <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>{children}</MotionConfig>
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

// Fades a block up the first time it scrolls into view
export function Reveal({ children, className, delay = 0, as = 'div' }: { children: React.ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'li' }) {
    const Tag = motion[as]
    return (
        <Tag
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay }}
        >
            {children}
        </Tag>
    )
}

// Parent that staggers its <RevealItem> children
export function Stagger({ children, className, gap = 0.08 }: { children: React.ReactNode; className?: string; gap?: number }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
        >
            {children}
        </motion.div>
    )
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return <motion.div className={className} variants={fadeUp}>{children}</motion.div>
}

// Headline that rises in word by word
export function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    const words = text.split(' ')
    return (
        <span className={className} aria-label={text}>
            {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
                    <motion.span
                        className="inline-block"
                        initial={{ y: '105%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}
                    >
                        {w}{i < words.length - 1 ? ' ' : ''}
                    </motion.span>
                </span>
            ))}
        </span>
    )
}

// Counts up to `value` when it scrolls into view
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })
    const [shown, setShown] = useState(0)
    useEffect(() => {
        if (!inView) return
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduce) return setShown(value)
        const controls = animate(0, value, { duration: 1.2, ease: EASE, onUpdate: setShown })
        return () => controls.stop()
    }, [inView, value])
    return <span ref={ref} className={className}>{prefix}{shown.toFixed(decimals)}{suffix}</span>
}
