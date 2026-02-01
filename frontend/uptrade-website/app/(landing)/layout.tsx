'use client';

import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-transparent overflow-hidden relative">
            <div className="relative z-10 flex flex-col min-h-screen">
                <LandingHeader />
                <main className="flex-grow pt-20">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
