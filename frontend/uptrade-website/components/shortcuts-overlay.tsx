'use client'

import React, { useEffect, useState } from 'react'

export function ShortcutsOverlay() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle on '?' (Shift + /)
            if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                setIsOpen(prev => !prev)
            }
            // Close on Esc
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    if (!isOpen) return null

    const shortcuts = [
        { key: '1-4', desc: 'Focus Chart 1-4' },
        { key: 'F', desc: 'Fullscreen Chart' },
        { key: '/', desc: 'Quick Search' },
        { key: 'C', desc: 'Toggle Crosshair' },
        { key: 'S', desc: 'Screenshot' },
        { key: 'Esc', desc: 'Close Overlays' },
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e222d] border border-[#363a45] rounded-xl shadow-2xl w-[500px] overflow-hidden">
                <div className="p-4 border-b border-[#2a2e39] flex justify-between items-center bg-[#131722]">
                    <h2 className="text-white font-bold text-lg">Keyboard Shortcuts</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-[#868993] hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                    {shortcuts.map((item) => (
                        <div key={item.key} className="flex items-center justify-between group">
                            <span className="text-[#868993] group-hover:text-white transition-colors">{item.desc}</span>
                            <kbd className="bg-[#2a2e39] text-[#d1d4dc] px-2 py-1 rounded text-xs font-mono min-w-[24px] text-center border border-[#363a45]">
                                {item.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-[#131722] border-t border-[#2a2e39] text-center">
                    <p className="text-[#5d606b] text-xs">
                        Pro Tip: You can also drag charts to reorder them (coming soon)
                    </p>
                </div>
            </div>
        </div>
    )
}
