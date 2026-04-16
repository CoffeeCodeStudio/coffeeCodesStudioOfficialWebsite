import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const MUTE_KEY = "cb-cursor-muted";

export const CoffeeBeanCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bursts, setBursts] = useState<BurstParticle[]>([]);
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(MUTE_KEY) === "1";
  });
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted);
  const lastSpawnRef = useRef({ x: 0, y: 0 });
  const idRef = useRef(0);

  useEffect(() => {
    mutedRef.current = muted;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    }
  }, [muted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const STYLE_ID = "cb-cursor-hide-style";
    if (!enabled) {
      document.body.style.cursor = "";
      document.getElementById(STYLE_ID)?.remove();
      return;
    }
    document.body.style.cursor = "none";

    // Force-hide native cursor on ALL elements (overrides hover hand, text I-beam, etc.)
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      styleEl.textContent = `
        html, body, *, *::before, *::after { cursor: none !important; }
      `;
      document.head.appendChild(styleEl);
    }

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);

      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        'a, button, input, textarea, select, [role="button"], [role="link"], label, summary, [tabindex]:not([tabindex="-1"])'
      );
      setHovering(interactive);

      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      if (dx * dx + dy * dy > 600) {
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
        const id = ++idRef.current;
        // Slight horizontal jitter for natural drift
        const jitterX = (Math.random() - 0.5) * 8;
        setParticles((prev) =>
          [...prev, { id, x: e.clientX + jitterX, y: e.clientY - 4 }].slice(-15)
        );
        window.setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 900);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const playClick = () => {
      if (mutedRef.current) return;
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();
        const now = ctx.currentTime;

        // Soft "tock" — short low-mid sine with quick decay
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch {
        // ignore audio errors
      }
    };

    const onDown = (e: MouseEvent) => {
      setClicking(true);
      playClick();
      // Burst of particles in a radial pattern
      const count = 10;
      const newBursts: BurstParticle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 28 + Math.random() * 18;
        const id = ++idRef.current;
        newBursts.push({
          id,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        });
      }
      setBursts((prev) => [...prev, ...newBursts].slice(-40));
      const ids = newBursts.map((b) => b.id);
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => !ids.includes(b.id)));
      }, 600);
    };
    const onUp = () => {
      window.setTimeout(() => setClicking(false), 180);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  const beanColor = hovering ? "#C8923D" : "#6F4E37";
  const baseSize = hovering ? 22 : 16;
  const scale = clicking ? 0.7 : 1;

  return (
    <>
      {/* Steam trail */}
      {particles.map((p) => {
        const drift = ((p.id % 7) - 3) * 2; // -6..+6 px
        return (
          <span
            key={p.id}
            className="cb-cursor-particle"
            style={{
              left: p.x,
              top: p.y,
              ["--cb-drift" as string]: `${drift}px`,
            }}
          />
        );
      })}

      {/* Click burst particles */}
      {bursts.map((b) => (
        <span
          key={b.id}
          className="cb-cursor-burst"
          style={{
            left: b.x,
            top: b.y,
            ["--cb-dx" as string]: `${b.dx}px`,
            ["--cb-dy" as string]: `${b.dy}px`,
          }}
        />
      ))}

      {/* Coffee bean */}
      <div
        aria-hidden
        className={clicking ? "cb-cursor-bean cb-bounce" : "cb-cursor-bean"}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: baseSize,
          height: baseSize * 1.35,
          transform: `translate(-50%, -50%) rotate(-25deg) scale(${scale})`,
          borderRadius: "50%",
          background: beanColor,
          boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.35)`,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition:
            "width 120ms ease, height 120ms ease, background-color 160ms ease, opacity 160ms ease, transform 140ms cubic-bezier(.34,1.56,.64,1)",
          willChange: "transform, left, top",
        }}
      >
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

      {/* Mute toggle (desktop only — component returns null on touch) */}
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Slå på cursor-ljud" : "Stäng av cursor-ljud"}
        title={muted ? "Slå på cursor-ljud" : "Stäng av cursor-ljud"}
        className="fixed bottom-4 right-4 z-[9997] w-9 h-9 rounded-full flex items-center justify-center bg-card/70 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card transition-colors shadow-md"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <style>{`
        .cb-cursor-particle {
          position: fixed;
          width: 14px;
          height: 14px;
          margin-left: -7px;
          margin-top: -7px;
          background: radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(220,220,220,0.25) 45%, rgba(200,200,200,0) 75%);
          border-radius: 50%;
          filter: blur(3px);
          pointer-events: none;
          z-index: 9998;
          animation: cb-steam 900ms ease-out forwards;
        }
        @keyframes cb-steam {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.6); }
          20%  { opacity: 0.55; }
          100% { opacity: 0; transform: translate(var(--cb-drift, -4px), -28px) scale(2.2); }
        }
        .cb-cursor-burst {
          position: fixed;
          width: 5px;
          height: 7px;
          margin-left: -2.5px;
          margin-top: -3.5px;
          background: #6F4E37;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.3);
          pointer-events: none;
          z-index: 9998;
          animation: cb-burst 600ms cubic-bezier(.22,.61,.36,1) forwards;
        }
        @keyframes cb-burst {
          0% { opacity: 1; transform: translate(0,0) scale(1) rotate(-25deg); }
          100% {
            opacity: 0;
            transform: translate(var(--cb-dx), var(--cb-dy)) scale(0.3) rotate(20deg);
          }
        }
        @media (pointer: coarse) {
          .cb-cursor-particle, .cb-cursor-burst { display: none; }
        }
      `}</style>
    </>
  );
};

export default CoffeeBeanCursor;
