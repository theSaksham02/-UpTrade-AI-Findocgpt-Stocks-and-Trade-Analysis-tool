import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingHeader } from '@/components/landing/Header';
import { CONTACT, ENTITY, LegalList, LegalSection, LegalTitle } from '@/components/legal/legal-section';
// Footer handled by layout

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'What UpTrade collects during its free beta, why, who processes it, and how to have it deleted.',
};

export default function PrivacyPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <LegalTitle>Privacy Policy</LegalTitle>
                    <div className="text-[#a3a29c] leading-relaxed space-y-6">
                        <p>
                            UpTrade is operated by {ENTITY}, which is responsible for the personal data described here. We collect
                            as little as we can: the terminal works without an account, and an account exists only to sync your
                            watchlist. Questions or requests: {CONTACT}.
                        </p>

                        <LegalSection title="1. What we collect">
                            <LegalList>
                                <li>
                                    <strong className="text-[#ecebe6]">Account details</strong> &mdash; if you sign up: your email
                                    address and a password, which our authentication provider stores only as a hash. If you sign in
                                    with Google, we receive your email address and basic profile from Google.
                                </li>
                                <li>
                                    <strong className="text-[#ecebe6]">Your watchlist</strong> &mdash; if you are signed in, the list
                                    of ticker symbols you save, linked to your account.
                                </li>
                                <li>
                                    <strong className="text-[#ecebe6]">Technical data</strong> &mdash; our hosting provider records
                                    standard request logs (IP address, browser user agent, page or API path, time). Our analytics
                                    record page views and performance metrics without cookies and without identifying you.
                                </li>
                                <li>
                                    <strong className="text-[#ecebe6]">Error reports</strong> &mdash; when something breaks, an error
                                    report may be sent to our error-monitoring provider with the error details, the page, and your
                                    browser and device type. We configure it not to collect cookies, request contents or account
                                    details.
                                </li>
                                <li>
                                    <strong className="text-[#ecebe6]">Symbols you look up</strong> &mdash; sent to our servers so we
                                    can fetch market data for them. We don&rsquo;t link lookups to your account, apart from the
                                    watchlist you choose to save.
                                </li>
                            </LegalList>
                            <p>
                                We don&rsquo;t collect payment details (the beta is free), we don&rsquo;t connect to brokerage accounts,
                                and we don&rsquo;t ask for your holdings or trades.
                            </p>
                        </LegalSection>

                        <LegalSection title="2. How we use it">
                            <LegalList>
                                <li>to run your account, keep you signed in and sync your watchlist (to perform our agreement with you);</li>
                                <li>to send service emails such as sign-up confirmation and password resets;</li>
                                <li>to keep the Service secure, prevent abuse and fix bugs (our legitimate interest in running a reliable service);</li>
                                <li>to understand, in aggregate, which pages are used so we can improve them (legitimate interest).</li>
                            </LegalList>
                            <p>
                                We don&rsquo;t sell or rent personal data, we don&rsquo;t show ads, and we don&rsquo;t send marketing
                                email unless you separately opt in.
                            </p>
                        </LegalSection>

                        <LegalSection title="3. Who processes it for us">
                            <LegalList>
                                <li><strong className="text-[#ecebe6]">Supabase</strong> &mdash; authentication and the database that stores your email and watchlist (United States).</li>
                                <li><strong className="text-[#ecebe6]">Vercel</strong> &mdash; hosting, request logs, Web Analytics and Speed Insights (United States).</li>
                                <li><strong className="text-[#ecebe6]">Sentry</strong> &mdash; error monitoring, when enabled (United States).</li>
                                <li><strong className="text-[#ecebe6]">Google</strong> &mdash; only if you choose to sign in with Google.</li>
                            </LegalList>
                            <p>
                                Market data is requested from Yahoo Finance by our servers; we don&rsquo;t send your personal data to
                                Yahoo. If you are outside the United States, your data is transferred there; where required, we rely
                                on our providers&rsquo; standard contractual clauses or equivalent safeguards.
                            </p>
                        </LegalSection>

                        <LegalSection title="4. How long we keep it">
                            <p>
                                Account details and your watchlist are kept until you delete your account. Hosting logs, analytics and
                                error reports are kept for the limited periods set by those providers and are not used to build a
                                profile of you.
                            </p>
                        </LegalSection>

                        <LegalSection title="5. Your rights and deleting your data">
                            <p>
                                Depending on where you live (for example under the GDPR, UK GDPR or California law), you can ask to
                                access, correct, export or delete your personal data, or object to how we use it. To delete your
                                account and watchlist, email {CONTACT} from the address on the account. We&rsquo;ll confirm and
                                complete requests within 30 days. You can also complain to your local data protection authority.
                            </p>
                        </LegalSection>

                        <LegalSection title="6. Data stored in your browser">
                            <p>
                                Chart, layout and indicator preferences, and the watchlist when you are signed out, are saved in your
                                browser&rsquo;s local storage and never leave your device unless you sign in to sync the watchlist.
                                Sign-in uses cookies. See the <Link href="/cookies" className="text-[#e8b04a] hover:underline">Cookie Policy</Link>.
                            </p>
                        </LegalSection>

                        <LegalSection title="7. Security">
                            <p>
                                Data is encrypted in transit (HTTPS), passwords are hashed by our authentication provider, and
                                database rules let each account read and write only its own watchlist. No system is perfectly
                                secure; if a breach affects your data we will tell you as the law requires.
                            </p>
                        </LegalSection>

                        <LegalSection title="8. Children">
                            <p>UpTrade is not meant for anyone under 18, and we don&rsquo;t knowingly collect their data.</p>
                        </LegalSection>

                        <LegalSection title="9. Changes">
                            <p>
                                If we change how we handle data, we&rsquo;ll update this page and its date, and tell account holders by
                                email about material changes.
                            </p>
                        </LegalSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
