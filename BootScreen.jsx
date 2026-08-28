import React, { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "loading student roster...",
  "syncing attendance records...",
  "calibrating grade weights...",
  "mounting library archive...",
  "checking pause & holiday calendar...",
  "indexing course materials...",
  "verifying session...",
  "session ready.",
];

export default function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState([]);
  const [hidden, setHidden] = useState(false);
  const lineIndexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function tick() {
      setProgress((prev) => {
        let next = prev + (Math.random() * 6 + 2.5);
        if (next > 100) next = 100;

        const expectedLines = Math.floor((next / 100) * BOOT_LINES.length);
        if (lineIndexRef.current < expectedLines) {
          setLines((prevLines) => {
            const updated = [...prevLines];
            while (lineIndexRef.current < expectedLines && lineIndexRef.current < BOOT_LINES.length) {
              updated.push(BOOT_LINES[lineIndexRef.current]);
              lineIndexRef.current++;
            }
            return updated.slice(-6);
          });
        }

        if (next < 100) {
          timeoutRef.current = setTimeout(tick, 420);
        } else {
          if (lineIndexRef.current < BOOT_LINES.length) {
            setLines((prevLines) => [...prevLines, BOOT_LINES[BOOT_LINES.length - 1]].slice(-6));
            lineIndexRef.current = BOOT_LINES.length;
          }
          timeoutRef.current = setTimeout(() => {
            setHidden(true);
            timeoutRef.current = setTimeout(() => onDone && onDone(), 650);
          }, 1300);
        }
        return next;
      });
    }
    timeoutRef.current = setTimeout(tick, 420);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`ctboot-root${hidden ? " ctboot-hidden" : ""}`}>
      <style>{`
        .ctboot-root {
          --night: #090C1A;
          --night-deep: #050711;
          --aurora-teal: #2FE6A7;
          --aurora-violet: #8C6BFF;
          --aurora-pink: #FF7FC2;
          --gold: #F2C14E;
          --ink: #EFEAF6;
          --ink-dim: #9A93B8;
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--night);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Space Mono', 'Courier New', monospace;
          transition: opacity 0.6s ease, filter 0.6s ease;
        }
        .ctboot-hidden {
          opacity: 0;
          filter: blur(6px);
          pointer-events: none;
        }
        .ctboot-aurora {
          position: absolute;
          inset: -20%;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.55;
          mix-blend-mode: screen;
        }
        .ctboot-aurora.one {
          background:
            radial-gradient(45% 30% at 20% 15%, var(--aurora-teal), transparent 70%),
            radial-gradient(40% 25% at 75% 20%, var(--aurora-violet), transparent 70%);
          animation: ctboot-drift1 16s ease-in-out infinite;
        }
        .ctboot-aurora.two {
          background:
            radial-gradient(35% 30% at 60% 75%, var(--aurora-pink), transparent 70%),
            radial-gradient(45% 30% at 10% 80%, var(--aurora-teal), transparent 70%);
          animation: ctboot-drift2 20s ease-in-out infinite;
        }
        @keyframes ctboot-drift1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(4%,3%) scale(1.08); }
        }
        @keyframes ctboot-drift2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-3%,-4%) scale(1.05); }
        }
        .ctboot-root::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px,
            transparent 1px, transparent 3px
          );
          mix-blend-mode: overlay;
        }
        .ctboot-panel {
          position: relative;
          z-index: 2;
          width: min(560px, 88vw);
          text-align: left;
          padding: 28px 30px 24px;
          background: rgba(9,12,26,0.55);
          border: 1px solid rgba(242,193,78,0.18);
          border-radius: 10px;
          backdrop-filter: blur(14px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.02) inset, 0 24px 60px rgba(0,0,0,0.45);
        }
        .ctboot-title { font-size: 14px; letter-spacing: 0.12em; color: var(--ink-dim); margin-bottom: 4px; }
        .ctboot-title b { color: var(--gold); font-weight: 700; text-shadow: 0 0 18px rgba(242,193,78,0.35); }
        .ctboot-sub { font-size: 11px; color: var(--ink-dim); opacity: 0.75; margin-bottom: 22px; letter-spacing: 0.08em; }
        .ctboot-log { height: 150px; font-size: 12.5px; line-height: 1.65; color: var(--ink-dim); overflow: hidden; margin-bottom: 18px; }
        .ctboot-log .line { opacity: 0; transform: translateY(4px); animation: ctboot-lineIn 0.35s forwards; }
        .ctboot-log .line.ok { color: var(--gold); text-shadow: 0 0 10px rgba(242,193,78,0.3); }
        .ctboot-log .line::before { content: "> "; color: var(--aurora-violet); }
        @keyframes ctboot-lineIn { to { opacity: 1; transform: translateY(0); } }
        .ctboot-progress-row { display: flex; align-items: center; gap: 14px; }
        .ctboot-progress-track { flex: 1; height: 6px; background: rgba(239,234,246,0.1); border-radius: 3px; overflow: hidden; position: relative; }
        .ctboot-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--aurora-teal), var(--aurora-violet) 55%, var(--gold));
          border-radius: 3px;
          transition: width 0.18s linear;
          box-shadow: 0 0 12px rgba(242,193,78,0.45);
        }
        .ctboot-percent { font-size: 13px; color: var(--gold); min-width: 48px; text-align: right; font-weight: 700; }
        .ctboot-footer { margin-top: 14px; font-size: 10px; letter-spacing: 0.1em; color: var(--ink-dim); opacity: 0.6; }
      `}</style>

      <div className="ctboot-aurora one" />
      <div className="ctboot-aurora two" />

      <div className="ctboot-panel">
        <div className="ctboot-title"><b>CLASSROOM TRACKER//</b>OS v1.0 — starting session</div>
        <div className="ctboot-sub">STUDENT PROGRESS SYSTEM — SECURE LOGIN</div>

        <div className="ctboot-log">
          {lines.map((line, i) => (
            <div key={i} className={`line${line === BOOT_LINES[BOOT_LINES.length - 1] && i === lines.length - 1 && progress >= 100 ? " ok" : ""}`}>
              {line}
            </div>
          ))}
        </div>

        <div className="ctboot-progress-row">
          <div className="ctboot-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          <div className="ctboot-percent">{Math.floor(Math.min(progress, 100))}%</div>
        </div>

        <div className="ctboot-footer">CLASSROOM IN PROGRESS</div>
      </div>
    </div>
  );
}
