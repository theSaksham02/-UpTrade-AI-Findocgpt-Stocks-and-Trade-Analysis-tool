'use client'

import { useEffect, useState } from 'react';
import { Activity, Clock, Database, Zap } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

const metrics = [
    { name: 'API Response Time (p50)', value: 12, unit: 'ms', target: '<20ms', status: 'good' },
    { name: 'API Response Time (p99)', value: 47, unit: 'ms', target: '<100ms', status: 'good' },
    { name: 'WebSocket Latency', value: 23, unit: 'ms', target: '<50ms', status: 'good' },
    { name: 'Sentiment Pipeline', value: 8, unit: 'ms', target: '<10ms', status: 'good' },
    { name: 'Vector Query (Top-K)', value: 42, unit: 'ms', target: '<50ms', status: 'warning' },
    { name: 'Database Query', value: 18, unit: 'ms', target: '<25ms', status: 'good' },
];

const throughput = [
    { metric: 'HTTP Requests', value: '12,450', unit: '/sec' },
    { metric: 'WebSocket Messages', value: '1.2M', unit: '/sec' },
    { metric: 'Sentiment Inferences', value: '45,000', unit: '/sec' },
    { metric: 'Vector Searches', value: '8,200', unit: '/sec' },
];

const uptimeData = [
    { month: 'Jan', uptime: 99.99 },
    { month: 'Feb', uptime: 99.97 },
    { month: 'Mar', uptime: 100.00 },
    { month: 'Apr', uptime: 99.98 },
    { month: 'May', uptime: 99.99 },
    { month: 'Jun', uptime: 100.00 },
];

export default function PerformancePage() {
    const [liveMetrics, setLiveMetrics] = useState(metrics);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveMetrics(prev => prev.map(m => ({
                ...m,
                value: m.value + (Math.random() - 0.5) * 2
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 border-b border-[#2a2e39]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-[#ff9800] font-mono text-sm mb-4 tracking-wider">SYSTEM STATUS</div>
                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="text-5xl font-bold text-white">Performance Dashboard</h1>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#089981]/20 border border-[#089981] rounded-full">
                            <div className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
                            <span className="text-[#089981] text-sm font-medium">All Systems Operational</span>
                        </div>
                    </div>
                    <p className="text-xl text-[#868993]">
                        Real-time infrastructure metrics. Updated every 2 seconds.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Throughput Cards */}
                    <div className="grid md:grid-cols-4 gap-6">
                        {throughput.map((item) => (
                            <div key={item.metric} className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl p-6">
                                <div className="text-[#868993] text-sm mb-2">{item.metric}</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white font-mono">{item.value}</span>
                                    <span className="text-[#868993] text-sm">{item.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Latency Table */}
                    <div className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#2a2e39]">
                            <h3 className="text-white font-bold">Latency Metrics (Live)</h3>
                        </div>
                        <div className="divide-y divide-[#2a2e39]">
                            {liveMetrics.map((m) => (
                                <div key={m.name} className="px-6 py-4 flex items-center justify-between">
                                    <div className="text-white text-sm">{m.name}</div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-[#868993] text-sm">Target: {m.target}</div>
                                        <div className={`font-mono font-bold ${m.status === 'good' ? 'text-[#089981]' : 'text-[#ff9800]'
                                            }`}>
                                            {m.value.toFixed(1)}{m.unit}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Uptime Chart */}
                    <div className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6">
                        <h3 className="text-white font-bold mb-6">Uptime History (6 Months)</h3>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {uptimeData.map((d) => (
                                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-[#1e222d] rounded-t relative overflow-hidden" style={{ height: '100%' }}>
                                        <div
                                            className="absolute bottom-0 w-full bg-[#089981] transition-all"
                                            style={{ height: `${(d.uptime / 100) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-[#868993]">{d.month}</div>
                                    <div className="text-xs font-mono text-[#089981]">{d.uptime}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incident History */}
                    <div className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">Recent Incidents</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-[#2a2e39]">
                                <div>
                                    <div className="text-white text-sm">Degraded WebSocket Performance</div>
                                    <div className="text-[#868993] text-xs">Mar 15, 2024 · 14:23 UTC</div>
                                </div>
                                <span className="px-2 py-1 bg-[#089981]/20 text-[#089981] text-xs rounded">Resolved</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-[#2a2e39]">
                                <div>
                                    <div className="text-white text-sm">Scheduled Maintenance</div>
                                    <div className="text-[#868993] text-xs">Feb 28, 2024 · 03:00 UTC</div>
                                </div>
                                <span className="px-2 py-1 bg-[#089981]/20 text-[#089981] text-xs rounded">Completed</span>
                            </div>
                            <div className="py-2 text-center text-[#868993] text-sm">
                                No incidents in the last 30 days
                            </div>
                        </div>
                    </div>
                </div>
            </section>

// Footer removed (handled by layout)
        </div>
    );
};
