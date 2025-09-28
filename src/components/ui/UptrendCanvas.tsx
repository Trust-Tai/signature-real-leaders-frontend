import React, { useEffect, useRef, useState } from "react";


export default function UptrendCanvas(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const [paused, setPaused] = useState(false);
  const stateRef = useRef<{ time: number; hover: { x: number; y: number } | null }>({ time: 0, hover: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize(): void {
      if (!canvas || !wrapper || !ctx) return;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = wrapper.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing ops to CSS pixels
    }

    function drawGrid(w: number, h: number): void {
      if (!ctx) return;
      const step = Math.max(24, Math.min(w, h) / 18);
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = step / 2; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = step / 2; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawArrowHead(x: number, y: number, angle: number, size = 16): void {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-size, -size * 0.6);
      ctx.lineTo(-size * 0.3, 0);
      ctx.lineTo(-size, size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function draw(): void {
      if (!canvas || !ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      
      // because we scaled with DPR in setTransform, w/h are in CSS px units
      ctx.clearRect(0, 0, w, h);

      // Background — solid black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      drawGrid(w, h);

      // Title text with proper margins
      ctx.save();
      ctx.textBaseline = "top";
      const titleSize = Math.max(20, Math.min(w, h) * 0.06);
      ctx.font = `bold ${titleSize}px ui-sans-serif, system-ui, -apple-system`;
      ctx.shadowColor = "rgba(225,6,0,0.55)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      const titleMargin = Math.max(20, w * 0.03);
      ctx.fillText("Grow Your Audience", titleMargin, titleMargin);
      ctx.restore();

      // time value for all animations (single declaration)
      const t = stateRef.current.time;

      // Wavy lines (3 series) - centered and properly spaced
      const centerY = h * 0.5;
      const series = [
        { amp: h * 0.08, freq: 2.2, speed: 0.5, offset: centerY - h * 0.05 },
        { amp: h * 0.1, freq: 1.6, speed: 0.35, offset: centerY },
        { amp: h * 0.07, freq: 3.2, speed: 0.7, offset: centerY + h * 0.08 },
      ];

      const nodes: Array<{ x: number; y: number; v: number }> = [];
      series.forEach((s, si) => {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = si === 1 ? "rgba(255,255,255,0.65)" : "rgba(200,210,255,0.35)";
        ctx.beginPath();
        const steps = Math.max(120, Math.floor(w * 0.9));
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * w;
          const y = s.offset + Math.sin((i / steps) * Math.PI * s.freq + t * s.speed) * s.amp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // draw a few nodes along the mid series for interactivity
        if (si === 1) {
          const pts = 10;
          for (let i = 0; i <= pts; i++) {
            const x = (i / pts) * w;
            const y = s.offset + Math.sin((i / pts) * Math.PI * s.freq + t * s.speed) * s.amp;
            nodes.push({ x, y, v: (Math.random() * 0.5 + 0.5) * 100 });
          }
        }
      });

      // Upward growth ARROW — zig‑zag *filled* arrow (red) - centered
      const m = Math.min(w, h);
      const marginZZ = Math.max(m * 0.1, 30); // Increased margin for better centering
      const baseY = h - marginZZ;
      const topY = Math.max(marginZZ + 40, m * 0.2); // Ensure top has enough space
      const spanX = w - marginZZ * 2;
      const rise = baseY - topY;
      const zzCount = 6; // number of corners
      const dip = (rise / zzCount) * 0.35; // depth of each inward dip

      // build zigzag points across the canvas
      const corePts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i <= zzCount; i++) {
        const x = marginZZ + (spanX / zzCount) * i;
        let y = baseY - (rise / zzCount) * i;
        if (i > 0 && i < zzCount && i % 2 === 1) y += dip; // dip down on odd indices
        corePts.push({ x, y });
      }

      // animate draw length along points
      const prog = 0.55 + 0.4 * (0.5 + Math.sin(t * 0.9) / 2); // 55%-95%
      const lastIdx = Math.min(corePts.length - 1, Math.max(1, Math.floor((corePts.length - 1) * prog)));
      const subProg = (corePts.length - 1) * prog - Math.floor((corePts.length - 1) * prog);
      const visPts = corePts.slice(0, lastIdx + 1);
      if (lastIdx < corePts.length - 1) {
        const a = corePts[lastIdx];
        const b = corePts[lastIdx + 1];
        visPts[visPts.length - 1] = {
          x: a.x + (b.x - a.x) * subProg,
          y: a.y + (b.y - a.y) * subProg,
        };
      }

      // helper: unit vector
      const unit = (dx: number, dy: number) => {
        const L = Math.hypot(dx, dy) || 1;
        return { x: dx / L, y: dy / L };
      };
      // helper: left normal of a unit vector
      const leftN = (ux: number, uy: number) => ({ x: -uy, y: ux });

      // compute offset normals per vertex (miter join)
      const half = Math.max(10, m * 0.025);
      const Lnorms: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < visPts.length; i++) {
        const p = visPts[i];
        const n = { x: 0, y: 0 };
        if (i > 0) {
          const a = visPts[i - 1];
          const u = unit(p.x - a.x, p.y - a.y);
          const ln = leftN(u.x, u.y);
          n.x += ln.x; n.y += ln.y;
        }
        if (i < visPts.length - 1) {
          const b = visPts[i + 1];
          const u = unit(b.x - p.x, b.y - p.y);
          const ln = leftN(u.x, u.y);
          n.x += ln.x; n.y += ln.y;
        }
        const nl = Math.hypot(n.x, n.y) || 1;
        Lnorms.push({ x: n.x / nl, y: n.y / nl });
      }

      // Create body polygon up to the base of the arrow head
      const head = visPts[visPts.length - 1];
      // base of head
      const dir = unit(head.x - visPts[visPts.length - 2].x, head.y - visPts[visPts.length - 2].y);
      const headLen = Math.max(22, m * 0.04);
      const headWidth = Math.max(26, m * 0.055);
      const base = { x: head.x - dir.x * headLen, y: head.y - dir.y * headLen };

      // replace the tip point with base point for the shaft polygon
      const shaftPts = visPts.slice(0, -1).concat(base);
      const shaftNorms = Lnorms.slice(0, -1).concat(Lnorms[Lnorms.length - 2]);

      const leftPts: Array<{ x: number; y: number }> = [];
      const rightPts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < shaftPts.length; i++) {
        const p = shaftPts[i];
        const n = shaftNorms[i];
        leftPts.push({ x: p.x + n.x * half, y: p.y + n.y * half });
        rightPts.push({ x: p.x - n.x * half, y: p.y - n.y * half });
      }

      // draw filled body
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.moveTo(leftPts[0].x, leftPts[0].y);
      for (let i = 1; i < leftPts.length; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
      for (let i = rightPts.length - 1; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
      ctx.closePath();
      ctx.fillStyle = "#e10600";
      ctx.fill();
      // subtle highlight
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ff6b6b";
      ctx.stroke();

      // draw arrow head (triangle)
      ctx.beginPath();
      const ln = leftN(dir.x, dir.y);
      ctx.moveTo(head.x, head.y);
      ctx.lineTo(base.x + ln.x * (headWidth / 2), base.y + ln.y * (headWidth / 2));
      ctx.lineTo(base.x - ln.x * (headWidth / 2), base.y - ln.y * (headWidth / 2));
      ctx.closePath();
      ctx.fillStyle = "#e10600";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ff6b6b";
      ctx.stroke();
      ctx.restore();

      // Floating mini arrows - positioned within safe bounds
      const arrowCount = 3;
      const safeMargin = Math.max(20, w * 0.05);
      for (let i = 0; i < arrowCount; i++) {
        const phase = t * 0.8 + i * 1.7;
        const ax = safeMargin + (w - safeMargin * 2) * (0.2 + 0.3 * i) + Math.sin(phase) * 15;
        const ay = safeMargin + (h - safeMargin * 2) * (0.2 + 0.15 * i) - Math.cos(phase) * 12;
        ctx.save();
        ctx.globalAlpha = 0.4 + 0.3 * Math.sin(phase * 1.2);
        ctx.fillStyle = "#e10600";
        drawArrowHead(ax, ay, -Math.PI / 6, 12 + i * 2);
        ctx.restore();
      }

      // Nodes + hover tooltip
      const hover = stateRef.current.hover;
      let nearest: { x: number; y: number; v: number } | null = null;
      let nearestD = Infinity;
      
      nodes.forEach((n) => {
        // pulse
        const r = 3 + 1.6 * (0.5 + Math.sin(t * 1.6 + n.x * 0.02) / 2);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (hover) {
          const dx = n.x - hover.x;
          const dy = n.y - hover.y;
          const d = Math.hypot(dx, dy);
          if (d < nearestD) {
            nearestD = d;
            nearest = { x: n.x, y: n.y, v: n.v };
          }
        }
      });

      if (hover && nearest !== null && nearestD < 24) {
        const pad = 8;
        const nearestNode = nearest as { x: number; y: number; v: number };
        const tx = Math.round(nearestNode.x + 12);
        const ty = Math.round(nearestNode.y - 24);
        const text = `${Math.round(nearestNode.v)}%`;
        ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
        const tw = ctx.measureText(text).width;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(tx + 2, ty + 2, tw + pad * 2, 22);
        const grad = ctx.createLinearGradient(0, ty, 0, ty + 22);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#f0f0ff");
        ctx.fillStyle = grad;
        ctx.fillRect(tx, ty, tw + pad * 2, 22);
        ctx.fillStyle = "#1f2a56";
        ctx.fillText(text, tx + pad, ty + 15);
      }
    }

    function loop(ts?: number): void {
      if (!paused) stateRef.current.time = (ts || 0) / 1000;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onMove = (e: MouseEvent): void => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      stateRef.current.hover = { x, y };
    };

    const onLeave = (): void => {
      stateRef.current.hover = null;
    };

    const onClick = (): void => {
      setPaused((p) => !p);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    resize();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [paused]);

  return (
    <div
      className="w-full h-[360px] md:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden shadow-xl relative"
      ref={wrapperRef}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}