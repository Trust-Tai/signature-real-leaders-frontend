import { images } from "@/assets";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// TypeScript interfaces
interface AccordionItem {
  title: string;
  links: Array<{ text: string; href: string }>;
}

interface FloatingIcon {
  label: string;
  href: string;
  color: string;
  speed: number;
  radius: number;
  icon: React.ReactNode;
}

interface IconState {
  el: HTMLAnchorElement;
  angle: number;
  speed: number;
  radius: number;
  jitter: number;
}

// Data
const accordionData: AccordionItem[] = [
  {
    title: "Conservation Work",
    links: [
      { text: "Gombe Research", href: "#" },
      { text: "Jane Goodall Institute", href: "#" },
    ],
  },
  {
    title: "Education Programs",
    links: [
      { text: "Roots & Shoots", href: "#" },
      { text: "Youth Leadership", href: "#" },
    ],
  },
  {
    title: "Global Impact",
    links: [
      { text: "Speaking Events", href: "#" },
      { text: "Documentary Films", href: "#" },
    ],
  },
];

const socialIcons: FloatingIcon[] = [
  {
    label: "X",
    href: "#",
    color: "#000000",
    speed: 0.6,
    radius: 60,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 2H22l-8.7 9.9L22.6 22h-7.1l-5-6.4L4.7 22H1.6l9.3-10.6L1.4 2h7.2l4.6 6 5.7-6z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    color: "#ff0000",
    speed: 0.55,
    radius: 80,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.2 3.5 12 3.5 12 3.5s-7.2 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2.2.6 9.4.6 9.4.6s7.2 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    color: "#c13584",
    speed: 0.7,
    radius: 70,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm5.75-3.25a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    color: "#0a66c2",
    speed: 0.5,
    radius: 90,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.1c.5-.95 1.75-2.1 3.6-2.1 3.85 0 4.56 2.5 4.56 5.7V24h-4v-7.3c0-1.75-.03-4-2.45-4-2.45 0-2.82 1.9-2.82 3.86V24h-4V8.5z"/>
      </svg>
    ),
  },
];

// Component 1: InteractiveMagazineCard
const InteractiveMagazineCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const tilt = 16;
    const followX = 26;
    const followY = 14;

    let rect = card.getBoundingClientRect();
    let raf: number | null = null;

    const onMove = (e: PointerEvent): void => {
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const nx = Math.max(0, Math.min(1, px));
      const ny = Math.max(0, Math.min(1, py));
      
      const ry = (nx - 0.5) * (tilt * 2);
      const rx = -(ny - 0.5) * (tilt * 2);
      const tx = (nx - 0.5) * (followX * 2);
      const ty = (ny - 0.5) * (followY * 2);

      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = null;
          card.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        });
      }
    };

    const onEnter = (e: PointerEvent): void => {
      card.style.transition = 'transform 120ms ease-out';
      onMove(e);
    };

    const onLeave = (): void => {
      card.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
      card.style.transform = '';
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);

    const ro = new ResizeObserver(() => {
      rect = card.getBoundingClientRect();
    });
    ro.observe(card);

    return () => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
    };
  }, []);

  const toggleAccordion = (index: number): void => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <article 
      ref={cardRef}
      className="magazine-card"
      aria-label="Real Leaders interactive"
      style={{
        position: 'relative',
        width: '280px',
        height: '480px',
        borderRadius: '36px',
        color: '#ffffff',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))',
        border: '1px solid rgba(255,255,255,.16)',
        boxShadow: '0 40px 120px rgba(229,9,20,.18), 0 8px 26px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)',
        backdropFilter: 'blur(16px) saturate(140%)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        cursor: 'pointer',
        transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow .25s ease, background .25s ease',
      }}
    >
      <header 
        className="pc-header"
        style={{
          padding: '20px 18px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: 'linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,0) 70%)',
        }}
      >
        <div 
          className="pc-avatar"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,.25)',
            background: '#fff',
            flex: '0 0 auto',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 8px 20px rgba(0,0,0,.35)',
          }}
        >
          <Image 
            src={images.janeGoodallRealLeaders}
            alt="Jane Goodall"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              background: '#fff',
            }}
          />
        </div>
        <div>
          <div 
            className="pc-name"
            style={{
              fontWeight: 800,
              fontSize: '18px',
              lineHeight: 1.1,
            }}
          >
            Jane Goodall
          </div>
          <div 
            className="pc-tag"
            style={{
              opacity: 0.8,
              fontSize: '11px',
            }}
          >
            Primatologist & Conservationist
          </div>
        </div>
      </header>

      <section 
        className="pc-body"
        style={{
          padding: '8px 12px 12px',
          display: 'grid',
          gap: '8px',
        }}
      >
        {accordionData.map((item, index) => (
          <div 
            key={index}
            className="acc-item"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04))',
              border: '1px solid rgba(255,255,255,.16)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 26px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)',
              backdropFilter: 'blur(12px) saturate(140%)',
            }}
          >
            <button
              className="acc-btn"
              type="button"
              onClick={() => toggleAccordion(index)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                color: '#f0f0f0',
                border: '0',
                padding: '12px 12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <span style={{ opacity: 0.95, fontWeight: 800 }}>{item.title}</span>
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                aria-hidden="true"
                style={{
                  width: '14px',
                  height: '14px',
                  transition: 'transform .2s ease',
                  opacity: 0.86,
                  transform: openAccordion === index ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div 
              className="acc-panel"
              style={{
                height: openAccordion === index ? 'auto' : '0',
                overflow: 'hidden',
                transition: 'height .22s ease',
                background: 'linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03))',
              }}
            >
              {openAccordion === index && (
                <div 
                  className="acc-panel-inner"
                  style={{
                    padding: '0 12px 10px',
                    display: 'grid',
                    gap: '6px',
                  }}
                >
                  {item.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      target="_blank"
                      rel="noopener"
                      style={{
                        color: '#fff',
                        textDecoration: 'none',
                        background: 'linear-gradient(180deg, rgba(10,10,14,.7), rgba(10,10,14,.55))',
                        border: '1px solid rgba(255,255,255,.14)',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        const target = e.currentTarget as HTMLAnchorElement;
                        target.style.background = 'linear-gradient(180deg, rgba(229,9,20,.22), rgba(229,9,20,.12))';
                        target.style.borderColor = 'rgba(229,9,20,.35)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.currentTarget as HTMLAnchorElement;
                        target.style.background = 'linear-gradient(180deg, rgba(10,10,14,.7), rgba(10,10,14,.55))';
                        target.style.borderColor = 'rgba(255,255,255,.14)';
                      }}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </article>
  );
};

// Component 2: FloatingIcons
const FloatingIcons: React.FC = () => {
  const areaRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const icons = iconsRef.current.filter(Boolean);
    if (icons.length === 0) return;

    let rect = area.getBoundingClientRect();
    const mouse = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    const state: IconState[] = icons.map((el, i) => ({
      el,
      angle: Math.random() * Math.PI * 2,
      speed: socialIcons[i].speed,
      radius: socialIcons[i].radius,
      jitter: Math.random() * 0.7 + 0.3,
    }));

    const center = () => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

    const loop = (): void => {
      rect = area.getBoundingClientRect();
      const c = center();
      
      state.forEach((s) => {
        s.angle += 0.0035 * s.speed;
        const ox = Math.cos(s.angle) * s.radius;
        const oy = Math.sin(s.angle) * (s.radius * 0.55);
        const dx = (mouse.x - c.x) * 0.06 * s.jitter;
        const dy = (mouse.y - c.y) * 0.06 * s.jitter;
        const x = c.x + ox + dx - rect.left - 22;
        const y = c.y + oy + dy - rect.top - 22;
        
        s.el.style.setProperty('--x', x.toFixed(1) + 'px');
        s.el.style.setProperty('--y', y.toFixed(1) + 'px');
        s.el.style.setProperty('--r', (Math.sin(s.angle) * 6).toFixed(2) + 'deg');
      });
      
      requestAnimationFrame(loop);
    };

    const handleMouseMove = (e: PointerEvent): void => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('pointermove', handleMouseMove);
    
    const ro = new ResizeObserver(() => {
      rect = area.getBoundingClientRect();
    });
    ro.observe(area);
    
    loop();

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      ro.disconnect();
    };
  }, []);

  return (
    <div 
      ref={areaRef}
      className="float-icons"
      aria-label="social links"
      style={{
        position: 'absolute',
        left: '4%',
        bottom: '6%',
        width: '400px',
        height: '180px',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      {socialIcons.map((social, index) => (
        <a
          key={social.label}
          ref={(el) => {
            if (el) iconsRef.current[index] = el;
          }}
          className="fi"
          href={social.href}
          target="_blank"
          rel="noopener"
          aria-label={social.label}
          style={{
            position: 'absolute',
            zIndex: 61,
            width: '45px',
            height: '45px',
            borderRadius: '16px',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.06))',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.18)',
            boxShadow: '0 22px 60px rgba(0,0,0,.45), 0 6px 18px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08)',
            backdropFilter: 'blur(12px) saturate(160%)',
            pointerEvents: 'auto',
            textDecoration: 'none',
            userSelect: 'none',
            transform: 'translate3d(var(--x, 0px), var(--y, 0px), 0) rotate(var(--r, 0deg)) scale(var(--s, 1))',
            transition: 'box-shadow .22s ease, background .22s ease, color .22s ease, border-color .22s ease',
            '--x': '0px',
            '--y': '0px',
            '--s': '1',
            '--r': '0deg',
          } as React.CSSProperties}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLAnchorElement;
            target.style.setProperty('--s', '1.08');
            target.style.boxShadow = '0 30px 80px rgba(229,9,20,.35), 0 18px 40px rgba(0,0,0,.6)';
            target.style.borderColor = 'rgba(229,9,20,.45)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLAnchorElement;
            target.style.setProperty('--s', '1');
            target.style.boxShadow = '0 22px 60px rgba(0,0,0,.45), 0 6px 18px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08)';
            target.style.borderColor = 'rgba(255,255,255,.18)';
          }}
        >
          <div style={{ width: '20px', height: '20px', display: 'block' }}>
            {social.icon}
          </div>
          <span 
            className="fi__label"
            style={{
              position: 'absolute',
              left: '50%',
              top: '100%',
              transform: 'translate(-50%,8px)',
              background: 'rgba(0,0,0,.55)',
              color: '#fff',
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity .2s ease, transform .2s ease',
            }}
          >
            {social.label}
          </span>
        </a>
      ))}
    </div>
  );
};

// Component 3: BrandHandle
const BrandHandle: React.FC = () => {
  const handleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;
    
    const tilt = 12;
    const followX = 18;
    const followY = 10;
    let rect = el.getBoundingClientRect();
    let raf: number | null = null;
    
    const onMove = (e: PointerEvent): void => {
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const nx = Math.max(0, Math.min(1, px));
      const ny = Math.max(0, Math.min(1, py));
      
      const ry = (nx - 0.5) * (tilt * 2);
      const rx = -(ny - 0.5) * (tilt * 2);
      const tx = (nx - 0.5) * (followX * 2);
      const ty = (ny - 0.5) * (followY * 2);
      
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = null;
          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        });
      }
    };
    
    const onEnter = (e: PointerEvent): void => {
      el.style.transition = 'transform 120ms ease-out';
      onMove(e);
    };
    
    const onLeave = (): void => {
      el.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
      el.style.transform = '';
    };
    
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    
    const ro = new ResizeObserver(() => {
      rect = el.getBoundingClientRect();
    });
    ro.observe(el);
    
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <aside 
      ref={handleRef}
      className="handle" 
      aria-label="Real Leaders Signify"
      style={{
        position: 'absolute',
        left: '4%',
        top: '8%',
        width: '200px',
        padding: '12px 12px 10px',
        borderRadius: '20px',
        background: 'linear-gradient(180deg, rgba(229,9,20,.22), rgba(229,9,20,.12))',
        color: '#fff',
        boxShadow: '0 26px 80px rgba(229,9,20,.25), 0 20px 50px rgba(0,0,0,.45)',
        border: '1px solid rgba(255,255,255,.22)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        cursor: 'pointer',
        transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
        backdropFilter: 'blur(12px) saturate(150%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>🌱</span>
        <span style={{ fontWeight: 800, letterSpacing: '.2px', fontSize: '14px' }}>Conservation Leader</span>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: '10px', opacity: 0.98, lineHeight: 1.3 }}>
        Protecting wildlife through science, education, and hope.
      </p>
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        <strong 
          style={{
            background: 'rgba(255,255,255,.92)',
            color: '#111',
            borderRadius: '999px',
            padding: '4px 8px',
            display: 'inline-block',
            fontWeight: 900,
            fontSize: '10px',
          }}
        >
          @janegoodall
        </strong>
        <span
          style={{
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#fff',
            borderRadius: '999px',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 600,
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          60+ Years Impact
        </span>
      </div>
    </aside>
  );
};

// Component 4: MediaTile
const MediaTile: React.FC = () => {
  const tileRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    
    const tilt = 10;
    const followX = 16;
    const followY = 10;
    let rect = el.getBoundingClientRect();
    let raf: number | null = null;
    
    const onMove = (e: PointerEvent): void => {
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const nx = Math.max(0, Math.min(1, px));
      const ny = Math.max(0, Math.min(1, py));
      
      const ry = (nx - 0.5) * (tilt * 2);
      const rx = -(ny - 0.5) * (tilt * 2);
      const tx = (nx - 0.5) * (followX * 2);
      const ty = (ny - 0.5) * (followY * 2);
      
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = null;
          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        });
      }
    };
    
    const onEnter = (e: PointerEvent): void => {
      el.style.transition = 'transform 120ms ease-out';
      onMove(e);
    };
    
    const onLeave = (): void => {
      el.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
      el.style.transform = '';
    };
    
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    
    const ro = new ResizeObserver(() => {
      rect = el.getBoundingClientRect();
    });
    ro.observe(el);
    
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <figure 
      ref={tileRef}
      className="media-tile" 
      aria-label="feature image"
      style={{
        position: 'absolute',
        right: '4%',
        bottom: '6%',
        width: '240px',
        height: '140px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 26px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.16)',
        transformStyle: 'preserve-3d',
        transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
        backdropFilter: 'blur(10px) saturate(140%)',
        background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))',
      }}
    >
      <Image 
        src={images.janeGoodallHero}
        alt="Jane Goodall in conservation work"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </figure>
  );
};

// Component 5: CTABar
const CTABar: React.FC = () => {
  return (
    <div 
      className="cta-bar"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '16px',
        display: 'flex',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: '999px',
        background: 'rgba(0,0,0,.5)',
        border: '1px solid rgba(255,255,255,.15)',
        color: '#eee',
        backdropFilter: 'blur(6px)',
        fontSize: '12px',
        zIndex: 100,
      }}
    >
      <span>Follow </span>
      <a 
        href="#" 
        target="_blank" 
        rel="noopener"
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 700,
          padding: '6px 10px',
          borderRadius: '10px',
          background: '#c61f27',
          boxShadow: '0 8px 18px rgba(198,31,39,.45)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLAnchorElement;
          target.style.transform = 'translateY(-1px)';
          target.style.boxShadow = '0 12px 22px rgba(198,31,39,.55)';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLAnchorElement;
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = '0 8px 18px rgba(198,31,39,.45)';
        }}
      >
        @janegoodall
      </a>
    </div>
  );
};

// Main Component: AudienceAnimation
export const AudienceAnimation: React.FC = () => {
  return (
    <aside 
      className="js-right-rail col-span-3 hidden md:block relative" 
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        perspective: '1200px',
        overflow: 'hidden',
      }}
    >
      <BrandHandle />
      <InteractiveMagazineCard />
      <FloatingIcons />
      <MediaTile />
      <CTABar />
    </aside>
  );
};

export default AudienceAnimation;