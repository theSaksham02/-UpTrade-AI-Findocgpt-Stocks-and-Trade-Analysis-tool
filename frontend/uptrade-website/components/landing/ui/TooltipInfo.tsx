'use client';

import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipInfoProps {
    content: string;
    children?: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipInfo = ({ content, children, position = 'top' }: TooltipInfoProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLSpanElement>(null);

    const positionStyles = {
        top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
        bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
        left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
        right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
    };

    const arrowStyles = {
        top: { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
        bottom: { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
        left: { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
        right: { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    };

    return (
        <span
            ref={triggerRef}
            className="relative inline-flex items-center cursor-help"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children || <HelpCircle className="w-4 h-4 text-[#868993] hover:text-[#00d4ff] transition-colors" />}

            {isVisible && (
                <div
                    className="absolute z-50 w-64 p-3 text-sm text-white bg-[#1e222d]/95 backdrop-blur-md border border-[#2a2e39] rounded-lg shadow-xl transition-opacity duration-200"
                    style={positionStyles[position]}
                >
                    {/* Glass arrow */}
                    <div
                        className="absolute w-2 h-2 bg-[#1e222d] border-r border-b border-[#2a2e39]"
                        style={arrowStyles[position]}
                    />
                    <p className="relative z-10 leading-relaxed">{content}</p>
                </div>
            )}
        </span>
    );
};
