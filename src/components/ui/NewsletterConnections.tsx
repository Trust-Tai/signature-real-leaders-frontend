import { images } from "@/assets";
import Image from "next/image";
import React, { useEffect, useRef } from "react";



interface Edge {
  from: HTMLElement;
  to: HTMLElement;
  t: number;
  speed: number;
}

export const NewsletterConnections = (): React.ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const network = networkRef.current;
    const hub = hubRef.current;
    
    if (!canvas || !network || !hub) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chips = Array.from(network.querySelectorAll('.chip')) as HTMLElement[];

    // Make chips draggable
    chips.forEach(chip => {
      let dx = 0, dy = 0, dragging = false;
      
      const handlePointerDown = (e: PointerEvent): void => {
        dragging = true;
        dx = e.clientX - chip.offsetLeft;
        dy = e.clientY - chip.offsetTop;
        chip.setPointerCapture(e.pointerId);
        chip.style.transition = 'none';
      };

      const handlePointerMove = (e: PointerEvent): void => {
        if (!dragging) return;
        chip.style.left = (e.clientX - dx) + 'px';
        chip.style.top = (e.clientY - dy) + 'px';
        requestRender();
      };

      const handlePointerUp = (e: PointerEvent): void => {
        dragging = false;
        chip.releasePointerCapture(e.pointerId);
        chip.style.transition = '';
      };

      chip.addEventListener('pointerdown', handlePointerDown);
      chip.addEventListener('pointermove', handlePointerMove);
      chip.addEventListener('pointerup', handlePointerUp);
    });

    // Canvas sizing
    const resizeCanvas = (): void => {
      if (!canvas || !network || !ctx) return;
      const rect = network.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * (window.devicePixelRatio || 1));
      canvas.height = Math.floor(rect.height * (window.devicePixelRatio || 1));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(network);

    // Get center of element relative to network
    const getCenter = (el: HTMLElement): { x: number; y: number } => {
      if (!network) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const networkRect = network.getBoundingClientRect();
      return {
        x: rect.left - networkRect.left + rect.width / 2,
        y: rect.top - networkRect.top + rect.height / 2
      };
    };

    // Create animated edges
    const edges: Edge[] = chips.map((chip) => ({
      from: chip,
      to: hub,
      t: Math.random(),
      speed: 0.002 + Math.random() * 0.002
    }));

    // Draw function
    const draw = (): void => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      edges.forEach(edge => {
        const fromCenter = getCenter(edge.from);
        const toCenter = getCenter(edge.to);

        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(fromCenter.x, fromCenter.y);
        ctx.lineTo(toCenter.x, toCenter.y);
        
        const gradient = ctx.createLinearGradient(fromCenter.x, fromCenter.y, toCenter.x, toCenter.y);
        gradient.addColorStop(0, 'rgba(229,9,20,0.18)');
        gradient.addColorStop(1, 'rgba(229,9,20,0.35)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw animated pulse dot
        edge.t += edge.speed;
        if (edge.t > 1) edge.t = 0;
        
        const pulseX = fromCenter.x + (toCenter.x - fromCenter.x) * edge.t;
        const pulseY = fromCenter.y + (toCenter.y - fromCenter.y) * edge.t;
        
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229,9,20,0.9)';
        ctx.shadowColor = 'rgba(229,9,20,0.6)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    // Animation loop
    let animationId: number;
    const loop = (): void => {
      draw();
      animationId = requestAnimationFrame(loop);
    };

    let renderPending = false;
    const requestRender = (): void => {
      if (!renderPending) {
        renderPending = true;
        requestAnimationFrame(() => {
          renderPending = false;
          draw();
        });
      }
    };

    loop();

    // Responsive layout for mobile
    const updateLayout = (): void => {
      if (!network || !hub) return;
      const w = window.innerWidth;
      const networkRect = network.getBoundingClientRect();
      const hubRect = hub.getBoundingClientRect();
      const cx = hubRect.left - networkRect.left + hubRect.width / 2;
      const cy = hubRect.top - networkRect.top + hubRect.height / 2;
      const radius = Math.max(120, Math.min(networkRect.width, 520) / 2.2);

      chips.forEach((chip, i) => {
        if (w <= 720) {
          const angle = (i / chips.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * radius - chip.offsetWidth / 2;
          const y = cy + Math.sin(angle) * (radius * 0.75) - chip.offsetHeight / 2;
          chip.style.left = x + 'px';
          chip.style.top = y + 'px';
        } else {
          // Reset to CSS positions for desktop
          chip.style.left = '';
          chip.style.top = '';
        }
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[520px] h-[520px] -left-[120px] -top-[120px] bg-red-600/15 rounded-full blur-[70px] animate-pulse" 
             style={{ animation: 'blob 18s ease-in-out infinite' }} />
        <div className="absolute w-[460px] h-[460px] -right-[160px] top-[15%] bg-red-600/15 rounded-full blur-[70px]" 
             style={{ animation: 'blob 18s ease-in-out infinite 2s' }} />
        <div className="absolute w-[480px] h-[480px] left-1/2 -bottom-[220px] -translate-x-1/2 bg-red-600/15 rounded-full blur-[70px]" 
             style={{ animation: 'blob 18s ease-in-out infinite 4s' }} />
      </div>

      <header className="pt-7 pb-2.5 px-5 text-center">
        <h1 className="text-[28px] font-normal tracking-wide text-white m-0">Connect your newsletter</h1>
        <p className="text-white/70 mt-2 mb-0">Real Leaders brings your audience together — watch providers connect in real time.</p>
      </header>

      <section ref={networkRef} className="relative w-full max-w-[1100px] mx-auto my-6 px-6 min-h-[540px]">
        {/* Black background for cards area */}
        <canvas ref={canvasRef} id="links" className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Hub */}
        <div ref={hubRef} className="hub absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-[40px] backdrop-blur-[12px] backdrop-saturate-[170%] bg-gradient-to-b from-white/85 to-white/65 border border-black/5 shadow-[0_24px_60px_rgba(229,9,20,0.20),0_8px_18px_rgba(0,0,0,0.08)] grid place-items-center text-center">
          <div className="grid gap-2 place-items-center">
            <Image src={images.realLeaders} alt="Real Leaders" className="h-7 block" />
            <div className="font-black tracking-wide text-black">Real Leaders</div>
            <small className="text-gray-600">Newsletter Hub</small>
          </div>
        </div>

        {/* Mailchimp Chip */}
        <article className="chip mc absolute left-[5%] top-[20%] w-[200px] rounded-[18px] bg-yellow-400 border-2 border-yellow-400 shadow-[0_16px_40px_rgba(255,224,27,0.25)] grid grid-cols-[56px_1fr] gap-3 items-center p-3 cursor-pointer hover:shadow-[0_22px_60px_rgba(255,224,27,0.4)] hover:scale-105 transition-all duration-200"
                  style={{ animation: 'float 8s ease-in-out infinite 0.2s' }}>
          <div className="w-14 h-14 rounded-[14px] grid place-items-center bg-white shadow-sm">
            <Image src={images.mailchimpIcon} alt="Mailchimp" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="font-black text-gray-800">Mailchimp</div>
            <div className="text-gray-700 text-xs font-medium">API Key</div>
          </div>
        </article>

        {/* HubSpot Chip */}
        <article className="chip hs absolute right-[6%] top-[16%] w-[200px] rounded-[18px] bg-orange-500 border-2 border-orange-500 shadow-[0_16px_40px_rgba(255,122,89,0.25)] grid grid-cols-[56px_1fr] gap-3 items-center p-3 cursor-pointer hover:shadow-[0_22px_60px_rgba(255,122,89,0.4)] hover:scale-105 transition-all duration-200"
                  style={{ animation: 'float 8s ease-in-out infinite 1s' }}>
          <div className="w-14 h-14 rounded-[14px] grid place-items-center bg-white shadow-sm">
            <Image src={images.hubspotIcon} alt="HubSpot" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="font-black text-white">HubSpot</div>
            <div className="text-white/90 text-xs font-medium">OAuth</div>
          </div>
        </article>
      </section>

    

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(24px, -20px, 0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          .chip {
            animation: float 8s ease-in-out infinite;
          }

          @media (max-width: 900px) {
            .network { padding: 16px; margin: 12px auto 20px; min-height: 460px; }
            .hub { width: 180px; height: 180px; border-radius: 28px; }
            .chip { width: 180px; }
          }

          @media (max-width: 720px) {
            .network { min-height: 420px; }
            .hub { width: 160px; height: 160px; border-radius: 26px; }
            .chip { 
              width: 160px; 
              grid-template-columns: 48px 1fr; 
              padding: 10px; 
            }
            .chip .logo { width: 48px; height: 48px; border-radius: 12px; }
            .blob { filter: blur(50px) !important; opacity: 0.12 !important; }
          }

          @media (prefers-reduced-motion: reduce) {
            .blob, .chip { animation: none !important; }
          }
        `
      }} />
    </div>
  );
};