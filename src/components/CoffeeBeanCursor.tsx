import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export const CoffeeBeanCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawnRef = useRef({ x: 0, y: 0 });
  const idRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.style.cursor = "";
      return;
    }
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);

      // Hover detection
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        'a, button, input, textarea, select, [role="button"], [role="link"], label, summary, [tabindex]:not([tabindex="-1"])'
      );
      setHovering(interactive);

      // Distance-based particle spawn (perf)
      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      if (dx * dx + dy * dy > 400) {
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
        const id = ++idRef.current;
        setParticles((prev) => [...prev, { id, x: e.clientX, y: e.clientY }].slice(-20));
        window.setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 500);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  const beanColor = hovering ? "#C8923D" : "#6F4E37";
  const size = hovering ? 22 : 16;

  return (
    <>
      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="cb-cursor-particle"
          style={{
            left: p.x,
            top: p.y,
          }}
        />
      ))}

      {/* Coffee bean */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: size,
          height: size * 1.35,
          transform: "translate(-50%, -50%) rotate(-25deg)",
          borderRadius: "50%",
          background: beanColor,
          boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.35)`,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition:
            "width 120ms ease, height 120ms ease, background-color 160ms ease, opacity 160ms ease",
          willChange: "transform, left, top",
        }}
      >
        {/* Crease */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "10%",
            width: 1.5,
            height: "80%",
            background:
              "linear-gradient(to bottom, transparent, rgba(255,230,200,0.55), transparent)",
            borderRadius: 2,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <style>{`
        .cb-cursor-particle {
          position: fixed;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          margin-top: -3px;
          background: #D4A373;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          animation: cb-fade 500ms ease-out forwards;
        }
        @keyframes cb-fade {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.2); }
        }
        @media (pointer: coarse) {
          .cb-cursor-particle { display: none; }
        }
      `}</style>
    </>
  );
};

export default CoffeeBeanCursor;
