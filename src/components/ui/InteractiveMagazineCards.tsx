import { useEffect, useRef } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

// Import images directly from @/assets/images
import mg1Image from "@/assets/images/mg-1.jpg";
import mg2Image from "@/assets/images/mg-2.jpeg";
import mg3Image from "@/assets/images/mg-3.jpeg";
import mg4Image from "@/assets/images/mg-4.jpeg";
import mg5Image from "@/assets/images/mg-5.jpeg";

// Define the Card interface for type safety
interface Card {
  id: number;
  image: string | StaticImageData; // Allow both string and StaticImageData
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  position: string;
}

// Define the cards array with the Card interface
const cards: Card[] = [
  {
    id: 1,
    image: mg1Image,
    badge: "MAGAZINE",
    title: "Purpose-Driven Business Stories",
    subtitle: "Read the latest from Real Leaders.",
    cta: "Read",
    link: "https://real-leaders.com/",
    position: "pos1",
  },
  {
    id: 2,
    image: mg2Image,
    badge: "AWARDS",
    title: "Real Leaders Impact Awards",
    subtitle: "Celebrating companies using business for good.",
    cta: "Explore",
    link: "https://real-leaders.com/awards/",
    position: "pos2",
  },
  {
    id: 3,
    image: mg3Image,
    badge: "SIGNIFY",
    title: "Follow Signify Leaders",
    subtitle: "Insights and reels from leaders you trust.",
    cta: "Follow",
    link: "https://real-leaders.com/signify/",
    position: "pos3",
  },
  {
    id: 4,
    image: mg4Image,
    badge: "EVENTS",
    title: "Book Speakers & Advisors",
    subtitle: "Bring impact leaders to your next event.",
    cta: "Book",
    link: "https://real-leaders.com/events/",
    position: "pos4",
  },
  {
    id: 5,
    image: mg5Image,
    badge: "SUBSCRIBE",
    title: "Get the Magazine",
    subtitle: "Insights delivered to your inbox & door.",
    cta: "Subscribe",
    link: "https://real-leaders.com/subscribe/",
    position: "pos5",
  },
];

export const InteractiveMagazineCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const attachInteractive = (card: HTMLElement, index: number) => {
      let rect = card.getBoundingClientRect();
      let raf: number | null = null;
      const zBase = 10;

      const update = (x: number, y: number) => {
        const px = (x - rect.left) / rect.width;
        const py = (y - rect.top) / rect.height;
        const nx = Math.max(0, Math.min(1, px));
        const ny = Math.max(0, Math.min(1, py));

        const tiltMax = 12;
        const ry = (nx - 0.5) * (tiltMax * 2);
        const rx = -(ny - 0.5) * (tiltMax * 2);

        const followX = (nx - 0.5) * 24;
        const followY = (ny - 0.5) * 12;

        card.style.transform = `translate3d(${followX.toFixed(1)}px, ${followY.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        card.style.setProperty('--gx', `${(nx * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${(ny * 100).toFixed(1)}%`);
      };

      const onMove = (e: PointerEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        rect = card.getBoundingClientRect();
        if (!raf) {
          raf = requestAnimationFrame(() => {
            raf = null;
            update(x, y);
          });
        }
      };

      const onEnter = (e: PointerEvent) => {
        card.style.transition = 'transform 120ms ease-out';
        card.style.zIndex = String(zBase + 100);
        onMove(e);
      };

      const onLeave = () => {
        card.style.transition = 'transform 240ms cubic-bezier(.2,.8,.2,1)';
        card.style.transform = '';
        card.style.zIndex = String(zBase + index);
      };

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      card.addEventListener('click', (e: MouseEvent) => {
        const cta = card.querySelector('.card-cta') as HTMLAnchorElement;
        const interactive = (e.target as Element).closest('a, button');
        if (!interactive && cta) {
          window.open(cta.href, '_blank');
        }
      });

      const resizeObserver = new ResizeObserver(() => {
        rect = card.getBoundingClientRect();
      });
      resizeObserver.observe(card);

      return () => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        resizeObserver.disconnect();
      };
    };

    const cleanupFunctions: (() => void)[] = [];
    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.zIndex = String(10 + index);
        const cleanup = attachInteractive(card, index);
        cleanupFunctions.push(cleanup);
      }
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="magazine-cards-container">
      <style>{`
        .magazine-cards-container {
          --rl-red: #c61f27;
          --card-w: 200px;
          --card-h: 270px;
          position: relative;
          height: 100vh;
          width: 100%;
          background: 
            radial-gradient(1000px 700px at 15% 10%, #0b0b10, #050507 65%);
          overflow: hidden;
          perspective: 1400px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #eaeaea;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .nav {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 12px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }

        .nav img {
          height: 22px;
          display: block;
        }

        .nav a {
          color: #fff;
          text-decoration: none;
          opacity: 0.85;
        }

        .nav a:hover {
          opacity: 1;
        }

        .spread {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 800px;
          max-height: 600px;
        }

        .card {
          position: absolute;
          width: var(--card-w);
          height: var(--card-h);
          border-radius: 14px;
          background: #111;
          color: #eee;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45), 0 6px 18px rgba(0, 0, 0, 0.35);
          transform-style: preserve-3d;
          will-change: transform;
          cursor: pointer;
          transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease, filter 0.25s ease;
        }

        .card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(120px 120px at var(--gx, 50%) var(--gy, 40%), rgba(255, 255, 255, 0.18), transparent 60%);
          mix-blend-mode: screen;
          opacity: 0.8;
          transform: translateZ(80px);
        }

        .card:hover {
          box-shadow: 0 28px 96px rgba(0, 0, 0, 0.55), 0 10px 24px rgba(0, 0, 0, 0.45);
          filter: saturate(1.05);
        }

        .card-media {
          position: absolute;
          inset: 0;
          background: #1c1c20;
        }

        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-badge {
          position: absolute;
          left: 12px;
          top: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.165);
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          transform: translateZ(70px);
        }

        .card-stripe {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 14px 14px 12px;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.75) 36%, rgba(0, 0, 0, 0.9));
          transform: translateZ(60px);
        }

        .card-title {
          font-weight: 800;
          font-size: 14px;
          line-height: 1.1;
          margin: 0 0 4px;
        }

        .card-subtitle {
          margin: 0;
          font-size: 11px;
          opacity: 0.8;
        }

        .card-cta {
          position: absolute;
          right: 12px;
          bottom: 12px;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 11px;
          background: var(--rl-red);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          transform: translateZ(80px);
          box-shadow: 0 8px 18px rgba(198, 31, 39, 0.45);
        }

        .card-cta:hover {
          transform: translateZ(80px) translateY(-1px);
          box-shadow: 0 12px 22px rgba(198, 31, 39, 0.55);
        }

        .pos1 { left: 8%; top: 5%; transform: rotate(-9deg) translateZ(0); }
        .pos2 { left: 35%; top: 15%; transform: rotate(6deg) translateZ(0); }
        .pos3 { left: 62%; top: 8%; transform: rotate(-3deg) translateZ(0); }
        .pos4 { left: 15%; top: 45%; transform: rotate(10deg) translateZ(0); }
        .pos5 { left: 50%; top: 48%; transform: rotate(-7deg) translateZ(0); }

        .hint {
          position: absolute;
          right: 12px;
          bottom: 12px;
          background: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #eee;
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 10px;
          backdrop-filter: blur(6px);
        }

        @media (max-width: 980px) {
          .magazine-cards-container {
            --card-w: 180px;
            --card-h: 240px;
          }
        }

        @media (max-width: 720px) {
          .magazine-cards-container {
            --card-w: 160px;
            --card-h: 220px;
          }
        }
      `}</style>

      <div className="spread" ref={containerRef}>
        {cards.map((card, index) => (
          <article
            key={card.id}
            className={`card ${card.position}`}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            data-link={card.link}
            data-title={card.badge}
          >
            <div className="card-media">
              <Image
                src={card.image}
                alt={`${card.badge} Magazine`}
                width={200} // Match --card-w from CSS
                height={270} // Match --card-h from CSS
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="card-badge">{card.badge}</span>
            <div className="card-stripe">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-subtitle">{card.subtitle}</p>
            </div>
            <a
              className="card-cta"
              href={card.link}
              target="_blank"
              rel="noopener"
            >
              {card.cta}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};