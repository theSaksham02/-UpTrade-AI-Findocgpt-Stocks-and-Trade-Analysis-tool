'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add actual auth
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', 'fake-token');
            window.location.href = '/app';
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-[#868993]">Sign in to access your trading terminal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#868993] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-4 py-3 text-white focus:border-[#2962FF] outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#868993] mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-4 py-3 text-white focus:border-[#2962FF] outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2962FF] hover:bg-[#1e53e5] text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-[#868993] text-sm mt-6">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#2962FF] hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
