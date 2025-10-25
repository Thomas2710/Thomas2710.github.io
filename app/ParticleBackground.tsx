"use client";

import { useRef, useEffect } from "react";
import { categories } from "@/lib/sections";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface CategoryParticle extends Particle {
  image: HTMLImageElement;
  link: string;
  borderColor: string;
  name: string;
  scale: number; // for hover animation
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const HEADER_HEIGHT = 0; // set >0 if you have a header
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const MIN_VEL = 0.6; // minimum diagonal velocity
    const MAX_VEL = 2; // maximum velocity

    // Utility to generate random diagonal velocity
    const randomVelocity = () => {
      const signX = Math.random() < 0.5 ? -1 : 1;
      const signY = Math.random() < 0.5 ? -1 : 1;
      const vx = signX * (Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL);
      const vy = signY * (Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL);
      return { vx, vy };
    };

    // Small background particles
    const smallParticles: Particle[] = [];
    const PARTICLE_COUNT = 80;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const { vx, vy } = randomVelocity();
      smallParticles.push({
        x: Math.random() * width,
        y: Math.random() * (height - HEADER_HEIGHT) + HEADER_HEIGHT,
        vx,
        vy,
        size: Math.random() * 2 + 1,
      });
    }

    // Category particles
    const categoryParticles: CategoryParticle[] = [];
    const borderColors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D"];
    categories.forEach((cat, idx) => {
      const img = new Image();
      img.src = `/images/${cat.image}`;
      const { vx, vy } = randomVelocity();
      categoryParticles.push({
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - HEADER_HEIGHT - 200) + HEADER_HEIGHT + 100,
        vx,
        vy,
        size: 100,
        image: img,
        link: `/${cat.path}`,
        borderColor: borderColors[idx % borderColors.length],
        name: cat.name,
        scale: 1,
      });
    });

    // Mouse tracking
    const mousePos = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      categoryParticles.forEach((p) => {
        if (Math.hypot(x - p.x, y - p.y) < p.size) {
          window.location.href = p.link;
        }
      });
    };
    window.addEventListener("click", handleClick);

    // Collision between category particles
    const resolveCollision = (p1: CategoryParticle, p2: CategoryParticle) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);
      if (dist < p1.size + p2.size) {
        const angle = Math.atan2(dy, dx);
        const overlap = p1.size + p2.size - dist;

        p1.x -= (overlap / 2) * Math.cos(angle);
        p1.y -= (overlap / 2) * Math.sin(angle);
        p2.x += (overlap / 2) * Math.cos(angle);
        p2.y += (overlap / 2) * Math.sin(angle);

        // swap velocities
        const vxTemp = p1.vx;
        const vyTemp = p1.vy;
        p1.vx = p2.vx;
        p1.vy = p2.vy;
        p2.vx = vxTemp;
        p2.vy = vyTemp;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Small particles
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      smallParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < HEADER_HEIGHT || p.y + p.size > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Category particles
      categoryParticles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off canvas edges (top respects header)
        if (p.x - p.size < 0 || p.x + p.size > width) p.vx *= -1;
        if (p.y - p.size < HEADER_HEIGHT || p.y + p.size > height) p.vy *= -1;

        // Collisions
        for (let j = i + 1; j < categoryParticles.length; j++) {
          resolveCollision(p, categoryParticles[j]);
        }

        // Hover detection
        const dist = Math.hypot(mousePos.x - p.x, mousePos.y - p.y);
        p.scale = dist < p.size + 20 ? 1.1 : 1;
        const drawSize = p.size * p.scale;

        // Draw border
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = "#00000000";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = p.borderColor;
        ctx.stroke();

        // Draw image
        if (p.image.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize - 4, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(p.image, p.x - drawSize, p.y - drawSize, drawSize * 2, drawSize * 2);
          ctx.restore();
        }

        // Show name on hover
        if (dist < drawSize) {
          ctx.fillStyle = "white";
          ctx.font = "bold 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(p.name, p.x, p.y - drawSize - 12);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
