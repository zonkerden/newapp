import { useEffect, useState } from 'react';
import { loadJSON, saveJSON, todayKey } from '../lib/storage';
import { useAuth } from '../lib/auth';
import { syncSleepDay, fetchSleepDay } from '../lib/sync';
import Vessel from './Vessel';

const GOAL_HOURS = 8;
const WINDDOWN_STEPS = [
  'Dim the lights and put screens away',
  'Stretch or breathe for two minutes',
  'Write down one thing you\'re leaving for tomorrow',
  'Lie down and let your breathing slow',
];

interface SleepLog {
  bedtime: string;
  waketime: string;
}

export default function SleepCoach() {
  const key = `vessel:sleep:${todayKey()}`;
  const day = todayKey();
  const { session } = useAuth();
  const userId = session?.user.id;
  const [log, setLog] = useState<SleepLog>(() => loadJSON(key, { bedtime: '', waketime: '' }));
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => saveJSON(key, log), [key, log]);

  useEffect(() => {
    if (!userId) return;
    fetchSleepDay(userId, day).then((remote) => {
      if (remote) setLog(remote);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    syncSleepDay(userId, day, log.bedtime, log.waketime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, log]);

  const hours = (() => {
    if (!log.bedtime || !log.waketime) return 0;
    const [bh, bm] = log.bedtime.split(':').map(Number);
    const [wh, wm] = log.waketime.split(':').map(Number);
    let mins = wh * 60 + wm - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return mins / 60;
  })();

  const startWinddown = () => {
    setStep(0);
    setRunning(true);
  };

  const nextStep = () => {
    if (step + 1 >= WINDDOWN_STEPS.length) {
      setRunning(false);
      setStep(0);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="module">
      <div className="module-hero">
        <Vessel
          percent={(hours / GOAL_HOURS) * 100}
          color="var(--c-sleep)"
          value={hours ? hours.toFixed(1) : '—'}
          label={`of ${GOAL_HOURS}h goal`}
        />
        <div className="time-inputs">
          <label>
            Bedtime
            <input
              type="time"
              value={log.bedtime}
              onChange={(e) => setLog((l) => ({ ...l, bedtime: e.target.value }))}
            />
          </label>
          <label>
            Wake time
            <input
              type="time"
              value={log.waketime}
              onChange={(e) => setLog((l) => ({ ...l, waketime: e.target.value }))}
            />
          </label>
        </div>
      </div>

      <div className="module-section">
        <h3>Wind-down routine</h3>
        {!running ? (
          <button className="btn btn-primary" onClick={startWinddown}>
            Start wind-down
          </button>
        ) : (
          <div className="winddown-card">
            <p className="winddown-step">{WINDDOWN_STEPS[step]}</p>
            <button className="btn btn-primary" onClick={nextStep}>
              {step + 1 >= WINDDOWN_STEPS.length ? 'Done' : 'Next'}
            </button>
            <span className="winddown-progress">
              Step {step + 1} of {WINDDOWN_STEPS.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
