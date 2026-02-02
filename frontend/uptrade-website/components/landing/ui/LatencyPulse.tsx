'use client';

import { useState, useEffect } from 'react';
import { Zap, Wifi, Activity } from 'lucide-react';

export const LatencyPulse = () => {
    const [uptradeLat, setUptradeLat] = useState(47);
    const [retailLat, setRetailLat] = useState(240);
    const [raceProgress, setRaceProgress] = useState(0);
    const [isConnected, setIsConnected] = useState(true);

    // Simulate realistic latency fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setUptradeLat(Math.max(35, Math.min(55, 47 + (Math.random() - 0.5) * 10)));
            setRetailLat(Math.max(180, Math.min(320, 240 + (Math.random() - 0.5) * 80)));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Racing animation
    useEffect(() => {
        const raceInterval = setInterval(() => {
            setRaceProgress(prev => {
                if (prev >= 100) return 0;
                return prev + 2;
            });
        }, 50);
        return () => clearInterval(raceInterval);
    }, []);

    // Connection status simulation
    useEffect(() => {
        const connInterval = setInterval(() => {
            setIsConnected(prev => Math.random() > 0.05 ? true : prev);
        }, 2000);
        return () => clearInterval(connInterval);
    }, []);

    return (
        <div className="h-full rounded-2xl border border-[#2a2e39] bg-[#131722]/60 backdrop-blur-xl p-6 flex flex-col relative overflow-hidden group hover:border-[#00d4ff]/50 transition-all duration-300">
            {/* Glow effect */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-[#00d4ff]/10 rounded-full blur-3xl -ml-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        <div>
                            <div className="text-white font-bold">Latency</div>
                            <div className="text-xs text-[#868993]">Real-time</div>
                        </div>
                    </div>

                    {/* Connection status */}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                        <Wifi className="w-3 h-3" />
                        {isConnected ? 'Live' : 'Reconnecting'}
                    </div>
                </div>

                {/* Main latency display */}
                <div className="mb-8">
                    <div className="text-5xl font-bold text-[#00d4ff] font-mono">
                        {uptradeLat.toFixed(0)}
                        <span className="text-lg text-[#868993] font-normal">ms</span>
                    </div>
                    <div className="text-xs text-[#868993] mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#10b981]" />
                        WebSocket Connected
                    </div>
                </div>

                {/* Racing comparison */}
                <div className="space-y-4">
                    <div className="text-xs text-[#868993] font-medium uppercase tracking-wider mb-2">Speed Comparison</div>

                    {/* UpTrade bar */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-white">UpTrade</span>
                            <span className="text-sm font-mono text-[#00d4ff]">{uptradeLat.toFixed(0)}ms</span>
                        </div>
                        <div className="h-3 bg-[#0b0e14] rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#2962FF] rounded-full transition-all duration-300 relative"
                                style={{ width: `${Math.min(100, raceProgress * 2)}%` }}
                            >
                                {/* Racing dot */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#00d4ff]" />
                            </div>
                        </div>
                    </div>

                    {/* Retail bar */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-[#868993]">Retail Avg</span>
                            <span className="text-sm font-mono text-[#868993]">{retailLat.toFixed(0)}ms</span>
                        </div>
                        <div className="h-3 bg-[#0b0e14] rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-[#2a2e39] rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, raceProgress * 0.4)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-[#2a2e39]/50 grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-bold text-white">{((1 - uptradeLat / retailLat) * 100).toFixed(0)}%</div>
                        <div className="text-xs text-[#868993]">Faster than retail</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">50+</div>
                        <div className="text-xs text-[#868993]">Data sources</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
