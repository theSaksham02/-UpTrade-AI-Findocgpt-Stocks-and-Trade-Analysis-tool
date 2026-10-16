import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingHeader } from '@/components/landing/Header';
import { CONTACT, LegalList, LegalSection, LegalTitle } from '@/components/legal/legal-section';
// Footer handled by layout

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'The cookies and browser storage UpTrade uses: sign-in cookies and local preferences. No ad or tracking cookies.',
};

export default function CookiesPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <div className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <LegalTitle>Cookie Policy</LegalTitle>
                    <div className="text-[#a3a29c] leading-relaxed space-y-6">
                        <p>
                            UpTrade uses a small number of cookies to keep you signed in, and your browser&rsquo;s local storage to
                            remember chart preferences. We don&rsquo;t use advertising cookies or cross-site tracking.
                        </p>

                        <LegalSection title="Sign-in cookies (strictly necessary)">
                            <p>
                                When you sign in, our authentication provider, Supabase, sets cookies whose names start with{' '}
                                <code className="font-mono text-[#ecebe6]">sb-</code> (for example{' '}
                                <code className="font-mono text-[#ecebe6]">sb-&hellip;-auth-token</code>). They hold your session so
                                you stay signed in and so your watchlist can sync. They are removed when you sign out or the session
                                expires. If you never sign in, they aren&rsquo;t set.
                            </p>
                        </LegalSection>

                        <LegalSection title="Local storage (preferences)">
                            <p>
                                The terminal saves settings in your browser under keys starting with{' '}
                                <code className="font-mono text-[#ecebe6]">uptrade.</code>:
                            </p>
                            <LegalList>
                                <li>chart layout, interval, scale and which charts are open;</li>
                                <li>indicator, forecast and anomaly-marker settings;</li>
                                <li>your watchlist while you are signed out.</li>
                            </LegalList>
                            <p>This data stays on your device and is not sent to us, except the watchlist if you sign in to sync it.</p>
                        </LegalSection>

                        <LegalSection title="Analytics and monitoring">
                            <p>
                                We use Vercel Web Analytics and Speed Insights to count page views and measure load performance. They
                                don&rsquo;t set cookies and don&rsquo;t identify you across sites. Error monitoring (Sentry), when enabled,
                                reports crashes and does not use advertising or tracking cookies.
                            </p>
                        </LegalSection>

                        <LegalSection title="Your choices">
                            <p>
                                Because we only use storage that is needed for the features you use, we don&rsquo;t show a cookie
                                banner. You can block or delete cookies and site data in your browser settings: blocking the sign-in
                                cookies means you can&rsquo;t sign in, and clearing site data resets your chart preferences.
                            </p>
                            <p>
                                More on how we handle data is in the{' '}
                                <Link href="/privacy" className="text-[#e8b04a] hover:underline">Privacy Policy</Link>. Questions:{' '}
                                {CONTACT}.
                            </p>
                        </LegalSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
