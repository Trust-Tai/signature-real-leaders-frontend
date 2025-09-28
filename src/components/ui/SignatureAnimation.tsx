import React, { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface State {
  t: number;
  duration: number;
  pause: number;
  points: Point[];
  totalLen: number;
  dotAt: number;
}

export default function SignatureAnimation(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const stateRef = useRef<State>({
    t: 0,
    duration: 3.6,
    pause: 0.6,
    points: [],
    totalLen: 0,
    dotAt: 0,
  });

  const BG = "#000000";
  const INK = "#FFFFFF";


  const dotPos: Point = { x: 0.58, y: 0.18 };

  function catmullRomToPolyline(pts: Point[], samples: number = 24): Point[] {
    if (pts.length < 2) return pts;
    const p = (i: number): Point => pts[Math.max(0, Math.min(pts.length - 1, i))];
    const out: Point[] = [];
    
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
      for (let j = 0; j < samples; j++) {
        const t = j / samples;
        const t2 = t * t, t3 = t2 * t;
        const x =
          0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
        const y =
          0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
        out.push({ x, y });
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }




  function angleBetween(p1: Point, p2: Point, p3: Point): number {
    const v1x = p1.x - p2.x, v1y = p1.y - p2.y;
    const v2x = p3.x - p2.x, v2y = p3.y - p2.y;
    const dot = v1x * v2x + v1y * v2y;
    const m1 = Math.hypot(v1x, v1y) || 1, m2 = Math.hypot(v2x, v2y) || 1;
    const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)));
    return 1 - (Math.acos(cos) / Math.PI);
  }

  function pointAtLength(len: number, pts: Point[]): Point | null {
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const seg = Math.hypot(b.x - a.x, b.y - a.y);
      if (acc + seg >= len) {
        const k = Math.max(0, Math.min(1, (len - acc) / seg));
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
      }
      acc += seg;
    }
    return pts.length > 0 ? pts[pts.length - 1] : null;
  }

  function drawPen(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, isMobile: boolean = false): void {
    const scale = isMobile ? 0.7 : 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    
    // shadow
    ctx.save();
    ctx.translate(3, 3);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // pen body
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    // Fallback for browsers that don't support roundRect
    if ('roundRect' in ctx && typeof (ctx as CanvasRenderingContext2D & { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect === 'function') {
      (ctx as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(-26, -3.5, 28, 7, 3);
    } else {
      ctx.rect(-26, -3.5, 28, 7);
    }
    ctx.fill();
    ctx.stroke();
    
    // nib
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, -4);
    ctx.lineTo(10, 4);
    ctx.closePath();
    ctx.fillStyle = "#eab308";
    ctx.strokeStyle = "#fef08a";
    ctx.fill();
    ctx.stroke();
    
    // tip
    ctx.beginPath();
    ctx.arc(10, 0, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = INK;
    ctx.fill();
    ctx.restore();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const anchors: Array<[number, number]> = [
      [0.06, 0.45], [0.11, 0.20], [0.16, 0.95], [0.22, 0.62],
      [0.30, 0.56], [0.38, 0.50], [0.45, 0.52],
      [0.52, 0.30], [0.56, 0.10], [0.58, 0.60],
      [0.70, 0.50], [0.84, 0.46], [0.94, 0.44],
    ];

    function pressure(pts: Point[], i: number, isMobile: boolean = false): number {
      if (!canvasRef.current) return 1.2;
      
      const b = pts[Math.max(0, i - 1)];
      const c = pts[i];
      const d = pts[Math.min(pts.length - 1, i + 1)];
      const speed = Math.hypot(c.x - b.x, c.y - b.y) + 1e-3;
      const curvature = angleBetween(b, c, d);
      const base = Math.max(1.2, Math.min(canvasRef.current.width, canvasRef.current.height) * (isMobile ? 0.003 : 0.004));
      return base * (1.1 + 0.7 * curvature) * (1.4 - Math.min(1.1, speed * 0.03));
    }

    function rebuildPath(w: number, h: number): void {
      const isMobile = w < 768;
      const pad = Math.min(w, h) * (isMobile ? 0.15 : 0.12);
      const sx = pad, sy = pad;
      const aw = w - pad * 2;
      const ah = h - pad * 2;
      const pts = anchors.map(([ax, ay]) => ({ x: sx + ax * aw, y: sy + ay * ah }));
      const smooth = catmullRomToPolyline(pts, isMobile ? 20 : 28);

      let L = 0;
      for (let i = 1; i < smooth.length; i++) {
        const a = smooth[i - 1], b = smooth[i];
        L += Math.hypot(b.x - a.x, b.y - a.y);
      }
      stateRef.current.points = smooth;
      stateRef.current.totalLen = L;
      stateRef.current.dotAt = L * 1.02;

      console.assert(smooth.length > 10, "[test] smoothed path should have > 10 points");
      console.assert(L > 0, "[test] total length should be positive");
    }

    function strokeUpToLength(
      ctx: CanvasRenderingContext2D,
      pts: Point[],
      targetLen: number,
      color: string,
      alpha: number = 1,
      isMobile: boolean = false
    ): void {
      let acc = 0;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      if (pts.length > 0) {
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          const seg = Math.hypot(b.x - a.x, b.y - a.y);
          const next = acc + seg;
          const k = Math.max(0, Math.min(1, (targetLen - acc) / seg));

          const width = pressure(pts, i, isMobile) * (isMobile ? 1.8 : 2.2);
          ctx.lineWidth = width;

          if (targetLen <= acc) {
            break;
          } else if (targetLen < next) {
            const x = a.x + (b.x - a.x) * k;
            const y = a.y + (b.y - a.y) * k;
            ctx.lineTo(x, y);
            break;
          } else {
            ctx.lineTo(b.x, b.y);
            acc = next;
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    }


    function resize(): void {
      if (!canvas || !wrapper || !ctx) return;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = wrapper.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildPath(rect.width, rect.height);
    }

    function draw(): void {
      if (!canvas || !ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const isMobile = w < 768;
      
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const t = stateRef.current.t;
      const L = stateRef.current.totalLen || 1;
      const u = Math.max(0, Math.min(1, t / stateRef.current.duration));
      const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      const len = Math.min(L * ease, L);

      const pts = stateRef.current.points;
      if (pts.length === 0) return;

      const layers = [1, 0.55, 0.3];
      for (const alpha of layers) {
        strokeUpToLength(ctx, pts, len, INK, alpha, isMobile);
      }

      const tip = pointAtLength(len, pts);
      if (tip) {
        const prev = pointAtLength(Math.max(0, len - 1.5), pts) || tip;
        const ang = Math.atan2(tip.y - prev.y, tip.x - prev.x);
        drawPen(ctx, tip.x, tip.y, ang, isMobile);
      }

      const dotProgress = L * 0.98;
      if (len >= dotProgress) {
        const r = Math.max(1.5, Math.min(w, h) * (isMobile ? 0.006 : 0.008)) * (1 + 0.2 * Math.sin((t - stateRef.current.duration) * 9));
        ctx.save();
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.arc(dotPos.x * w, dotPos.y * h, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // HUD
      ctx.save();
      ctx.font = `${isMobile ? 10 : 12}px ui-sans-serif, system-ui, -apple-system`;
      ctx.fillStyle = "#9ca3af";
      const text = paused ? "Paused • tap to replay" : (isMobile ? "Tap to replay" : "Click to replay • Space to pause");
      ctx.fillText(text, isMobile ? 8 : 12, h - (isMobile ? 12 : 18));
      ctx.restore();
    }

    function loop(ts: number = 0): void {
      if (!paused) {
        const sec = ts / 1000;
        const cycle = stateRef.current.duration + stateRef.current.pause;
        const phase = sec % cycle;
        stateRef.current.t = phase <= stateRef.current.duration ? phase : stateRef.current.duration;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onClick = (): void => {
      stateRef.current.t = 0;
      setPaused(false);
    };

    const onKey = (e: KeyboardEvent): void => {
      if (e.code === "Space") setPaused((p) => !p);
      if (e.key.toLowerCase() === "r") stateRef.current.t = 0;
    };

    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", resize);

    resize();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", onClick);
    };
  }, [paused, dotPos.x, dotPos.y]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[380px] rounded-lg md:rounded-xl overflow-hidden shadow-lg relative bg-black"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-2 right-2 text-xs text-white/70 bg-black/40 backdrop-blur px-2 py-1 rounded-full select-none">
        Signature
      </div>
    </div>
  );
}