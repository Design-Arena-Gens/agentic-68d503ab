"use client";
import { useMemo, useRef, useEffect, useState } from 'react';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function InteractiveCoast() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [waveHeight, setWaveHeight] = useState<number>(1.2); // m
  const [waveAngle, setWaveAngle] = useState<number>(20); // deg relative to shore-normal
  const [tideRange, setTideRange] = useState<number>(2.0); // m

  const longshoreTransportIndex = useMemo(() => {
    const H = clamp(waveHeight, 0, 4);
    const theta = (clamp(waveAngle, -60, 60) * Math.PI) / 180;
    // CERC-like qualitative relation: Q ~ H^2 * sin(2*theta)
    const q = H * H * Math.sin(2 * theta);
    return q; // can be negative (direction)
  }, [waveHeight, waveAngle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(380 * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Coordinates
    const w = canvas.width;
    const h = canvas.height;

    // Background sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    skyGrad.addColorStop(0, '#e6f0ff');
    skyGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.6);

    // Sea
    const seaY = Math.round(h * 0.45);
    const seaGrad = ctx.createLinearGradient(0, seaY - 40, 0, h);
    seaGrad.addColorStop(0, '#6fb4ff');
    seaGrad.addColorStop(1, '#277bd6');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, seaY, w, h - seaY);

    // Beach profile influenced by tideRange (wider intertidal if range larger)
    const beachTop = seaY - (tideRange * 18);
    const beachRight = Math.round(w * 0.86);

    // Beach polygon
    ctx.fillStyle = '#e9cf98';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, seaY + 3);
    ctx.quadraticCurveTo(beachRight * 0.35, beachTop + 55, beachRight, beachTop);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Shoreline highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(0, seaY + 2);
    ctx.quadraticCurveTo(beachRight * 0.35, beachTop + 55, beachRight, beachTop + 1);
    ctx.stroke();

    // Waves approaching with angle
    const nWaves = 6;
    const theta = (waveAngle * Math.PI) / 180;
    const kx = Math.cos(theta);
    const ky = Math.sin(theta);
    const spacing = 56 * dpr;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2 * dpr;
    for (let i = -2; i < nWaves; i++) {
      const offset = i * spacing;
      ctx.beginPath();
      // Draw slanted lines to mimic wave crests
      const x0 = 20 * dpr + offset * kx - ky * 240 * dpr;
      const y0 = seaY + offset * ky + kx * 240 * dpr;
      const x1 = w - 40 * dpr + offset * kx + -ky * 240 * dpr;
      const y1 = seaY + offset * ky + -kx * 240 * dpr;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    // Longshore current arrow (magnitude from longshoreTransportIndex)
    const base = { x: Math.min(beachRight + 10 * dpr, w - 140 * dpr), y: beachTop + 26 * dpr };
    const q = longshoreTransportIndex;
    const dir = q >= 0 ? 1 : -1;
    const L = clamp(Math.abs(q) * 24, 8, 120) * dpr;
    const ax0 = base.x - dir * L * 0.5;
    const ax1 = base.x + dir * L * 0.5;

    ctx.strokeStyle = '#0f766e';
    ctx.fillStyle = '#0f766e';
    ctx.lineWidth = 4 * dpr;
    ctx.beginPath();
    ctx.moveTo(ax0, base.y);
    ctx.lineTo(ax1, base.y);
    ctx.stroke();
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(ax1, base.y);
    ctx.lineTo(ax1 - 8 * dir * dpr, base.y - 6 * dpr);
    ctx.lineTo(ax1 - 8 * dir * dpr, base.y + 6 * dpr);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.fillStyle = '#0f172a';
    ctx.font = `${14 * dpr}px ui-sans-serif, system-ui, -apple-system`;
    ctx.fillText('D?rive littorale', base.x - 60 * dpr, base.y - 12 * dpr);

  }, [waveHeight, waveAngle, tideRange, longshoreTransportIndex]);

  return (
    <div className="interactive-card">
      <div className="controls">
        <div className="control">
          <label>Hauteur significative des vagues (m)
            <input type="range" min={0} max={4} step={0.1} value={waveHeight}
              onChange={(e) => setWaveHeight(Number(e.target.value))} />
          </label>
          <span className="value">{waveHeight.toFixed(1)} m</span>
        </div>
        <div className="control">
          <label>Angle de houle (? par rapport au rivage)
            <input type="range" min={-60} max={60} step={1} value={waveAngle}
              onChange={(e) => setWaveAngle(Number(e.target.value))} />
          </label>
          <span className="value">{waveAngle.toFixed(0)}?</span>
        </div>
        <div className="control">
          <label>Amplitude de mar?e (m)
            <input type="range" min={0} max={8} step={0.1} value={tideRange}
              onChange={(e) => setTideRange(Number(e.target.value))} />
          </label>
          <span className="value">{tideRange.toFixed(1)} m</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="coast-canvas" style={{ width: '100%', height: 380 }} />

      <div className="legend">
        <div>
          <div className="legend-swatch" style={{ background: '#6fb4ff' }} /> Mer
        </div>
        <div>
          <div className="legend-swatch" style={{ background: '#e9cf98' }} /> Plage
        </div>
        <div>
          <div className="legend-swatch" style={{ background: '#0f766e' }} /> D?rive littorale (intensit?)
        </div>
      </div>

      <div className="note small muted">
        Indice de transport longitudinal ? H??sin(2?), direction selon le signe.
      </div>
    </div>
  );
}
