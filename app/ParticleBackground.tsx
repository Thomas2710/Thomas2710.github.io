"use client";

import { useRef, useEffect } from "react";
import { categories } from "@/lib/sections";


  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        // Try themed quotes (environment / climate / nature)
        const res = await fetch("https://quoteslate.vercel.app/api/quotes/random?tags=happiness,mindfullness,knowledge");
        const data = await res.json();
        console.log("Fetched quote:", data);

        if (data?.quote && data?.author) {
          setQuote({ content: data.quote, author: data.author });
        } else {
          // fallback to general random quote if none found for that tag
          const fallbackRes = await fetch("https://quoteslate.vercel.app/api/quotes/random");
          const fallbackData = await fallbackRes.json();
          setQuote({ content: fallbackData.quote, author: fallbackData.author });
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        // fallback to a static message
        setQuote({
          content: "The Earth is what we all have in common.",
          author: "Wendell Berry",
        });
      }
    }
    fetchQuote();
  }, []);


<section className="relative z-10 h-screen flex flex-col items-center justify-center text-white text-center px-4">
  {quote ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl"
    >
      <p className="text-2xl md:text-3xl font-light mb-4">&ldquo;{quote.content}&rdquo;</p>
      <p className="text-lg md:text-xl text-gray-300">— {quote.author}</p>
    </motion.div>
  ) : (
    <p className="text-gray-400 text-lg">Loading inspiration...</p>
  )}
</section>

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
  scale: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const HEADER_HEIGHT = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ✅ Detect if device is mobile
    const isMobile = window.innerWidth < 768;

    // ✅ Adjust speeds and sizes based on device type
    const MIN_VEL = isMobile ? 0.2 : 0.6;
    const MAX_VEL = isMobile ? 0.8 : 2;
    const SMALL_PARTICLE_COUNT = isMobile ? 40 : 80;

    const randomVelocity = () => {
      const signX = Math.random() < 0.5 ? -1 : 1;
      const signY = Math.random() < 0.5 ? -1 : 1;
      const vx = signX * (Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL);
      const vy = signY * (Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL);
      return { vx, vy };
    };

    // Small background particles
    const smallParticles: Particle[] = [];
    for (let i = 0; i < SMALL_PARTICLE_COUNT; i++) {
      const { vx, vy } = randomVelocity();
      smallParticles.push({
        x: Math.random() * width,
        y: Math.random() * (height - HEADER_HEIGHT) + HEADER_HEIGHT,
        vx,
        vy,
        size: (Math.random() * 2 + 1) * (isMobile ? 0.7 : 1),
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
        // ✅ Smaller category particles on mobile
        size: isMobile ? 60 : 100,
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

      // Background particles
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

        if (p.x - p.size < 0 || p.x + p.size > width) p.vx *= -1;
        if (p.y - p.size < HEADER_HEIGHT || p.y + p.size > height) p.vy *= -1;

        for (let j = i + 1; j < categoryParticles.length; j++) {
          resolveCollision(p, categoryParticles[j]);
        }

        const dist = Math.hypot(mousePos.x - p.x, mousePos.y - p.y);
        p.scale = dist < p.size + 20 ? 1.1 : 1;
        const drawSize = p.size * p.scale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = p.borderColor;
        ctx.stroke();

        if (p.image.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize - 4, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            p.image,
            p.x - drawSize,
            p.y - drawSize,
            drawSize * 2,
            drawSize * 2
          );
          ctx.restore();
        }

        // ✅ Always show text (not just on hover)
        ctx.fillStyle = "white";
        ctx.font = isMobile ? "bold 14px sans-serif" : "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.name, p.x, p.y - drawSize - 12);
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
