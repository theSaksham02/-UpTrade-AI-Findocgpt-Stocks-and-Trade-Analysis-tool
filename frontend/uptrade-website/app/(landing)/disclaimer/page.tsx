'use client'

import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

export default function DisclaimerPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Financial Disclaimer</h1>
                    <div className="bg-[#f23645]/10 border border-[#f23645] rounded-xl p-6 mb-8">
                        <p className="text-[#f23645] font-bold mb-2">Risk Warning</p>
                        <p className="text-[#d1d4dc]">
                            Trading stocks, options, and cryptocurrencies involves substantial risk of loss.
                            Most retail investor accounts lose money when trading.
                        </p>
                    </div>

                    <div className="text-[#868993] leading-relaxed space-y-6">
                        <h2 className="text-xl font-bold text-white mt-8">Not Investment Advice</h2>
                        <p>
                            UpTrade's algorithms, scores, and alerts are experimental research tools.
                            They do not constitute investment advice or recommendations to buy/sell securities.
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">Data Accuracy</h2>
                        <p>
                            While we strive for accuracy, market data may be delayed or erroneous.
                            Always verify critical information with primary sources (SEC filings, exchange data).
                        </p>

                        <h2 className="text-xl font-bold text-white mt-8">Past Performance</h2>
                        <p>
                            Backtested results (73% divergence accuracy, Sharpe 1.8) are hypothetical.
                            Actual results may vary significantly. Strategy decay is possible as markets evolve.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
