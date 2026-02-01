'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
};
