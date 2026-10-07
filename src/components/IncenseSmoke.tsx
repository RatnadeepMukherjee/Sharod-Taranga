import React, { useEffect, useRef } from 'react';

interface IncenseSmokeProps {
  intensity?: number;
  className?: string;
}

export const IncenseSmoke: React.FC<IncenseSmokeProps> = ({ intensity = 1, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      curl: number;
    }

    const particles: Particle[] = [];
    const sourcePoints = [
      { xRatio: 0.15, yRatio: 0.88 }, // Left incense
      { xRatio: 0.85, yRatio: 0.88 }, // Right dhunuchi smoke
    ];

    const createParticle = () => {
      const source = sourcePoints[Math.floor(Math.random() * sourcePoints.length)];
      const maxLife = 180 + Math.random() * 140;
      particles.push({
        x: source.xRatio * width + (Math.random() - 0.5) * 40,
        y: source.yRatio * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.6 - Math.random() * 0.9,
        size: 16 + Math.random() * 24,
        alpha: 0.01,
        life: 0,
        maxLife,
        curl: (Math.random() - 0.5) * 0.04,
      });
    };

    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Spawn particles
      if (frameCount % Math.max(2, Math.floor(4 / intensity)) === 0 && particles.length < 120 * intensity) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Physics
        p.vx += p.curl;
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.4;
        p.y += p.vy;
        p.size += 0.35;

        // Fade envelope
        const lifeFraction = p.life / p.maxLife;
        if (lifeFraction < 0.2) {
          p.alpha = (lifeFraction / 0.2) * 0.14 * intensity;
        } else {
          p.alpha = (1 - (lifeFraction - 0.2) / 0.8) * 0.14 * intensity;
        }

        if (p.life >= p.maxLife || p.y < -50) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft smokey radial gradient
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(245, 235, 215, ${p.alpha})`);
        grad.addColorStop(0.4, `rgba(225, 210, 190, ${p.alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(210, 195, 175, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
