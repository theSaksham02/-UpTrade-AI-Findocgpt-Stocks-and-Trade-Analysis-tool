'use client'

import { usePathname } from 'next/navigation'
import Aurora from '@/components/Aurora'

// The terminal is opaque and full-screen; skip the WebGL background there.
export function RouteBackground() {
    const pathname = usePathname() || '/'
    if (pathname.startsWith('/app') || pathname.startsWith('/dashboard')) return null
    return (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
            <Aurora colorStops={["#0066FF", "#00FF99", "#00CC88"]} amplitude={1.0} blend={0.5} speed={0.5} />
        </div>
    )
}
