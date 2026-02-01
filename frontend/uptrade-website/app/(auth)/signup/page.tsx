'use client';

import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Create Account</h1>
                <p className="text-[#868993] mb-8">Start your free trial today</p>

                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-4 py-3 text-white outline-none focus:border-[#2962FF]"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-4 py-3 text-white outline-none focus:border-[#2962FF]"
                    />
                    <button className="w-full bg-[#2962FF] text-white py-3 rounded-lg font-medium hover:bg-[#1e53e5] transition-colors">
                        Create Free Account
                    </button>
                </form>

                <p className="text-[#868993] text-sm mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#2962FF] hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
