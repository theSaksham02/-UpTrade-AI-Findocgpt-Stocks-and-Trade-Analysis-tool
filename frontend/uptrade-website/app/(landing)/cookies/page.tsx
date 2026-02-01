'use client'

import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

export default function CookiesPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
                    <div className="text-[#868993] leading-relaxed space-y-6">
                        <h2 className="text-xl font-bold text-white mt-8">Essential Cookies</h2>
                        <p>
                            Required for authentication and security. Cannot be disabled.
                            Examples: session_id, csrf_token.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">Analytics Cookies</h2>
                        <p>
                            Help us understand usage patterns. Used for: feature popularity, error tracking, performance monitoring.
                            Provider: Mixpanel, Sentry. You can opt out in settings.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">Managing Cookies</h2>
                        <p>
                            Browser settings can block cookies, but this will prevent login functionality.
                            Use our cookie preference center in Account Settings for granular control.
                        </p>
                    </div>
                </div>
            </div>

// Footer removed (handled by layout)
        </div>
    );
};
