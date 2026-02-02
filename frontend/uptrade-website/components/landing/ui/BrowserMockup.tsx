'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

interface BrowserMockupProps {
    className?: string;
}

interface Toast {
    id: number;
    symbol: string;
    message: string;
}

const tabs = [
    { id: 'tradex', label: 'TradeX', image: '/images/dashboard-tradex.png' },
    { id: 'visualx', label: 'VisualX', image: '/images/dashboard-visualx.png' },
];

const alertMessages = [
    { symbol: 'NVDA', message: 'Divergence detected +0.72σ' },
    { symbol: 'TSLA', message: 'Sentiment shift: Bearish' },
    { symbol: 'AAPL', message: 'Volume anomaly: +340%' },
    { symbol: 'META', message: 'TradeX score dropped to 45' },
];

export const BrowserMockup = ({ className = '' }: BrowserMockupProps) => {
    const [activeTab, setActiveTab] = useState('tradex');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [toastId, setToastId] = useState(0);

    // Simulate toast notifications every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
            const newToast = { id: toastId, ...alert };
            setToasts(prev => [...prev.slice(-2), newToast]); // Keep max 3 toasts
            setToastId(prev => prev + 1);

            // Auto-remove after 4 seconds
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, 4000);
        }, 5000);

        return () => clearInterval(interval);
    }, [toastId]);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const activeImage = tabs.find(t => t.id === activeTab)?.image || tabs[0].image;

    return (
        <div className={`rounded-xl overflow-hidden border border-[#2a2e39] bg-[#131722] shadow-2xl relative ${className}`}>
            {/* Browser Header */}
            <div className="h-12 bg-[#0b0e14] border-b border-[#2a2e39] flex items-center px-4 gap-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] hover:bg-[#ef4444]/80 cursor-pointer transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#fbbf24] hover:bg-[#fbbf24]/80 cursor-pointer transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#10b981] hover:bg-[#10b981]/80 cursor-pointer transition-colors" />
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="bg-[#1e222d] px-4 py-1.5 rounded-md text-xs text-[#868993] flex items-center gap-2 w-full max-w-sm">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                        app.uptrade.com/dashboard
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 bg-[#1e222d] rounded-lg p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-all ${activeTab === tab.id
                                    ? 'bg-[#2962FF] text-white'
                                    : 'text-[#868993] hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content using Image */}
            <div className="relative aspect-[16/10] w-full bg-[#0a0a0f]" style={{ position: 'relative' }}>
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-20 z-10 pointer-events-none" />

                <Image
                    src={activeImage}
                    alt="UpTrade Dashboard"
                    fill
                    className="object-cover transition-all duration-500"
                    priority
                />

                {/* Toast Notifications */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className="flex items-center gap-3 bg-[#131722]/95 backdrop-blur-md border border-[#ef4444]/30 rounded-lg px-4 py-3 shadow-lg animate-slide-in-from-right min-w-[240px]"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-[#ef4444]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-white text-sm font-bold">{toast.symbol}</div>
                                <div className="text-[#868993] text-xs">{toast.message}</div>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-[#868993] hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
