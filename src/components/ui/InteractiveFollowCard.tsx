import michelle from "../../assets/images/Michelle-Cribbs.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
interface FollowCardStyles extends React.CSSProperties {
  "--rx"?: string;
  "--ry"?: string;
  "--tx"?: string;
  "--ty"?: string;
  "--gx"?: string;
  "--gy"?: string;
}

type InteractiveFollowCardProps = {
  name?: string;
};

export const InteractiveFollowCard: React.FC<InteractiveFollowCardProps> = ({ name }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    const card = cardRef.current;
    const glareEl = glareRef.current;
    if (!card) return;

    const tiltMax = 16;
    const followMaxX = 28;
    const followMaxY = 0;

    let rect = card.getBoundingClientRect();
    const pointer = { x: 0, y: 0 };
    let raf: number | null = null;
    let hovering = false;

    const update = () => {
      if (!hovering) return;
      const px = (pointer.x - rect.left) / rect.width;
      const py = (pointer.y - rect.top) / rect.height;
      const nx = Math.max(0, Math.min(1, px));
      const ny = Math.max(0, Math.min(1, py));

      const ry = (nx - 0.5) * (tiltMax * 2);
      const rx = -(ny - 0.5) * (tiltMax * 2);
      const tx = (nx - 0.5) * (followMaxX * 2);
      const ty = (ny - 0.5) * (followMaxY * 2);

      card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      card.style.setProperty("--ty", `${ty.toFixed(1)}px`);

      if (glareEl) {
        glareEl.style.setProperty("--gx", `${(nx * 100).toFixed(2)}%`);
        glareEl.style.setProperty("--gy", `${(ny * 100).toFixed(2)}%`);
      }
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      rect = card.getBoundingClientRect();
      if (!raf) raf = requestAnimationFrame(() => {
        raf = null;
        update();
      });
    };

    const onEnter = (e: PointerEvent) => {
      hovering = true;
      card.style.transition = "transform 120ms ease-out";
      onMove(e);
    };

    const onLeave = () => {
      hovering = false;
      card.style.transition = "transform 220ms cubic-bezier(.2,.8,.2,1)";
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--tx", "0px");
      card.style.setProperty("--ty", "0px");
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("keydown", onKeyDown);

    const ro = new ResizeObserver(() => {
      rect = card.getBoundingClientRect();
    });
    ro.observe(card);

    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("keydown", onKeyDown);
      ro.disconnect();
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={`follow-card ${isFlipped ? "is-flipped" : ""}`}
      tabIndex={0}
      aria-label="Interactive Real Leaders card"
      style={{
        position: "relative",
        width: "min(350px, 85vw)",
        height: "min(680px, calc(85vw * 1.71))",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0,0,0,.45)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        "--rx": "0deg",
        "--ry": "0deg",
        "--tx": "0px",
        "--ty": "0px",
        transform: "translate3d(var(--tx), var(--ty), 0) rotateX(var(--rx)) rotateY(var(--ry))",
        transition: "transform 220ms cubic-bezier(.2,.8,.2,1)",
        outline: "none",
      } as FollowCardStyles}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", borderRadius: "inherit" }}>
        {/* Front Face */}
        <section
          className="absolute inset-0 bg-gray-900 rounded-[16px] overflow-hidden flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-75 mix-blend-screen"
            style={{
              background:
                "radial-gradient(140px 140px at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.22), transparent 60%)",
              transform: "translateZ(90px)",
              "--gx": "50%",
              "--gy": "50%",
            } as FollowCardStyles}
          />

          <header className="p-4 pb-6 min-h-[35%] flex flex-col justify-center items-center gap-2 text-center">
            <div
              className="w-16 h-16 rounded-full border-2 border-gray-600 overflow-hidden bg-gray-800 shadow-xl"
              style={{ transform: "translateZ(60px)" }}
            >
              <Image src={michelle} alt="Michelle Cribbs" className="w-full h-full object-cover" />
            </div>
            <div
              className="text-lg font-bold text-white tracking-tight"
              style={{ transform: "translateZ(55px)" }}
            >
              Michelle Cribbs
            </div>
            <div
              className="text-xs text-gray-300 leading-tight"
              style={{ transform: "translateZ(50px)" }}
            >
             Leadership Mentor with 25+ Years Experience
            </div>
          </header>

          <ul className="list-none m-0 p-3 grid gap-2 flex-1" style={{ transform: "translateZ(35px)" }}>
            {[
              { title: "Video/Reel", icon: ">" },
              { title: "Book A Coaching Session", icon: ">" },
              { title: "Download My Free Guide", icon: ">" },
              { title: "Watch My TEDx Talk", icon: ">" },
              { title: "Read My Blog", icon: ">" },
              { title: "Donate To My Mission", icon: ">" },
            ].map((item, i) => (
              <li key={i}>
                <p
                  className="flex items-center justify-between p-2.5 px-3 rounded-xl no-underline text-white bg-gray-800 border border-gray-600 hover:bg-gray-700 transition-all duration-200 shadow-sm group"
                >
                  <strong className="text-xs font-medium">{item.title}</strong>
                  <span className="text-gray-400 text-sm font-light group-hover:text-gray-200 transition-colors">
                    {item.icon}
                  </span>
                </p>
              </li>
            ))}
          </ul>

          <div className="p-3 space-y-2" style={{ transform: "translateZ(30px)" }}>
            <div className="text-center">
              <div
                className="text-sm font-light text-gray-300 italic mb-2"
                style={{ fontFamily: "serif" }}
              >
                Michelle Cribbs
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 w-3 h-3 bg-gray-800 border border-gray-600 rounded focus:ring-1 focus:ring-red-500"
              />
              <span>Join Our Newsletter - Get insights delivered to your inbox</span>
            </label>

            <button className="w-full py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-lg">
              FOLLOW
            </button>
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .follow-card:focus-visible {
            box-shadow: 0 0 0 3px #ff4d4d, 0 30px 80px rgba(0,0,0,.45);
          }
          .follow-card.is-flipped > div {
            transform: rotateY(180deg);
            transition: transform 420ms cubic-bezier(.2,.8,.2,1);
          }
          @media (prefers-reduced-motion: reduce) {
            .follow-card {
              transition: none !important;
              transform: none !important;
            }
            .follow-card [style*="translateZ"] {
              transform: none !important;
            }
          }
        `,
        }}
      />
    </article>
  );
};
