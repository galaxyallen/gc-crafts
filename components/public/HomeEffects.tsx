"use client";

import { useEffect } from "react";

export function HomeEffects() {
  useEffect(() => {
    const canvas = document.getElementById("am") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const mouse = { x: -999, y: -999 };

    class Particle {
      x = 0;
      y = 0;
      s = 0;
      vx = 0;
      vy = 0;
      o = 0;
      p = 0;
      ps = 0;

      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.s = Math.random() * 1.2 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.07;
        this.vy = (Math.random() - 0.5) * 0.05;
        this.o = Math.random() * 0.06 + 0.01;
        this.p = Math.random() * 6.28;
        this.ps = Math.random() * 0.003 + 0.001;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180 && d > 0) {
          this.vx += (dx / d) * 0.01;
          this.vy += (dy / d) * 0.01;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.p += this.ps;
        this.vx *= 0.998;
        this.vy *= 0.998;
        if (this.x < -20 || this.x > w + 20 || this.y < -20 || this.y > h + 20) this.reset();
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.s, 0, 6.28);
        ctx!.fillStyle = `rgba(196,162,101,${this.o * (0.5 + 0.5 * Math.sin(this.p))})`;
        ctx!.fill();
      }
    }

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    document.addEventListener("mousemove", onMouse);

    const particles = Array.from({ length: 40 }, () => {
      const p = new Particle();
      p.reset();
      return p;
    });

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(196,162,101,${0.014 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const glow = document.getElementById("cg");
    if (glow && window.matchMedia("(pointer:fine)").matches) {
      let mx = 0;
      let my = 0;
      let cx = 0;
      let cy = 0;
      document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
      });
      const glowLoop = () => {
        cx += (mx - cx) * 0.04;
        cy += (my - cy) * 0.04;
        glow.style.left = `${cx}px`;
        glow.style.top = `${cy}px`;
        requestAnimationFrame(glowLoop);
      };
      glowLoop();
    } else if (glow) {
      glow.style.display = "none";
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <>
      <canvas id="am" aria-hidden="true" />
      <div className="cglow" id="cg" aria-hidden="true" />
    </>
  );
}
