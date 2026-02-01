'use client';

import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0b0e14]">
            <LandingHeader />
            <main className="pt-20">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
