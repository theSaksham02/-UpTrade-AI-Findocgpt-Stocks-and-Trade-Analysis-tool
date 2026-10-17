import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT, ENTITY, LegalList, LegalSection, LegalTitle, Placeholder } from '@/components/legal/legal-section';
// Footer handled by layout

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'The terms for using UpTrade during its free beta.',
};

export default function TermsPage() {
    return (
        <div className="bg-transparent min-h-screen">

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <LegalTitle>Terms of Service</LegalTitle>
                    <div className="text-[#a3a29c] leading-relaxed space-y-6">
                        <p>
                            UpTrade is operated by {ENTITY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). These terms apply when you use the
                            UpTrade website, terminal and API routes (the &ldquo;Service&rdquo;). By using the Service you agree to them.
                            If you don&rsquo;t agree, please don&rsquo;t use it.
                        </p>

                        <LegalSection title="1. What UpTrade is">
                            <p>
                                UpTrade shows market charts for stocks, ETFs, indices and crypto, an ARIMA forecast drawn with its
                                error band, and historical backtests. It is a research and education tool. We are not a broker,
                                exchange or investment adviser, we don&rsquo;t hold your money and we don&rsquo;t execute trades.
                            </p>
                        </LegalSection>

                        <LegalSection title="2. Free beta">
                            <p>
                                The Service is currently a free beta. There are no paid plans and we don&rsquo;t collect payment
                                details. Because it is a beta, features may change, break, be limited or be removed, and the Service
                                may be unavailable at times. We may end the beta or the Service at any time. If we ever introduce
                                paid features, we will publish updated terms first and you will choose whether to use them.
                            </p>
                        </LegalSection>

                        <LegalSection title="3. Your account">
                            <LegalList>
                                <li>You must be at least 18 years old to create an account.</li>
                                <li>Give a valid email address and keep your password to yourself. You are responsible for activity on your account.</li>
                                <li>Tell us at {CONTACT} if you think someone else has accessed your account.</li>
                                <li>
                                    You can stop using the Service at any time. To delete your account and the watchlist stored with
                                    it, email {CONTACT} from the address on the account.
                                </li>
                            </LegalList>
                            <p>The terminal works without an account; an account only syncs your watchlist across devices.</p>
                        </LegalSection>

                        <LegalSection title="4. Not investment advice">
                            <p>
                                Nothing on UpTrade &mdash; charts, indicators, forecasts, error bands, backtests or any other output
                                &mdash; is investment, financial, tax or legal advice, or a recommendation to buy, sell or hold anything.
                                Forecasts are statistical estimates that are often wrong, and backtests are hypothetical. You are solely
                                responsible for your own decisions. Read the full{' '}
                                <Link href="/disclaimer" className="text-[#e8b04a] hover:underline">financial disclaimer</Link>.
                            </p>
                        </LegalSection>

                        <LegalSection title="5. Market data">
                            <p>
                                Prices and other market data come from third-party sources, including Yahoo Finance. They may be
                                delayed, incomplete or inaccurate, and we don&rsquo;t control or guarantee them. The data is provided for
                                your personal, non-commercial use; don&rsquo;t redistribute or resell it. Third-party data remains
                                subject to its providers&rsquo; own terms.
                            </p>
                        </LegalSection>

                        <LegalSection title="6. Acceptable use">
                            <p>When using the Service, you agree not to:</p>
                            <LegalList>
                                <li>scrape it or send automated requests to our API routes at a volume that degrades the Service for others;</li>
                                <li>try to get around rate limits, access controls or security measures;</li>
                                <li>use it to break the law, including market manipulation or securities laws;</li>
                                <li>interfere with the Service or other users, or upload malicious code;</li>
                                <li>impersonate others or misrepresent UpTrade output as personalised advice.</li>
                            </LegalList>
                            <p>We may suspend or close accounts that break these rules.</p>
                        </LegalSection>

                        <LegalSection title="7. Intellectual property">
                            <p>
                                The UpTrade name, logo and site design belong to {ENTITY}. Source code we publish in our public
                                repository is licensed under the license in that repository. These terms don&rsquo;t give you any other
                                rights to our marks or content.
                            </p>
                        </LegalSection>

                        <LegalSection title="8. No warranty">
                            <p>
                                The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express
                                or implied, including accuracy, fitness for a particular purpose and uninterrupted availability, to the
                                fullest extent the law allows.
                            </p>
                        </LegalSection>

                        <LegalSection title="9. Limitation of liability">
                            <p>
                                To the fullest extent the law allows, {ENTITY} is not liable for any trading or investment losses,
                                lost profits, or indirect, incidental or consequential damages arising from your use of the Service or
                                its data. Because the Service is free, our total liability for any claim is limited to USD 50. Nothing
                                in these terms limits liability that cannot be limited by law.
                            </p>
                        </LegalSection>

                        <LegalSection title="10. Changes to these terms">
                            <p>
                                We may update these terms as the Service changes. We&rsquo;ll change the date at the top, and for
                                material changes we&rsquo;ll give notice on the site or by email to account holders. Continuing to use
                                the Service after a change means you accept the updated terms.
                            </p>
                        </LegalSection>

                        <LegalSection title="11. Governing law">
                            <p>
                                These terms are governed by the laws of <Placeholder>[GOVERNING LAW JURISDICTION]</Placeholder>, and
                                disputes will be heard in its courts, unless the law where you live gives you the right to bring a
                                claim locally.
                            </p>
                        </LegalSection>

                        <LegalSection title="12. Contact">
                            <p>Questions about these terms: {CONTACT}.</p>
                        </LegalSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
