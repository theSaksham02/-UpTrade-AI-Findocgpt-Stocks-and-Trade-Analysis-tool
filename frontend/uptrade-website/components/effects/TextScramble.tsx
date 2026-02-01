'use client'

import { useEffect, useRef, useState, useCallback } from 'react';

interface TextScrambleProps {
    text: string;
    className?: string;
    speed?: number;           // ms per frame
    scrambleChars?: string;   // Characters to use during scramble
    trigger?: 'hover' | 'mount' | 'inView';
    once?: boolean;           // Only animate once
}

export const TextScramble: React.FC<TextScrambleProps> = ({
    text,
    className = '',
    speed = 50,
    scrambleChars = '!<>-_\\/[]{}—=+*^?#________',
    trigger = 'mount',
    once = true,
}) => {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const frameRef = useRef<number>();
    const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number }>>([]);
    const frameCounter = useRef(0);

    const elementRef = useRef<HTMLSpanElement>(null);

    const scramble = useCallback(() => {
        let output = '';
        let complete = 0;

        for (let i = 0; i < queueRef.current.length; i++) {
            const { from, to, start, end } = queueRef.current[i];
            let char = from;

            if (frameCounter.current >= end) {
                complete++;
                char = to;
            } else if (frameCounter.current >= start) {
                if (!char || Math.random() < 0.28) {
                    char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                }
            }

            output += char;
        }

        setDisplayText(output);

        if (complete === queueRef.current.length) {
            setIsScrambling(false);
            return;
        }

        frameCounter.current++;
        frameRef.current = requestAnimationFrame(scramble);
    }, [scrambleChars]);

    const startScramble = useCallback(() => {
        if (isScrambling && once) return;

        setIsScrambling(true);
        frameCounter.current = 0;

        // Build queue of character transitions
        queueRef.current = [];
        const length = Math.max(text.length, displayText.length);

        for (let i = 0; i < length; i++) {
            const from = displayText[i] || '';
            const to = text[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            queueRef.current.push({ from, to, start, end });
        }

        cancelAnimationFrame(frameRef.current!);
        frameRef.current = requestAnimationFrame(scramble);

        return () => cancelAnimationFrame(frameRef.current!);
    }, [text, displayText, isScrambling, once, scramble]);

    useEffect(() => {
        if (trigger === 'mount') {
            startScramble();
        }
    }, [trigger, startScramble]);

    // Intersection Observer for 'inView' trigger
    useEffect(() => {
        if (trigger !== 'inView' || !elementRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startScramble();
                    if (once) observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [trigger, once, startScramble]);

    return (
        <span
            ref={elementRef}
            className={`font-mono ${isScrambling ? 'text-[#2962FF]' : ''} ${className}`}
            onMouseEnter={trigger === 'hover' ? startScramble : undefined}
            style={{
                whiteSpace: 'pre-wrap',
                display: 'inline-block',
            }}
        >
            {displayText}
        </span>
    );
};

// Advanced version with decode effect
export const TextDecode: React.FC<TextScrambleProps> = ({
    text,
    className = '',
    speed = 30,
}) => {
    const [revealed, setRevealed] = useState(0);
    const [scrambleText, setScrambleText] = useState('');

    useEffect(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
        let iteration = 0;
        const maxIterations = text.length * 3;

        const interval = setInterval(() => {
            setScrambleText(
                text
                    .split('')
                    .map((char, index) => {
                        if (index < revealed) return text[index];
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            iteration++;
            if (iteration % 3 === 0 && revealed < text.length) {
                setRevealed(r => r + 1);
            }

            if (revealed >= text.length) {
                clearInterval(interval);
                setScrambleText(text);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, revealed, speed]);

    return <span className={`font-mono tracking-tight ${className}`}>{scrambleText}</span>;
};
