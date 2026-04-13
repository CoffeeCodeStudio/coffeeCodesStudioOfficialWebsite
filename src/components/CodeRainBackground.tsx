import { useEffect, useRef } from 'react';

const COFFEE_SYMBOLS = ['</☕>', '☕', '●', '◍', '○', 'BEAN', 'ESPRESSO'];
const DEV_SYMBOLS = ['</>', '<div>', '{}', '() =>', 'useState', '...', 'import', 'from', '#', '*', '&&', '? :', '{...}'];

interface Symbol {
  x: number;
  y: number;
  speed: number;
  text: string;
  color: string;
  size: number;
  opacity: number;
}

function getRandomSymbol(): string {
  const useCoffee = Math.random() < 0.35;
  const pool = useCoffee ? COFFEE_SYMBOLS : DEV_SYMBOLS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getCSSColor(varName: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return '0 0% 50%';
  return raw;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

interface CodeRainBackgroundProps {
  columns?: number;
}

export function CodeRainBackground({ columns = 50 }: CodeRainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let symbols: Symbol[] = [];

    const colorVars = ['--primary', '--secondary', '--accent', '--muted'];

    function getColors(): string[] {
      return colorVars.map(getCSSColor);
    }

    function createSymbol(x: number, startOffscreen = true): Symbol {
      const colors = getColors();
      const hsl = colors[Math.floor(Math.random() * colors.length)];
      const opacity = randomBetween(0.1, 0.2);
      return {
        x,
        y: startOffscreen ? randomBetween(-200, -20) : randomBetween(0, canvas!.height),
        speed: randomBetween(0.4, 1.5),
        text: getRandomSymbol(),
        color: `hsla(${hsl} / ${opacity})`,
        size: Math.floor(randomBetween(14, 28)),
        opacity,
      };
    }

    function initSymbols() {
      const colWidth = Math.max(45, canvas!.width / columns);
      const count = Math.floor(canvas!.width / colWidth);
      symbols = [];
      for (let i = 0; i < count; i++) {
        symbols.push(createSymbol(i * colWidth + colWidth / 2, false));
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initSymbols();
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const sym of symbols) {
        sym.y += sym.speed;

        if (sym.y > window.innerHeight + 50) {
          sym.y = randomBetween(-200, -20);
          sym.text = getRandomSymbol();
          const colors = getColors();
          const hsl = colors[Math.floor(Math.random() * colors.length)];
          sym.opacity = randomBetween(0.1, 0.2);
          sym.color = `hsla(${hsl} / ${sym.opacity})`;
          sym.size = Math.floor(randomBetween(14, 28));
          sym.speed = randomBetween(0.4, 1.5);
        }

        ctx!.font = `${sym.size}px "Inter", monospace`;
        ctx!.fillStyle = sym.color;
        ctx!.fillText(sym.text, sym.x, sym.y);
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [columns]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
