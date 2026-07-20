import { useEffect, useState } from 'react';
import { loadJSON, saveJSON, todayKey } from '../lib/storage';
import Vessel from './Vessel';

const GOAL_ML = 2000;
const CUP_ML = 250;

interface DayLog {
  ml: number;
  meals: string[];
}

export default function WaterTracker() {
  const key = `vessel:water:${todayKey()}`;
  const [log, setLog] = useState<DayLog>(() => loadJSON(key, { ml: 0, meals: [] }));
  const [mealInput, setMealInput] = useState('');

  useEffect(() => saveJSON(key, log), [key, log]);

  const addCup = () => setLog((l) => ({ ...l, ml: l.ml + CUP_ML }));
  const removeCup = () => setLog((l) => ({ ...l, ml: Math.max(0, l.ml - CUP_ML) }));

  const logMeal = () => {
    const text = mealInput.trim();
    if (!text) return;
    setLog((l) => ({ ...l, meals: [...l.meals, text] }));
    setMealInput('');
  };

  return (
    <div className="module">
      <div className="module-hero">
        <Vessel
          percent={(log.ml / GOAL_ML) * 100}
          color="var(--c-water)"
          value={`${log.ml}`}
          label={`of ${GOAL_ML}ml`}
        />
        <div className="module-actions">
          <button className="btn btn-primary" onClick={addCup}>
            + Add a cup ({CUP_ML}ml)
          </button>
          <button className="btn btn-ghost" onClick={removeCup}>
            Undo last cup
          </button>
        </div>
      </div>

      <div className="module-section">
        <h3>Meals logged today</h3>
        <div className="row-input">
          <input
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && logMeal()}
            placeholder="e.g. Oatmeal with banana"
          />
          <button className="btn btn-primary" onClick={logMeal}>
            Log
          </button>
        </div>
        {log.meals.length === 0 ? (
          <p className="empty-state">Nothing logged yet — add what you ate to keep a simple record.</p>
        ) : (
          <ul className="entry-list">
            {log.meals.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
