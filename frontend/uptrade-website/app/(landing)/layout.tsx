import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { MotionProvider } from '@/components/site/motion'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <MotionProvider>
            <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                {/* 32px ticker strip + 64px nav */}
                <main className="flex-grow pt-24">{children}</main>
                <SiteFooter />
            </div>
        </MotionProvider>
    )
}
