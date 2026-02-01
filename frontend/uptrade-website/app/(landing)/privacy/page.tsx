'use client'

import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-[#868993] leading-relaxed mb-6">
                            Last updated: March 1, 2024
                        </p>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Data We Collect</h2>
                        <p className="text-[#868993] leading-relaxed mb-4">
                            <strong className="text-white">Account Information:</strong> Email, password hash, billing details.
                            We use Stripe for payment processing and do not store your full credit card number.
                        </p>
                        <p className="text-[#868993] leading-relaxed mb-4">
                            <strong className="text-white">Usage Data:</strong> API requests, symbols queried, features used.
                            This helps us improve our models and detect abuse.
                        </p>
                        <p className="text-[#868993] leading-relaxed mb-4">
                            <strong className="text-white">Market Data:</strong> We do not collect your portfolio holdings or trades.
                            We only track which symbols you query for rate limiting purposes.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Data</h2>
                        <ul className="list-disc list-inside text-[#868993] space-y-2 mb-6">
                            <li>Provide and maintain the service</li>
                            <li>Train and improve our ML models (anonymized only)</li>
                            <li>Detect fraud and abuse</li>
                            <li>Send product updates (can opt out)</li>
                        </ul>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Data Retention</h2>
                        <p className="text-[#868993] leading-relaxed mb-4">
                            API logs retained for 30 days. Account data retained until deletion request.
                            Anonymized training data retained indefinitely.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Your Rights</h2>
                        <p className="text-[#868993] leading-relaxed mb-4">
                            GDPR: You can request data export or deletion by emailing privacy@uptrade.io.
                            Response within 30 days.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
