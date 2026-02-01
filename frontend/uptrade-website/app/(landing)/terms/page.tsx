'use client'

import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

export default function TermsPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                    <div className="text-[#868993] leading-relaxed space-y-6">
                        <p>Last updated: March 1, 2024</p>

                        <h2 className="text-xl font-bold text-white mt-8">1. Service Description</h2>
                        <p>
                            UpTrade provides financial data aggregation, sentiment analysis, and alerting tools.
                            We are not a broker-dealer and do not execute trades. All investment decisions are your own.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">2. Data Usage Restrictions</h2>
                        <p>
                            You may not: (a) resell our data feeds, (b) use for illegal market manipulation,
                            (c) scrape via automated means outside our API, (d) share Enterprise features with unauthorized users.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">3. No Investment Advice</h2>
                        <p>
                            All content is for informational purposes only. Past performance does not guarantee future results.
                            Our AI predictions are experimental and should not be the sole basis for investment decisions.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">4. Limitation of Liability</h2>
                        <p>
                            UpTrade is not liable for trading losses or missed opportunities.
                            Maximum liability is limited to fees paid in the 12 months preceding the incident.
                        </p>
                    </div>
                </div>
            </div>

// Footer removed (handled by layout)
        </div>
    );
};
