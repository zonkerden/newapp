import { useEffect, useState } from 'react';
import { loadJSON, saveJSON, todayKey } from '../lib/storage';
import { useAuth } from '../lib/auth';
import {
  fetchMedsItems,
  addMedsItem,
  removeMedsItem,
  fetchMedsTaken,
  setMedsTaken,
} from '../lib/sync';

interface MedItem {
  id: string;
  name: string;
  time: string;
  takenToday: boolean;
}

export default function MedsReminder() {
  const key = 'vessel:meds:list';
  const day = todayKey();
  const dayKey = `vessel:meds:taken:${day}`;
  const { session } = useAuth();
  const userId = session?.user.id;
  const [items, setItems] = useState<MedItem[]>(() => loadJSON(key, []));
  const [takenIds, setTakenIds] = useState<string[]>(() => loadJSON(dayKey, []));
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [notifOn, setNotifOn] = useState(false);

  useEffect(() => saveJSON(key, items), [items]);
  useEffect(() => saveJSON(dayKey, takenIds), [dayKey, takenIds]);

  // Pull the item list and today's taken state once, right after sign-in
  useEffect(() => {
    if (!userId) return;
    fetchMedsItems(userId).then((remote) => {
      if (remote) setItems(remote.map((r) => ({ ...r, takenToday: false })));
    });
    fetchMedsTaken(userId, day).then((remote) => {
      if (remote) setTakenIds(remote);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addItem = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const item = { id: crypto.randomUUID(), name: trimmed, time, takenToday: false };
    setItems((list) => [...list, item]);
    addMedsItem(userId, { id: item.id, name: item.name, time: item.time });
    setName('');
  };

  const removeItem = (id: string) => {
    setItems((list) => list.filter((i) => i.id !== id));
    setTakenIds((ids) => ids.filter((i) => i !== id));
    removeMedsItem(userId, id);
  };

  const toggleTaken = (id: string) => {
    setTakenIds((ids) => {
      const nowTaken = !ids.includes(id);
      setMedsTaken(userId, id, day, nowTaken);
      return nowTaken ? [...ids, id] : ids.filter((i) => i !== id);
    });
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifOn(perm === 'granted');
  };

  const taken = items.filter((i) => takenIds.includes(i.id)).length;

  return (
    <div className="module">
      <div className="module-hero">
        <div className="meds-summary">
          <span className="meds-count">
            {taken}/{items.length}
          </span>
          <span className="vessel-label">taken today</span>
        </div>
        <button className="btn btn-ghost" onClick={requestNotifications}>
          {notifOn ? 'Reminders on' : 'Enable reminders'}
        </button>
      </div>

      <div className="module-section">
        <h3>Add a reminder</h3>
        <div className="row-input meds-input">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vitamin D" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <button className="btn btn-primary" onClick={addItem}>
            Add
          </button>
        </div>

        {items.length === 0 ? (
          <p className="empty-state">No reminders yet — add a medication, supplement, or symptom check.</p>
        ) : (
          <ul className="meds-list">
            {items
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((item) => {
                const done = takenIds.includes(item.id);
                return (
                  <li key={item.id} className={done ? 'done' : ''}>
                    <button className="meds-check" onClick={() => toggleTaken(item.id)} aria-label="Mark taken">
                      {done ? '✓' : ''}
                    </button>
                    <span className="meds-name">{item.name}</span>
                    <span className="meds-time">{item.time}</span>
                    <button className="meds-remove" onClick={() => removeItem(item.id)} aria-label="Remove">
                      ×
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
