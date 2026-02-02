'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
}

export const BackgroundEffects = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const initParticles = () => {
            const particleCount = Math.min(60, Math.floor((width * height) / 25000));
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.3 + 0.1,
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particlesRef.current.forEach((particle, i) => {
                // Mouse repulsion (subtle)
                const dx = particle.x - mouseRef.current.x;
                const dy = particle.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    particle.vx += (dx / dist) * force * 0.02;
                    particle.vy += (dy / dist) * force * 0.02;
                }

                particle.vx *= 0.99;
                particle.vy *= 0.99;
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0) particle.x = width;
                if (particle.x > width) particle.x = 0;
                if (particle.y < 0) particle.y = height;
                if (particle.y > height) particle.y = 0;

                // Draw particle (subtle cyan dots)
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
                ctx.fill();

                // Draw connections (very subtle)
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const other = particlesRef.current[j];
                    const pdx = particle.x - other.x;
                    const pdy = particle.y - other.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

                    if (pdist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.05 * (1 - pdist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            {/* Solid void black background */}
            <div className="fixed inset-0 -z-30 bg-[#0a0a0f]" />

            {/* Subtle vignette effect */}
            <div
                className="fixed inset-0 -z-25 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0f 80%)',
                }}
            />

            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 -z-20 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Horizontal scanlines (very subtle) */}
            <div
                className="fixed inset-0 -z-15 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                }}
            />

            {/* Data grid pattern (subtle) */}
            <div
                className="fixed inset-0 -z-18 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Particle network canvas (minimal) */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{ opacity: 0.4 }}
            />
        </>
    );
};
