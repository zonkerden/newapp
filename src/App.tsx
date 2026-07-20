import { useState } from 'react';
import WaterTracker from './components/WaterTracker';
import SleepCoach from './components/SleepCoach';
import BreathTimer from './components/BreathTimer';
import MedsReminder from './components/MedsReminder';

type Tab = 'water' | 'sleep' | 'breath' | 'meds';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'water', label: 'Water', icon: '◐' },
  { id: 'sleep', label: 'Sleep', icon: '☾' },
  { id: 'breath', label: 'Breathe', icon: '○' },
  { id: 'meds', label: 'Reminders', icon: '✓' },
];

function App() {
  const [tab, setTab] = useState<Tab>('water');

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="wordmark">Vessel</span>
        <span className="tagline">Fill it in, one day at a time</span>
      </header>

      <main className="app-main">
        {tab === 'water' && <WaterTracker />}
        {tab === 'sleep' && <SleepCoach />}
        {tab === 'breath' && <BreathTimer />}
        {tab === 'meds' && <MedsReminder />}
      </main>

      <nav className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon" aria-hidden="true">
              {t.icon}
            </span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
