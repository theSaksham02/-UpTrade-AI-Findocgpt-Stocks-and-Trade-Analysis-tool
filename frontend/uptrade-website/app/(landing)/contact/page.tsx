'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Send } from 'lucide-react';

const contacts = [
    { label: 'Sales', email: 'sales@uptrade.com', description: 'Enterprise inquiries' },
    { label: 'Support', email: 'support@uptrade.com', description: 'Technical help' },
    { label: 'API Issues', email: 'api@uptrade.com', description: 'Integration support' },
    { label: 'Partnerships', email: 'partners@uptrade.com', description: 'Business development' },
];

const faqs = [
    {
        q: 'What is your response time for support tickets?',
        a: 'Free tier: 48h. Pro tier: 24h. Enterprise: <4h with dedicated Slack channel.'
    },
    {
        q: 'Do you offer onboarding calls?',
        a: 'Yes. Pro users get a 30-min onboarding. Enterprise gets custom integration support.'
    },
    {
        q: 'How do I report a critical API issue?',
        a: 'Email api@uptrade.com with subject line starting with [CRITICAL]. We monitor 24/7.'
    },
];

export default function ContactPage() {
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleCopy = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-32 pb-8 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-[#00d4ff] font-mono text-sm mb-2 tracking-wider">CONTACT</div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
                        Support Desk
                    </h1>
                    <p className="text-[#868993]">
                        Reach out via email or use the terminal below.
                    </p>
                </div>
            </section>

            {/* Main Content - Split Layout */}
            <section className="px-6 pb-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Left: Contact Methods */}
                    <div>
                        <div className="bg-[#13131f] border border-white/10 rounded-lg overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0f] border-b border-white/10">
                                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                <span className="text-xs text-[#868993] font-mono ml-2">contacts.sh</span>
                            </div>
                            <div className="p-4 space-y-4">
                                {contacts.map((contact) => (
                                    <motion.div
                                        key={contact.email}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between group"
                                    >
                                        <div className="font-mono text-sm">
                                            <span className="text-[#10b981]">&gt;</span>{' '}
                                            <span className="text-[#868993]">{contact.label}:</span>{' '}
                                            <span className="text-[#00d4ff]">{contact.email}</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(contact.email)}
                                            className="text-[#868993] hover:text-white transition-colors p-1"
                                            title="Copy to clipboard"
                                        >
                                            {copiedEmail === contact.email ? (
                                                <Check className="w-4 h-4 text-[#10b981]" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </motion.div>
                                ))}
                                <div className="pt-4 border-t border-white/10 mt-4">
                                    <div className="text-xs text-[#868993] font-mono">
                                        <span className="text-[#fbbf24]"># Office Hours</span>
                                        <br />
                                        Mon-Fri 09:00-18:00 EST
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                            </span>
                            <span className="text-[#10b981] font-mono">All systems operational</span>
                            <a href="/status" className="text-[#868993] hover:text-white ml-2 underline text-xs">
                                View status →
                            </a>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div>
                        <div className="bg-[#13131f] border border-white/10 rounded-lg overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0f] border-b border-white/10">
                                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                <span className="text-xs text-[#868993] font-mono ml-2">send_message.sh</span>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-xs text-[#868993] font-mono mb-1">
                                        // Your Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full bg-[#0a0a0f] border border-white/10 text-white px-3 py-2 rounded font-mono text-sm focus:outline-none focus:border-[#00d4ff] placeholder:text-[#868993]/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#868993] font-mono mb-1">
                                        // Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="API integration help"
                                        required
                                        className="w-full bg-[#0a0a0f] border border-white/10 text-white px-3 py-2 rounded font-mono text-sm focus:outline-none focus:border-[#00d4ff] placeholder:text-[#868993]/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#868993] font-mono mb-1">
                                        // Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Describe your issue or question..."
                                        required
                                        rows={5}
                                        className="w-full bg-[#0a0a0f] border border-white/10 text-white px-3 py-2 rounded font-mono text-sm focus:outline-none focus:border-[#00d4ff] placeholder:text-[#868993]/50 resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-[#00d4ff] text-[#0a0a0f] font-mono font-bold text-sm rounded hover:bg-[#00b8d9] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    &gt; Send Message
                                </button>
                                {submitted && (
                                    <div className="text-[#10b981] text-sm font-mono text-center">
                                        ✓ Message sent successfully [{new Date().toISOString()}]
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 pb-24">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-lg font-bold text-white mb-6 font-mono">
                        <span className="text-[#868993]"># </span>FAQs
                    </h2>
                    <div className="space-y-3 font-mono">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-[#13131f] border border-white/10 rounded-lg p-4">
                                <div className="text-[#00d4ff] text-sm mb-2">
                                    <span className="text-[#868993]">Q: </span>{faq.q}
                                </div>
                                <div className="text-white text-sm pl-3 border-l-2 border-[#10b981]/30">
                                    <span className="text-[#10b981]">A: </span>{faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
