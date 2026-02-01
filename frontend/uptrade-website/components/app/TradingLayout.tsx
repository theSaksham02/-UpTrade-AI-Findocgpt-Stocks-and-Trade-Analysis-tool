'use client';

import Link from 'next/link';
import { Activity, BarChart2, PieChart, Newspaper, Settings, LogOut } from 'lucide-react';

export const TradingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[#0b0e14] flex">
            {/* Sidebar */}
            <aside className="w-16 md:w-64 border-r border-[#2a2e39] flex flex-col fixed h-full z-40 bg-[#0b0e14]">
                <div className="h-16 flex items-center px-4 md:px-6 border-b border-[#2a2e39]">
                    <Activity className="w-8 h-8 text-[#2962FF]" />
                    <span className="ml-3 font-bold text-white hidden md:block">UpTrade</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/app" className="flex items-center gap-3 px-3 py-2 text-[#868993] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors">
                        <BarChart2 className="w-5 h-5" />
                        <span className="hidden md:block">Dashboard</span>
                    </Link>
                    <Link href="/app/tradex" className="flex items-center gap-3 px-3 py-2 text-[#868993] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors">
                        <PieChart className="w-5 h-5" />
                        <span className="hidden md:block">TradeX</span>
                    </Link>
                    <Link href="/app/visualx" className="flex items-center gap-3 px-3 py-2 text-[#868993] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors">
                        <Newspaper className="w-5 h-5" />
                        <span className="hidden md:block">VisualX</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#2a2e39]">
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[#868993] hover:text-white hover:bg-[#1e222d] rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="hidden md:block">Settings</span>
                    </Link>
                    <button onClick={() => {
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }
                    }} className="w-full flex items-center gap-3 px-3 py-2 text-[#ef4444] hover:bg-[#1e222d] rounded-lg transition-colors mt-2">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:block">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-16 md:ml-64 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
};
