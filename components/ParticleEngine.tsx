import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ParticleTheme } from '../types';

interface ParticleEngineProps {
  theme: ParticleTheme;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  shape: 'circle' | 'square' | 'heart' | 'star';
  angle: number;
  spin: number;

  constructor(width: number, height: number, theme: ParticleTheme) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.1;
    
    this.applyTheme(theme);
    this.size = this.baseSize;
  }

  applyTheme(theme: ParticleTheme) {
    switch (theme) {
      case ParticleTheme.FIRE:
        this.color = `hsl(${Math.random() * 40 + 10}, 100%, 60%)`;
        this.baseSize = Math.random() * 4 + 2;
        this.shape = 'square';
        this.vx *= 2;
        this.vy *= 2;
        break;
      case ParticleTheme.GALAXY:
        this.color = `hsl(${Math.random() * 60 + 240}, 80%, 70%)`;
        this.baseSize = Math.random() * 3 + 1;
        this.shape = 'star';
        break;
      case ParticleTheme.NATURE:
        this.color = `hsl(${Math.random() * 60 + 90}, 70%, 50%)`;
        this.baseSize = Math.random() * 5 + 2;
        this.shape = 'circle';
        break;
      case ParticleTheme.LOVE:
        this.color = `hsl(${Math.random() * 40 + 320}, 90%, 60%)`;
        this.baseSize = Math.random() * 6 + 2;
        this.shape = 'heart';
        break;
      default:
        this.color = `hsl(${Math.random() * 60 + 180}, 70%, 50%)`;
        this.baseSize = Math.random() * 3 + 1;
        this.shape = 'circle';
    }
  }

  update(width: number, height: number, mouseX: number, mouseY: number, isPressed: boolean) {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;

    // Bounce off walls
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Interactive Physics
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Mouse Interaction Radius
    const radius = 200;
    
    if (distance < radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (radius - distance) / radius;
      
      // If pressed, attract strongly. If not, repel gently.
      const direction = isPressed ? 1 : -1;
      const strength = isPressed ? 2.5 : 2;

      this.vx += forceDirectionX * force * direction * strength;
      this.vy += forceDirectionY * force * direction * strength;
      
      // Grow when close
      this.size = this.baseSize * (1 + force * 2);
    } else {
        if (this.size > this.baseSize) {
            this.size -= 0.1;
        }
    }

    // Friction
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.beginPath();

    if (this.shape === 'square') {
      ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
    } else if (this.shape === 'heart') {
       // Heart drawing logic
       const s = this.size;
       ctx.moveTo(0, 0);
       ctx.bezierCurveTo(-s, -s, -s*2, s/2, 0, s*2);
       ctx.bezierCurveTo(s*2, s/2, s, -s, 0, 0);
       ctx.fill();
    } else if (this.shape === 'star') {
        const spikes = 5;
        const outerRadius = this.size * 1.5;
        const innerRadius = this.size * 0.7;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;

        ctx.moveTo(0, 0 - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.fill();
    } else {
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

export const ParticleEngine: React.FC<ParticleEngineProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false });
  
  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const count = window.innerWidth < 768 ? 400 : 1200; // Optimize for mobile
    
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(width, height, theme));
    }
    particlesRef.current = particles;
  }, [theme]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-init on significant resize, or just let them bound check back in
        // Ideally we just keep them, but for theme changes we re-init
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    initParticles(window.innerWidth, window.innerHeight);

    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        p.update(
            canvas.width, 
            canvas.height, 
            mouseRef.current.x, 
            mouseRef.current.y,
            mouseRef.current.isPressed
        );
        p.draw(ctx);
      });

      // Connect particles if close
      ctx.lineWidth = 0.5;
      const connectionDist = 100;
      
      // Optimization: Only connect a subset or use a spatial grid. 
      // For this demo, we'll just connect to mouse vicinity to save CPU on mobile.
      particlesRef.current.forEach(p => {
         const dx = mouseRef.current.x - p.x;
         const dy = mouseRef.current.y - p.y;
         const dist = Math.sqrt(dx*dx + dy*dy);
         if (dist < 150) {
             ctx.strokeStyle = p.color;
             ctx.beginPath();
             ctx.moveTo(p.x, p.y);
             ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
             ctx.stroke();
         }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []); // Run loop once, internal refs handle state updates

  // Handle Touch/Mouse Events
  const handlePointerMove = (e: React.PointerEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };
  
  const handlePointerDown = () => {
    mouseRef.current.isPressed = true;
  };
  
  const handlePointerUp = () => {
    mouseRef.current.isPressed = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black touch-none cursor-crosshair"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
};
