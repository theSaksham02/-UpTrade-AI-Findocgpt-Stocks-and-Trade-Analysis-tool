'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { marketDataService, SymbolInfo, Quote } from '@/lib/market-data-service'

interface SymbolSearchProps {
    onSelect: (symbol: string) => void
    className?: string
}

export function SymbolSearch({ onSelect, className = '' }: SymbolSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SymbolInfo[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [recentSymbols, setRecentSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL'])
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Search symbols
    useEffect(() => {
        if (query.length > 0) {
            const searchResults = marketDataService.searchSymbols(query)
            setResults(searchResults)
            setSelectedIndex(0)
        } else {
            setResults([])
        }
    }, [query])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(i => Math.max(i - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex].symbol)
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }, [results, selectedIndex])

    const handleSelect = (symbol: string) => {
        onSelect(symbol)
        setQuery('')
        setIsOpen(false)
        // Update recent symbols
        setRecentSymbols(prev => [symbol, ...prev.filter(s => s !== symbol)].slice(0, 5))
    }

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: `1px solid ${isOpen ? 'var(--tv-blue)' : 'var(--tv-border)'}`,
                }}
            >
                <Search className="w-4 h-4" style={{ color: 'var(--tv-text-muted)' }} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search symbol..."
                    className="bg-transparent border-none outline-none text-sm w-48"
                    style={{ color: 'var(--tv-text-primary)' }}
                />
                {query && (
                    <button onClick={() => setQuery('')}>
                        <X className="w-4 h-4" style={{ color: 'var(--tv-text-muted)' }} />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{
                        backgroundColor: 'var(--tv-surface)',
                        border: '1px solid var(--tv-border)',
                        minWidth: '320px',
                    }}
                >
                    {/* Recent Symbols */}
                    {query.length === 0 && recentSymbols.length > 0 && (
                        <div>
                            <div
                                className="px-3 py-2 text-xs font-medium flex items-center gap-2"
                                style={{ color: 'var(--tv-text-muted)', borderBottom: '1px solid var(--tv-border)' }}
                            >
                                <Clock className="w-3 h-3" />
                                Recent
                            </div>
                            {recentSymbols.map((symbol) => (
                                <SymbolRow
                                    key={symbol}
                                    symbol={symbol}
                                    onSelect={handleSelect}
                                    isSelected={false}
                                />
                            ))}
                        </div>
                    )}

                    {/* Search Results */}
                    {query.length > 0 && results.length > 0 && (
                        <div className="max-h-64 overflow-y-auto">
                            {results.map((result, index) => (
                                <SymbolRow
                                    key={result.symbol}
                                    symbol={result.symbol}
                                    onSelect={handleSelect}
                                    isSelected={index === selectedIndex}
                                    name={result.name}
                                    exchange={result.exchange}
                                    type={result.type}
                                />
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.length > 0 && results.length === 0 && (
                        <div
                            className="px-4 py-6 text-center text-sm"
                            style={{ color: 'var(--tv-text-muted)' }}
                        >
                            No symbols found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Individual symbol row with real-time quote
function SymbolRow({
    symbol,
    onSelect,
    isSelected,
    name,
    exchange,
    type
}: {
    symbol: string
    onSelect: (symbol: string) => void
    isSelected: boolean
    name?: string
    exchange?: string
    type?: string
}) {
    const [quote, setQuote] = useState<Quote | null>(null)

    useEffect(() => {
        const q = marketDataService.getQuote(symbol)
        setQuote(q)
    }, [symbol])

    const isPositive = quote ? quote.changePercent >= 0 : true

    return (
        <button
            onClick={() => onSelect(symbol)}
            className="w-full px-3 py-2.5 flex items-center justify-between transition-colors text-left"
            style={{
                backgroundColor: isSelected ? 'var(--tv-surface-hover)' : 'transparent',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--tv-surface-hover)'}
            onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
            }}
        >
            <div className="flex items-center gap-3">
                {/* Symbol Badge */}
                <div
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                    style={{
                        backgroundColor: type === 'crypto' ? '#FF9800' : type === 'index' ? '#2962FF' : 'var(--tv-green)',
                        color: 'white',
                    }}
                >
                    {symbol.slice(0, 2)}
                </div>

                <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--tv-text-primary)' }}>
                        {symbol}
                    </div>
                    {(name || exchange) && (
                        <div className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>
                            {name || exchange}
                        </div>
                    )}
                </div>
            </div>

            {quote && (
                <div className="text-right">
                    <div className="font-medium text-sm" style={{ color: 'var(--tv-text-primary)' }}>
                        ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                        className="text-xs font-medium flex items-center justify-end gap-0.5"
                        style={{ color: isPositive ? 'var(--tv-green)' : 'var(--tv-red)' }}
                    >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </div>
                </div>
            )}
        </button>
    )
}

export default SymbolSearch
