'use client'

import { usePathname } from 'next/navigation'
import Aurora from '@/components/Aurora'

export function RouteBackground() {
    const pathname = usePathname() || '/'
    // Terminal and the market pages are opaque; skip the WebGL background there
    if (pathname === '/' || pathname.startsWith('/markets') || pathname.startsWith('/app') || pathname.startsWith('/dashboard')) return null
    return (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
            <Aurora colorStops={["#0066FF", "#00FF99", "#00CC88"]} amplitude={1.0} blend={0.5} speed={0.5} />
        </div>
    )
}
