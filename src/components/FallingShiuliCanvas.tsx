import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationAmp: number;
  phase: number;
  opacity: number;
}

interface SmokePuff {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  life: number;
  maxLife: number;
  turbulence: number;
}

interface SparkEmber {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const FallingShiuliCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Slow, serene falling Shiuli petals
    const petalCount = Math.min(26, Math.floor(width / 42));
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 6 + Math.random() * 7,
        speedY: 0.22 + Math.random() * 0.32, // Slower, graceful floating motion
        speedX: -0.15 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        oscillationSpeed: 0.01 + Math.random() * 0.015,
        oscillationAmp: 0.8 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.5 + Math.random() * 0.4,
      });
    }

    // 2. Dhunuchi Smoke Plumes rising from the bottom
    const smokePuffs: SmokePuff[] = [];
    const maxSmokePuffs = Math.min(30, Math.floor(width / 35));

    const createSmokePuff = (initY?: number): SmokePuff => {
      const spreadX = (Math.random() - 0.5) * (width * 0.9) + width * 0.5;
      const maxLife = 180 + Math.random() * 140;
      return {
        x: spreadX,
        y: initY !== undefined ? initY : height + 10 + Math.random() * 20,
        radius: 20 + Math.random() * 25,
        maxRadius: 75 + Math.random() * 70,
        speedY: -0.35 - Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: 0.12 + Math.random() * 0.1,
        life: 0,
        maxLife,
        turbulence: Math.random() * Math.PI * 2,
      };
    };

    // Pre-populate smoke plumes across vertical span of bottom 35% of screen
    for (let i = 0; i < maxSmokePuffs; i++) {
      const randomY = height - Math.random() * (height * 0.35);
      const puff = createSmokePuff(randomY);
      puff.life = Math.random() * puff.maxLife;
      smokePuffs.push(puff);
    }

    // 3. Glowing micro-embers drifting with dhunuchi smoke
    const sparks: SparkEmber[] = [];
    const maxSparks = 18;

    const createSpark = (): SparkEmber => {
      const maxLife = 80 + Math.random() * 90;
      return {
        x: (Math.random() - 0.5) * (width * 0.85) + width * 0.5,
        y: height - 5 - Math.random() * 40,
        size: 1 + Math.random() * 2,
        speedY: -0.6 - Math.random() * 0.8,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: 0.7 + Math.random() * 0.3,
        life: 0,
        maxLife,
      };
    };

    for (let i = 0; i < maxSparks; i++) {
      sparks.push(createSpark());
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // ─── A. RENDER DHUNUCHI SMOKE (BOTTOM HAZE) ───
      for (let i = 0; i < smokePuffs.length; i++) {
        const s = smokePuffs[i];
        s.life++;
        s.y += s.speedY;
        s.turbulence += 0.015;
        s.x += Math.sin(s.turbulence) * 0.5 + s.speedX;

        // Progress factor (0 to 1)
        const progress = s.life / s.maxLife;
        // Expand radius as smoke ascends
        const currentRadius = s.radius + (s.maxRadius - s.radius) * progress;
        // Fade in quickly, then linger and fade out
        let alpha = s.opacity;
        if (progress < 0.2) {
          alpha = s.opacity * (progress / 0.2);
        } else {
          alpha = s.opacity * (1 - (progress - 0.2) / 0.8);
        }

        if (alpha > 0.005) {
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, currentRadius);
          // Warm incense smoke color (cream-white with subtle amber warm glow near base)
          const baseColor = s.y > height - 120 ? 'rgba(255, 220, 180,' : 'rgba(235, 230, 225,';
          grad.addColorStop(0, `${baseColor} ${alpha * 0.85})`);
          grad.addColorStop(0.45, `${baseColor} ${alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(220, 215, 210, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Recycle smoke puff when expired or high enough
        if (s.life >= s.maxLife || s.y < height * 0.45) {
          smokePuffs[i] = createSmokePuff();
        }
      }

      // ─── B. RENDER GLOWING DHUNUCHI EMBERS ───
      for (let i = 0; i < sparks.length; i++) {
        const sp = sparks[i];
        sp.life++;
        sp.y += sp.speedY;
        sp.x += sp.speedX + Math.sin(time * 2 + sp.life * 0.05) * 0.3;

        const p = sp.life / sp.maxLife;
        const currentOpacity = sp.opacity * (1 - p);

        if (currentOpacity > 0.01) {
          ctx.save();
          ctx.fillStyle = `rgba(255, 170, 50, ${currentOpacity})`;
          ctx.shadowColor = '#ff8800';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (sp.life >= sp.maxLife || sp.y < height * 0.55) {
          sparks[i] = createSpark();
        }
      }

      // ─── C. RENDER SLOW FLOATING SHIULI PETALS ───
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.phase += p.oscillationSpeed;
        p.x += Math.sin(p.phase) * p.oscillationAmp + p.speedX;
        p.rotation += p.rotationSpeed;

        // Wrap around viewport edges
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        // Draw Shiuli Flower (Nyctanthes arbor-tristis): 5 white petals + saffron-orange center tube
        const petalRadius = p.size;
        const stemLength = p.size * 0.65;

        // 1. Central saffron-orange tube / stem
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b1a'; // Signature Bengal Shiuli orange
        ctx.shadowColor = 'rgba(255, 107, 26, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tiny orange stem projecting downwards
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, stemLength);
        ctx.strokeStyle = '#e65100';
        ctx.lineWidth = p.size * 0.22;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 2. 5 Star/Pinwheel radiating white petals with soft porcelain texture
        const numPetals = 5;
        for (let j = 0; j < numPetals; j++) {
          const angle = (j * (Math.PI * 2)) / numPetals;
          ctx.save();
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(petalRadius * 0.45, -petalRadius * 0.22, petalRadius, 0);
          ctx.quadraticCurveTo(petalRadius * 0.45, petalRadius * 0.22, 0, 0);
          ctx.fillStyle = 'rgba(255, 253, 248, 0.94)';
          ctx.fill();

          // Subtle orange-coral blush at base of petal
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(petalRadius * 0.2, -petalRadius * 0.08, petalRadius * 0.35, 0);
          ctx.quadraticCurveTo(petalRadius * 0.2, petalRadius * 0.08, 0, 0);
          ctx.fillStyle = 'rgba(255, 120, 40, 0.45)';
          ctx.fill();

          ctx.restore();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-15"
      style={{ willChange: 'transform' }}
    />
  );
};
