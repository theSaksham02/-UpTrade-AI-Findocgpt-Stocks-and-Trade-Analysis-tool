import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { Shield, FileText, Cookie, AlertTriangle } from "lucide-react"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#1e293b", "#334155", "#475569"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          
          {/* Hero Section */}
          <section className="pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-500/20 backdrop-blur-md border border-slate-500/30 text-slate-300 text-sm font-medium mb-8">
                <Shield className="w-4 h-4 mr-2" />
                Legal Information
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Legal & Privacy
              </h1>
              
              <p className="text-xl text-white/70 mb-8">
                Our commitment to transparency, privacy, and responsible data handling
              </p>
            </div>
          </section>

          {/* Quick Navigation */}
          <section className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a href="#privacy" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <Shield className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Privacy Policy</h3>
                </a>
                <a href="#terms" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <FileText className="w-6 h-6 text-green-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Terms of Service</h3>
                </a>
                <a href="#cookies" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <Cookie className="w-6 h-6 text-yellow-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Cookie Policy</h3>
                </a>
                <a href="#disclaimer" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">Disclaimer</h3>
                </a>
              </div>
            </div>
          </section>

          {/* Legal Content */}
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Privacy Policy */}
              <div id="privacy" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-bold text-white">Privacy Policy</h2>
                </div>
                
                <div className="space-y-6 text-white/80">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Information We Collect</h3>
                    <p className="mb-3">
                      UpTrade collects information to provide better services to our users. We collect:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Account information (name, email, password)</li>
                      <li>Trading preferences and watchlist data</li>
                      <li>Usage data and analytics</li>
                      <li>Device and browser information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide and improve our services</li>
                      <li>Personalize your experience</li>
                      <li>Send important notifications and updates</li>
                      <li>Ensure security and prevent fraud</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Data Security</h3>
                    <p>
                      We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>
                    <p className="mb-3">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Access your personal data</li>
                      <li>Request data correction or deletion</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Export your data</li>
                    </ul>
                  </div>

                  <p className="text-sm text-white/60 italic">
                    Last updated: November 15, 2025
                  </p>
                </div>
              </div>

              {/* Terms of Service */}
              <div id="terms" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-8 h-8 text-green-400" />
                  <h2 className="text-3xl font-bold text-white">Terms of Service</h2>
                </div>
                
                <div className="space-y-6 text-white/80">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h3>
                    <p>
                      By accessing and using UpTrade, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Service Description</h3>
                    <p>
                      UpTrade provides AI-powered financial analysis tools, stock comparison features, and investment insights. Our services are for informational purposes only and do not constitute financial advice.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">User Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Maintain the confidentiality of your account</li>
                      <li>Provide accurate and up-to-date information</li>
                      <li>Use the service in compliance with applicable laws</li>
                      <li>Not attempt to hack, abuse, or disrupt our services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Subscription and Payments</h3>
                    <p className="mb-3">
                      UpTrade offers both free and paid subscription tiers. By subscribing to a paid plan:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>You authorize recurring charges to your payment method</li>
                      <li>Subscriptions auto-renew unless cancelled</li>
                      <li>Refunds are provided per our refund policy</li>
                      <li>We may modify pricing with 30 days notice</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
                    <p>
                      UpTrade is not liable for any trading losses or investment decisions made based on our platform. Our services are provided "as is" without warranties of any kind.
                    </p>
                  </div>

                  <p className="text-sm text-white/60 italic">
                    Last updated: November 15, 2025
                  </p>
                </div>
              </div>

              {/* Cookie Policy */}
              <div id="cookies" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Cookie className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-3xl font-bold text-white">Cookie Policy</h2>
                </div>
                
                <div className="space-y-6 text-white/80">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">What Are Cookies?</h3>
                    <p>
                      Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience and analyze how our service is used.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Types of Cookies We Use</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Essential Cookies</h4>
                        <p>Required for the website to function properly. These cannot be disabled.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Analytics Cookies</h4>
                        <p>Help us understand how visitors interact with our website by collecting anonymous data.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Preference Cookies</h4>
                        <p>Remember your settings and preferences for a personalized experience.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Marketing Cookies</h4>
                        <p>Track visitors across websites to display relevant advertisements.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Managing Cookies</h3>
                    <p>
                      You can control and delete cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
                    </p>
                  </div>

                  <p className="text-sm text-white/60 italic">
                    Last updated: November 15, 2025
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div id="disclaimer" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  <h2 className="text-3xl font-bold text-white">Disclaimer</h2>
                </div>
                
                <div className="space-y-6 text-white/80">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="font-semibold text-red-300 mb-2">
                      ⚠️ Investment Risk Warning
                    </p>
                    <p className="text-red-200/80">
                      Trading stocks and other securities involves substantial risk of loss. Past performance is not indicative of future results.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Not Financial Advice</h3>
                    <p>
                      UpTrade provides analytical tools and information for educational purposes only. Nothing on this platform should be considered as financial, investment, trading, or any other type of professional advice. Always consult with a qualified financial advisor before making investment decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">No Guarantees</h3>
                    <p>
                      We do not guarantee the accuracy, completeness, or timeliness of any information provided. Market data may be delayed, and AI-generated insights are based on algorithms that may contain errors or biases.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Third-Party Data</h3>
                    <p>
                      We use data from various third-party sources. While we strive for accuracy, we are not responsible for errors or omissions in third-party data. Always verify information from official sources before making trading decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">User Responsibility</h3>
                    <p className="mb-3">
                      By using UpTrade, you acknowledge that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>You are solely responsible for your investment decisions</li>
                      <li>You understand the risks involved in trading</li>
                      <li>You will conduct your own due diligence</li>
                      <li>UpTrade is not liable for any trading losses</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Regulatory Compliance</h3>
                    <p>
                      UpTrade is not a registered investment advisor, broker-dealer, or financial institution. We do not execute trades, hold funds, or provide personalized investment recommendations.
                    </p>
                  </div>

                  <p className="text-sm text-white/60 italic">
                    Last updated: November 15, 2025
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-slate-500/20 to-slate-600/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Questions About Our Legal Terms?</h3>
                <p className="text-white/70 mb-6">
                  If you have any questions or concerns about our legal policies, please contact us.
                </p>
                <a 
                  href="mailto:legal@uptrade.com" 
                  className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-all"
                >
                  Contact Legal Team
                </a>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
