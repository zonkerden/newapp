import { useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON, todayKey } from '../lib/storage';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface Pattern {
  name: string;
  phases: { phase: Phase; seconds: number }[];
}

const PATTERNS: Pattern[] = [
  {
    name: 'Box breathing',
    phases: [
      { phase: 'inhale', seconds: 4 },
      { phase: 'hold', seconds: 4 },
      { phase: 'exhale', seconds: 4 },
      { phase: 'rest', seconds: 4 },
    ],
  },
  {
    name: '4-7-8',
    phases: [
      { phase: 'inhale', seconds: 4 },
      { phase: 'hold', seconds: 7 },
      { phase: 'exhale', seconds: 8 },
    ],
  },
];

const PHASE_LABEL: Record<Phase, string> = {
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
  rest: 'Rest',
};

export default function BreathTimer() {
  const key = `vessel:breath:${todayKey()}`;
  const [sessionsToday, setSessionsToday] = useState<number>(() => loadJSON(key, 0));
  const [patternIdx, setPatternIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS[0].phases[0].seconds);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => saveJSON(key, sessionsToday), [key, sessionsToday]);

  const pattern = PATTERNS[patternIdx];

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setPhaseIdx((p) => {
          const nextPhase = (p + 1) % pattern.phases.length;
          if (nextPhase === 0) setCycles((c) => c + 1);
          setSecondsLeft(pattern.phases[nextPhase].seconds);
          return nextPhase;
        });
        return pattern.phases[(phaseIdx + 1) % pattern.phases.length].seconds;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, patternIdx]);

  const start = () => {
    setPhaseIdx(0);
    setCycles(0);
    setSecondsLeft(pattern.phases[0].seconds);
    setActive(true);
  };

  const stop = () => {
    setActive(false);
    if (cycles > 0) setSessionsToday((n) => n + 1);
  };

  const currentPhase = pattern.phases[phaseIdx].phase;

  return (
    <div className="module">
      <div className="module-hero breath-hero">
        <div className={`breath-orb phase-${currentPhase} ${active ? 'active' : ''}`}>
          <span className="breath-phase-label">{active ? PHASE_LABEL[currentPhase] : 'Ready'}</span>
          {active && <span className="breath-seconds">{secondsLeft}</span>}
        </div>
        <p className="breath-meta">
          {active ? `Cycle ${cycles + 1}` : `${sessionsToday} session${sessionsToday === 1 ? '' : 's'} today`}
        </p>
      </div>

      <div className="module-section">
        <h3>Pattern</h3>
        <div className="pattern-picker">
          {PATTERNS.map((p, i) => (
            <button
              key={p.name}
              className={`btn ${i === patternIdx ? 'btn-primary' : 'btn-ghost'}`}
              disabled={active}
              onClick={() => setPatternIdx(i)}
            >
              {p.name}
            </button>
          ))}
        </div>
        {!active ? (
          <button className="btn btn-primary btn-wide" onClick={start}>
            Start session
          </button>
        ) : (
          <button className="btn btn-ghost btn-wide" onClick={stop}>
            End session
          </button>
        )}
      </div>
    </div>
  );
}
