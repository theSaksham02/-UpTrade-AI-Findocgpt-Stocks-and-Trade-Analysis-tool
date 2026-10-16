import type { Metadata } from 'next';
import { LandingHeader } from '@/components/landing/Header';
import { CONTACT, ENTITY, LegalSection, LegalTitle } from '@/components/legal/legal-section';
// Footer handled by layout

export const metadata: Metadata = {
    title: 'Financial Disclaimer',
    description: 'UpTrade output is for research and education only. It is not investment advice.',
};

export default function DisclaimerPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <LegalTitle>Financial Disclaimer</LegalTitle>
                    <div className="bg-[#f23645]/10 border border-[#f23645] rounded-xl p-6 mb-8">
                        <p className="text-[#f23645] font-bold mb-2">Risk Warning</p>
                        <p className="text-[#d1d4dc]">
                            Trading and investing in stocks, ETFs, options and cryptocurrencies involves substantial risk, and you
                            can lose more than you expect, including all of the money you put in. Crypto assets are especially
                            volatile and largely unregulated.
                        </p>
                    </div>

                    <div className="text-[#a3a29c] leading-relaxed space-y-6">
                        <LegalSection title="Research and education only">
                            <p>
                                Everything UpTrade shows &mdash; charts, indicators, ARIMA forecasts and their error bands, anomaly
                                markers and backtests &mdash; is for research and education. It is not investment, financial, tax or
                                legal advice, and not a recommendation to buy, sell or hold any security or crypto asset. {ENTITY} is
                                not a broker-dealer or a registered investment adviser, and nothing here takes your personal
                                circumstances into account. Consider speaking to a licensed professional before making decisions.
                            </p>
                        </LegalSection>

                        <LegalSection title="How to read the forecast">
                            <p>
                                The forecast is a statistical ARIMA model fitted to past prices. The error band shows the
                                model&rsquo;s own uncertainty under its assumptions; prices regularly move outside it. The model
                                knows nothing about news, earnings or events, and a forecast that looked right before can stop working
                                as markets change.
                            </p>
                        </LegalSection>

                        <LegalSection title="Backtests are hypothetical">
                            <p>
                                Backtests apply a rule to roughly five years of historical prices. They are simulations: they ignore
                                or simplify fees, slippage, taxes and liquidity, and they are chosen with hindsight. Past performance,
                                real or simulated, does not predict future results.
                            </p>
                        </LegalSection>

                        <LegalSection title="Data accuracy">
                            <p>
                                Market data comes from third parties, including Yahoo Finance, and may be delayed, incomplete or
                                wrong. Don&rsquo;t rely on it for time-sensitive decisions; check prices with your broker or the
                                exchange.
                            </p>
                        </LegalSection>

                        <LegalSection title="Your responsibility">
                            <p>
                                You are solely responsible for your investment decisions and their outcomes. {ENTITY} accepts no
                                liability for losses arising from use of UpTrade. Questions: {CONTACT}.
                            </p>
                        </LegalSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
