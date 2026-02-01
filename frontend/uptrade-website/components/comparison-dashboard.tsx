'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Brain, Activity, TrendingUp, AlertTriangle, Search, RefreshCw, Plus, X, Loader2 } from 'lucide-react'

// TradingView color palette
const colors = {
    background: '#0b0e14',
    surface: '#131722',
    surfaceHover: '#1e222d',
    border: '#2a2e39',
    borderLight: '#363a45',
    text: '#d1d4dc',
    textMuted: '#868993',
    green: '#089981',
    red: '#f23645',
    blue: '#2962FF',
    orange: '#ff9800',
    purple: '#9C27B0',
}

// Types
interface FactorBreakdown {
    value_factor: number
    momentum_factor: number
    sentiment_alpha: number
    quality_factor: number
    fusion_weight_fundamental: number
    fusion_weight_sentiment: number
    fusion_weight_technical: number
}

interface AssetRanking {
    rank: number
    symbol: string
    pas_score: number
    confidence: [number, number]
    quartile: 'Q1' | 'Q2' | 'Q3' | 'Q4'
    factors: FactorBreakdown
    risks: string[]
}

interface StatRecommendation {
    symbol: string
    z_score: number
    alpha: number
    confidence: 'high' | 'moderate' | 'low'
}

interface ClusterAnalysis {
    clusters: number[]
    outliers: string[]
}

interface ComparisonResult {
    rankings: AssetRanking[]
    top_recommendations: StatRecommendation[]
    cluster_analysis: ClusterAnalysis
    market_regime: 'bull' | 'bear' | 'volatile' | 'neutral'
    comparison_timestamp: string
}

// Quartile color mapping
const getQuartileColor = (quartile: string) => {
    switch (quartile) {
        case 'Q1': return colors.green
        case 'Q2': return colors.blue
        case 'Q3': return colors.orange
        case 'Q4': return colors.red
        default: return colors.textMuted
    }
}

// Market regime color
const getRegimeColor = (regime: string) => {
    switch (regime) {
        case 'bull': return colors.green
        case 'bear': return colors.red
        case 'volatile': return colors.orange
        default: return colors.blue
    }
}

// Factor Bar Component
function FactorBar({ label, value, color, max = 100 }: { label: string; value: number; color: string; max?: number }) {
    const percentage = Math.min((value / max) * 100, 100)

    return (
        <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
                <span style={{ color: colors.textMuted }}>{label}</span>
                <span style={{ color: colors.text }}>{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
        </div>
    )
}

// Ranking Card Component
function RankingCard({ asset, onClick }: { asset: AssetRanking; onClick: () => void }) {
    const quartileColor = getQuartileColor(asset.quartile)

    return (
        <div
            onClick={onClick}
            className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            style={{
                backgroundColor: colors.surfaceHover,
                border: `1px solid ${colors.border}`,
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: quartileColor, color: 'white' }}
                    >
                        {asset.rank}
                    </div>
                    <div>
                        <div className="font-bold" style={{ color: colors.text }}>{asset.symbol}</div>
                        <div className="text-xs" style={{ color: colors.textMuted }}>{asset.quartile}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold font-mono" style={{ color: colors.text }}>
                        {asset.pas_score.toFixed(1)}
                    </div>
                    <div className="text-xs" style={{ color: colors.textMuted }}>
                        [{asset.confidence[0].toFixed(0)}-{asset.confidence[1].toFixed(0)}]
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-1 rounded" style={{ backgroundColor: colors.surface }}>
                    <div style={{ color: colors.textMuted }}>Value</div>
                    <div style={{ color: colors.blue }}>{(asset.factors.value_factor * 100).toFixed(0)}%</div>
                </div>
                <div className="text-center p-1 rounded" style={{ backgroundColor: colors.surface }}>
                    <div style={{ color: colors.textMuted }}>Sentiment</div>
                    <div style={{ color: colors.green }}>{(asset.factors.sentiment_alpha * 100).toFixed(0)}%</div>
                </div>
                <div className="text-center p-1 rounded" style={{ backgroundColor: colors.surface }}>
                    <div style={{ color: colors.textMuted }}>Momentum</div>
                    <div style={{ color: colors.orange }}>{(asset.factors.momentum_factor * 100).toFixed(0)}%</div>
                </div>
            </div>

            {asset.risks.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: colors.orange }}>
                    <AlertTriangle className="w-3 h-3" />
                    {asset.risks[0]}
                </div>
            )}
        </div>
    )
}

// Stat Recommendation Card
function RecommendationCard({ rec }: { rec: StatRecommendation }) {
    return (
        <div
            className="p-3 rounded-lg"
            style={{
                backgroundColor: `${colors.green}15`,
                borderLeft: `3px solid ${colors.green}`,
            }}
        >
            <div className="flex justify-between items-center">
                <span className="font-bold" style={{ color: colors.text }}>{rec.symbol}</span>
                <span className="font-mono" style={{ color: colors.green }}>Z: {rec.z_score.toFixed(2)}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: colors.textMuted }}>
                Alpha: +{rec.alpha.toFixed(2)} • {rec.confidence} confidence
            </div>
        </div>
    )
}

// Main Comparison Dashboard
export function ComparisonDashboard() {
    const [symbols, setSymbols] = useState(['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'TSLA'])
    const [inputValue, setInputValue] = useState('')
    const [result, setResult] = useState<ComparisonResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<AssetRanking | null>(null)
    const [activeTab, setActiveTab] = useState<'scatter' | 'factors' | 'similarity'>('scatter')

    // Simulated data fetch (replace with actual API call)
    const fetchComparison = useCallback(async () => {
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Generate mock data
        const mockResult: ComparisonResult = {
            rankings: symbols.map((sym, i) => ({
                rank: i + 1,
                symbol: sym,
                pas_score: Math.random() * 40 + 50,
                confidence: [Math.random() * 10 + 40, Math.random() * 10 + 70] as [number, number],
                quartile: (['Q1', 'Q2', 'Q3', 'Q4'] as const)[Math.floor(i / 2)],
                factors: {
                    value_factor: Math.random() * 0.3 + 0.4,
                    momentum_factor: Math.random() * 0.4 + 0.3,
                    sentiment_alpha: Math.random() * 0.5 + 0.3,
                    quality_factor: Math.random() * 0.3 + 0.5,
                    fusion_weight_fundamental: 0.35,
                    fusion_weight_sentiment: 0.40,
                    fusion_weight_technical: 0.25,
                },
                risks: Math.random() > 0.6 ? ['sentiment_declining'] : [],
            })),
            top_recommendations: symbols.slice(0, 2).map(sym => ({
                symbol: sym,
                z_score: Math.random() * 1.5 + 2,
                alpha: Math.random() * 15 + 5,
                confidence: 'high' as const,
            })),
            cluster_analysis: {
                clusters: symbols.map(() => Math.floor(Math.random() * 3)),
                outliers: [symbols[Math.floor(Math.random() * symbols.length)]],
            },
            market_regime: (['bull', 'bear', 'volatile', 'neutral'] as const)[Math.floor(Math.random() * 4)],
            comparison_timestamp: new Date().toISOString(),
        }

        // Sort by PAS score
        mockResult.rankings.sort((a, b) => b.pas_score - a.pas_score)
        mockResult.rankings.forEach((r, i) => {
            r.rank = i + 1
            r.quartile = (['Q1', 'Q2', 'Q3', 'Q4'] as const)[Math.min(Math.floor(i / (symbols.length / 4)), 3)]
        })

        setResult(mockResult)
        setLoading(false)
    }, [symbols])

    useEffect(() => {
        fetchComparison()
    }, [])

    const addSymbol = () => {
        if (inputValue && !symbols.includes(inputValue.toUpperCase())) {
            setSymbols([...symbols, inputValue.toUpperCase()])
            setInputValue('')
        }
    }

    const removeSymbol = (sym: string) => {
        setSymbols(symbols.filter(s => s !== sym))
    }

    // Scatter plot data
    const scatterData = result?.rankings.map(r => ({
        x: r.factors.value_factor * 100,
        y: r.factors.sentiment_alpha * 100,
        size: r.pas_score,
        ...r
    })) || []

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: colors.text }}>
                            <Brain className="w-8 h-8" style={{ color: colors.blue }} />
                            TradeX Decision Engine
                        </h1>
                        <p className="mt-2" style={{ color: colors.textMuted }}>
                            Multi-factor comparison with VisualX sentiment fusion
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {result && (
                            <div
                                className="px-4 py-2 rounded-lg"
                                style={{ backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}` }}
                            >
                                <span style={{ color: colors.textMuted }}>Market Regime: </span>
                                <span className="font-bold uppercase" style={{ color: getRegimeColor(result.market_regime) }}>
                                    {result.market_regime}
                                </span>
                            </div>
                        )}
                        <button
                            onClick={fetchComparison}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            style={{
                                backgroundColor: colors.blue,
                                color: 'white',
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Recalculate
                        </button>
                    </div>
                </div>

                {/* Symbol Selector */}
                <div className="flex gap-2 flex-wrap items-center">
                    {symbols.map(sym => (
                        <div
                            key={sym}
                            className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                            style={{
                                backgroundColor: colors.surfaceHover,
                                border: `1px solid ${colors.borderLight}`,
                                color: colors.text,
                            }}
                        >
                            {sym}
                            <button onClick={() => removeSymbol(sym)} style={{ color: colors.textMuted }}>
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && addSymbol()}
                            placeholder="Add symbol..."
                            className="px-3 py-1.5 rounded-full text-sm outline-none"
                            style={{
                                backgroundColor: 'transparent',
                                border: `1px solid ${colors.border}`,
                                color: colors.text,
                                width: '120px',
                            }}
                        />
                        <button
                            onClick={addSymbol}
                            className="p-1.5 rounded-full"
                            style={{ backgroundColor: colors.blue }}
                        >
                            <Plus className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left: Visualization */}
                <div
                    className="col-span-8 rounded-xl p-6"
                    style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
                >
                    {/* Tabs */}
                    <div className="flex gap-6 mb-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
                        {[
                            { id: 'scatter', label: 'Factor Map', icon: Activity },
                            { id: 'factors', label: 'Fusion Weights', icon: Brain },
                            { id: 'similarity', label: 'Similarity', icon: TrendingUp },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className="flex items-center gap-2 pb-3 text-sm font-medium transition-colors"
                                style={{
                                    color: activeTab === tab.id ? colors.blue : colors.textMuted,
                                    borderBottom: activeTab === tab.id ? `2px solid ${colors.blue}` : 'none',
                                }}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Scatter Plot (Simple CSS Implementation) */}
                    {activeTab === 'scatter' && (
                        <div className="relative h-[400px]" style={{ backgroundColor: colors.background }}>
                            {/* Grid lines */}
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} style={{ border: `1px solid ${colors.border}` }} />
                                ))}
                            </div>

                            {/* Axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 text-center text-xs" style={{ color: colors.textMuted }}>
                                Fundamental Quality →
                            </div>
                            <div
                                className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs whitespace-nowrap"
                                style={{ color: colors.textMuted }}
                            >
                                ← VisualX Sentiment
                            </div>

                            {/* Quadrant dividers */}
                            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: colors.borderLight }} />
                            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: colors.borderLight }} />

                            {/* Data points */}
                            {scatterData.map((point, i) => (
                                <div
                                    key={point.symbol}
                                    className="absolute rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-transform hover:scale-110"
                                    style={{
                                        left: `${point.x - 5}%`,
                                        bottom: `${point.y - 5}%`,
                                        width: `${Math.max(point.size / 2, 30)}px`,
                                        height: `${Math.max(point.size / 2, 30)}px`,
                                        backgroundColor: getQuartileColor(point.quartile),
                                        color: 'white',
                                    }}
                                    title={`${point.symbol}: PAS ${point.size.toFixed(1)}`}
                                    onClick={() => setSelectedAsset(point)}
                                >
                                    {point.symbol.slice(0, 2)}
                                </div>
                            ))}

                            {/* Legend */}
                            <div className="absolute bottom-4 right-4 flex gap-4 text-xs" style={{ color: colors.textMuted }}>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.green }} />
                                    Q1
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.blue }} />
                                    Q2
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.orange }} />
                                    Q3
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.red }} />
                                    Q4
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fusion Weights */}
                    {activeTab === 'factors' && result && (
                        <div className="space-y-6">
                            <p className="text-sm" style={{ color: colors.textMuted }}>
                                Neural network dynamically adjusts factor weights based on market regime.
                            </p>

                            {result.rankings.slice(0, 6).map(asset => (
                                <div key={asset.symbol} className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceHover }}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold" style={{ color: colors.text }}>{asset.symbol}</span>
                                        <span className="text-sm font-mono" style={{ color: colors.green }}>
                                            PAS: {asset.pas_score.toFixed(1)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <FactorBar
                                            label="Fundamental"
                                            value={asset.factors.fusion_weight_fundamental}
                                            color={colors.blue}
                                            max={1}
                                        />
                                        <FactorBar
                                            label="Sentiment"
                                            value={asset.factors.fusion_weight_sentiment}
                                            color={colors.green}
                                            max={1}
                                        />
                                        <FactorBar
                                            label="Technical"
                                            value={asset.factors.fusion_weight_technical}
                                            color={colors.orange}
                                            max={1}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Similarity Search */}
                    {activeTab === 'similarity' && (
                        <div className="text-center py-12" style={{ color: colors.textMuted }}>
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select an asset to find similar investments</p>
                            <p className="text-xs mt-2">Use case: "Find assets like AAPL but with better sentiment"</p>
                        </div>
                    )}
                </div>

                {/* Right: Rankings & Recommendations */}
                <div className="col-span-4 space-y-4">
                    {/* Top Recommendations */}
                    {result && result.top_recommendations.length > 0 && (
                        <div
                            className="rounded-xl p-4"
                            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
                        >
                            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                                <TrendingUp className="w-5 h-5" style={{ color: colors.green }} />
                                Statistical Significance (p &lt; 0.05)
                            </h3>
                            <div className="space-y-3">
                                {result.top_recommendations.map(rec => (
                                    <RecommendationCard key={rec.symbol} rec={rec} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rankings */}
                    <div
                        className="rounded-xl p-4 max-h-[500px] overflow-y-auto"
                        style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
                    >
                        <h3 className="font-bold mb-4" style={{ color: colors.text }}>PAS Rankings</h3>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.blue }} />
                                </div>
                            ) : (
                                result?.rankings.map(asset => (
                                    <RankingCard
                                        key={asset.symbol}
                                        asset={asset}
                                        onClick={() => setSelectedAsset(asset)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cluster Outliers */}
                    {result && result.cluster_analysis.outliers.length > 0 && (
                        <div
                            className="rounded-xl p-4"
                            style={{
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.orange}`,
                            }}
                        >
                            <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: colors.orange }}>
                                <AlertTriangle className="w-4 h-4" />
                                Cluster Outliers
                            </h3>
                            <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
                                Assets deviating from peer clusters (potential mispricing)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {result.cluster_analysis.outliers.map(sym => (
                                    <span
                                        key={sym}
                                        className="px-2 py-1 rounded text-xs font-bold"
                                        style={{
                                            backgroundColor: `${colors.orange}20`,
                                            color: colors.orange,
                                        }}
                                    >
                                        {sym}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Asset Detail Modal */}
            {selectedAsset && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    onClick={() => setSelectedAsset(null)}
                >
                    <div
                        className="max-w-md w-full mx-4 rounded-xl p-6"
                        style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold" style={{ color: colors.text }}>{selectedAsset.symbol}</h3>
                            <button onClick={() => setSelectedAsset(null)}>
                                <X className="w-5 h-5" style={{ color: colors.textMuted }} />
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold font-mono" style={{ color: getQuartileColor(selectedAsset.quartile) }}>
                                {selectedAsset.pas_score.toFixed(1)}
                            </div>
                            <div className="text-sm" style={{ color: colors.textMuted }}>
                                Predictive Alpha Score • {selectedAsset.quartile}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <FactorBar label="Value Factor" value={selectedAsset.factors.value_factor} color={colors.blue} max={1} />
                            <FactorBar label="Sentiment Alpha" value={selectedAsset.factors.sentiment_alpha} color={colors.green} max={1} />
                            <FactorBar label="Momentum" value={selectedAsset.factors.momentum_factor} color={colors.orange} max={1} />
                            <FactorBar label="Quality" value={selectedAsset.factors.quality_factor} color={colors.purple} max={1} />
                        </div>

                        <div className="mt-4 text-xs" style={{ color: colors.textMuted }}>
                            95% CI: [{selectedAsset.confidence[0].toFixed(1)}, {selectedAsset.confidence[1].toFixed(1)}]
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ComparisonDashboard
