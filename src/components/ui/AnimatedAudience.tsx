import { useEffect, useRef } from "react";
import Image from "next/image";
import { images } from "@/assets";

interface Avatar {
  el: HTMLAnchorElement;
  target: { x: number; y: number };
}

interface Edge {
  a: Avatar;
  t: number;
  speed: number;
}

export const AnimatedAudience: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const hub = hubRef.current;
    const canvas = canvasRef.current;
    if (!scene || !hub || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = window.innerWidth < 400 ? 22 : window.innerWidth < 720 ? 34 : 36;
    const baseLine = window.innerWidth < 600 ? 1.1 : window.innerWidth < 900 ? 1.4 : 1.8;

    // Helper: DPR-sized canvas
    function fit(): void {
      if (!scene || !canvas || !ctx) return;
      const r = scene.getBoundingClientRect();
      canvas.width = Math.floor(r.width * devicePixelRatio);
      canvas.height = Math.floor(r.height * devicePixelRatio);
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    fit();
    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(scene);

    // Face image provider — stable portrait URLs
    function faceUrl(i: number): string {
      const bank: string[] = [
        'https://randomuser.me/api/portraits/men/11.jpg',
        'https://randomuser.me/api/portraits/women/12.jpg',
        'https://randomuser.me/api/portraits/men/13.jpg',
        'https://randomuser.me/api/portraits/women/14.jpg',
        'https://randomuser.me/api/portraits/men/15.jpg',
        'https://randomuser.me/api/portraits/women/16.jpg',
        'https://randomuser.me/api/portraits/men/17.jpg',
        'https://randomuser.me/api/portraits/women/18.jpg',
        'https://randomuser.me/api/portraits/men/19.jpg',
        'https://randomuser.me/api/portraits/women/20.jpg',
        'https://randomuser.me/api/portraits/men/21.jpg',
        'https://randomuser.me/api/portraits/women/22.jpg',
        'https://randomuser.me/api/portraits/men/23.jpg',
        'https://randomuser.me/api/portraits/women/24.jpg',
        'https://randomuser.me/api/portraits/men/25.jpg',
        'https://randomuser.me/api/portraits/women/26.jpg',
        'https://randomuser.me/api/portraits/men/27.jpg',
        'https://randomuser.me/api/portraits/women/28.jpg',
        'https://randomuser.me/api/portraits/men/29.jpg',
        'https://randomuser.me/api/portraits/women/30.jpg'
      ];
      return bank[i % bank.length];
    }

    // Create avatars
    const avatars: Avatar[] = [];
    const seeds = Array.from({ length: COUNT }, (_, i) => i + 1);

    seeds.forEach((s, i) => {
      if (!scene || !hub) return;
      
      const el = document.createElement('a');
      el.className = 'avatar-item';
      el.href = 'javascript:void(0)';
      el.setAttribute('aria-label', 'audience member');
      
      const img = document.createElement('img');
      img.src = faceUrl(i);
      img.loading = 'lazy';
      img.setAttribute('decoding', 'async');
      img.setAttribute('referrerPolicy', 'no-referrer');
      img.alt = 'Audience face';
      img.onerror = (): void => { 
        img.style.background = 'linear-gradient(180deg,#eee,#ddd)'; 
        img.src = 'https://randomuser.me/api/portraits/lego/1.jpg'; 
      };
      el.appendChild(img);
      
      const tag = document.createElement('span');
      tag.className = 'avatar-tag';
      tag.textContent = 'Audience member';
      el.appendChild(tag);
      
      scene.appendChild(el);

      // Position calculation
      const rect = scene.getBoundingClientRect();
      const start = { x: Math.random() < 0.5 ? -40 : rect.width + 40, y: Math.random() * rect.height };
      
      const angle = (i / COUNT) * Math.PI * 2 - Math.PI / 2;
      const hubRect = hub.getBoundingClientRect();
      const cx = hubRect.left - rect.left + hubRect.width / 2;
      const cy = hubRect.top - rect.top + hubRect.height / 2;
      const edge = rect.width < 600 || rect.height < 600 ? 60 : rect.width < 900 ? 70 : 80;
      const radius = Math.max(120, Math.min(rect.width, rect.height) / 2 - edge);
      const jitter = (): number => Math.random() * 8 - 4;
      const target = { 
        x: cx + Math.cos(angle) * (radius + jitter()), 
        y: cy + Math.sin(angle) * (radius * 1 + jitter()) 
      };

      // Set initial position
      el.style.left = start.x + 'px';
      el.style.top = start.y + 'px';

      // Entrance animation
      el.animate([
        { transform: 'translate(-50%,-50%) scale(.85)', opacity: '0' },
        { transform: 'translate(-50%,-50%) scale(1)', opacity: '1' }
      ], { 
        duration: 600, 
        delay: 120 + i * 18, 
        easing: 'cubic-bezier(.2,.8,.2,1)', 
        fill: 'forwards' 
      });

      // Move to target position
      el.animate([
        { left: start.x + 'px', top: start.y + 'px' },
        { left: target.x + 'px', top: target.y + 'px' }
      ], { 
        duration: 900, 
        delay: 200 + i * 18, 
        easing: 'cubic-bezier(.2,.8,.2,1)', 
        fill: 'forwards' 
      });

      // Idle float animation
      el.animate([
        { transform: 'translate(-50%,-50%) translateY(0px)' },
        { transform: 'translate(-50%,-50%) translateY(-6px)' },
        { transform: 'translate(-50%,-50%) translateY(0px)' }
      ], { 
        duration: 4200 + Math.random() * 1200, 
        iterations: Infinity, 
        easing: 'ease-in-out', 
        delay: 900 + i * 10 
      });

      // Drag interactions
      let dragging = false;
      let dx = 0;
      let dy = 0;

      el.addEventListener('pointerdown', (e: PointerEvent) => {
        dragging = true;
        dx = e.clientX - target.x;
        dy = e.clientY - target.y;
        el.setPointerCapture(e.pointerId);
      });

      el.addEventListener('pointermove', (e: PointerEvent) => {
        if (!dragging) return;
        target.x = e.clientX - dx;
        target.y = e.clientY - dy;
        el.style.left = target.x + 'px';
        el.style.top = target.y + 'px';
        requestRender();
      });

      el.addEventListener('pointerup', (e: PointerEvent) => {
        dragging = false;
        el.releasePointerCapture(e.pointerId);
      });

      avatars.push({ el, target });
    });

    // Draw wires & pulses
    const edges: Edge[] = avatars.map(a => ({ a, t: Math.random(), speed: 0.002 + Math.random() * 0.0025 }));

    function center(el: HTMLElement): { x: number; y: number } {
      if (!scene) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const n = scene.getBoundingClientRect();
      return { x: r.left - n.left + r.width / 2, y: r.top - n.top + r.height / 2 };
    }

    function draw(): void {
      if (!ctx || !canvas || !hub) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hubC = center(hub);
      
      edges.forEach(e => {
        const p = center(e.a.el);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(hubC.x, hubC.y);
        
        const g = ctx.createLinearGradient(p.x, p.y, hubC.x, hubC.y);
        g.addColorStop(0, 'rgba(229,9,20,.18)');
        g.addColorStop(1, 'rgba(229,9,20,.36)');
        ctx.strokeStyle = g;
        ctx.lineWidth = baseLine;
        ctx.stroke();

        // Draw pulse
        e.t += e.speed;
        if (e.t > 1) e.t = 0;
        
        const px = p.x + (hubC.x - p.x) * e.t;
        const py = p.y + (hubC.y - p.y) * e.t;
        
        ctx.beginPath();
        ctx.arc(px, py, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229,9,20,.95)';
        ctx.shadowColor = 'rgba(229,9,20,.6)';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function loop(): void {
      draw();
      requestAnimationFrame(loop);
    }

    function requestRender(): void {
      requestAnimationFrame(draw);
    }

    loop();

    // Cleanup
    return (): void => {
      resizeObserver.disconnect();
      // Remove all created avatar elements
      avatars.forEach(({ el }) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <aside 
      className="js-right-rail col-span-3 hidden md:block relative overflow-hidden"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#000000',
        marginTop:"50px"
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute rounded-full"
          style={{
            width: '520px',
            height: '520px',
            left: '-140px',
            top: '-140px',
            background: '#e50914',
            filter: 'blur(70px)',
            opacity: 0.25,
            animation: 'blob 18s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: '460px',
            height: '460px',
            right: '-160px',
            top: '12%',
            background: '#e50914',
            filter: 'blur(70px)',
            opacity: 0.25,
            animation: 'blob 18s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: '480px',
            height: '480px',
            left: '50%',
            bottom: '-220px',
            transform: 'translateX(-50%)',
            background: '#e50914',
            filter: 'blur(70px)',
            opacity: 0.25,
            animation: 'blob 18s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 text-center py-8 px-5">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3 leading-tight">Real Leaders Audience</h1>
        <p className="text-gray-300 text-base font-medium max-w-md mx-auto leading-relaxed">Watch your community grow.</p>
      </header>

      {/* Main scene */}
      <main 
        ref={sceneRef}
        className="relative w-full max-w-6xl mx-auto px-2.5 mb-6"
        style={{ minHeight: '85vh' }}
      >
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
        
        {/* Central hub */}
        <div 
          ref={hubRef}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '36px',
            background: 'linear-gradient(180deg, rgba(255,255,255,.86), rgba(255,255,255,.72))',
            border: '1px solid rgba(0,0,0,.06)',
            boxShadow: '0 30px 80px rgba(229,9,20,.22), 0 10px 30px rgba(0,0,0,.08)',
            backdropFilter: 'blur(14px) saturate(160%)',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
          }}
        >
          <div className="grid gap-2 place-items-center">
            <Image 
              src={images.realLeaders} 
              alt="Real Leaders" 
              className="h-7"
            />
            <div className="font-black text-gray-900">Real Leaders</div>
            <small className="text-gray-600">Audience Hub</small>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0%, 100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(24px,-20px,0); }
          }
          
          .avatar-item {
            position: absolute;
            width: 46px;
            height: 46px;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid #eee;
            background: #fff;
            display: block;
            box-shadow: 0 12px 26px rgba(0,0,0,.08);
            transform: translate(-50%,-50%) scale(.85);
            opacity: 0;
            cursor: default;
            z-index: 15;
            transition: all 0.2s ease;
          }
          
          .avatar-item:hover {
            z-index: 25;
            transform: translate(-50%,-50%) scale(1);
            box-shadow: 0 20px 50px rgba(229,9,20,.22);
          }
          
          .avatar-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          
          .avatar-item:after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.35), transparent 55%);
          }
          
          .avatar-tag {
            position: absolute;
            left: 50%;
            top: calc(100% + 8px);
            transform: translateX(-50%) translateY(6px);
            background: #fff;
            border: 1px solid #eee;
            color: #444;
            padding: 6px 8px;
            font-size: 11px;
            border-radius: 10px;
            box-shadow: 0 6px 16px rgba(0,0,0,.08);
            opacity: 0;
            pointer-events: none;
            white-space: nowrap;
            transition: opacity 0.2s ease, transform 0.2s ease;
          }
          
          .avatar-item:hover .avatar-tag {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          
          @media (max-width: 900px) {
            header h1 { font-size: 22px; }
            header p { font-size: 14px; }
            header { padding: 16px 12px 2px; }
            main { min-height: 75vh !important; }
            .hub { width: 150px !important; height: 150px !important; }
            .avatar-item {
              width: 38px;
              height: 38px;
            }
          }
          
          @media (max-width: 600px) {
            header h1 { font-size: 20px; }
            header p { font-size: 13px; }
            main { min-height: 78vh !important; }
            .hub { width: 130px !important; height: 130px !important; border-radius: 24px !important; }
            .avatar-item {
              width: 32px;
              height: 32px;
              border-radius: 10px;
            }
            .legend { flex-direction: column; gap: 6px; padding: 4px 0; }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .blob {
              animation: none;
            }
          }
        `
      }} />
    </aside>
  );
};