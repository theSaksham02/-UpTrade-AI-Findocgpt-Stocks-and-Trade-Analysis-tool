'use client';

import { RequireAuth } from '@/components/RequireAuth';
import { TradingLayout } from '@/components/app/TradingLayout';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RequireAuth>
            <TradingLayout>
                {children}
            </TradingLayout>
        </RequireAuth>
    );
}
