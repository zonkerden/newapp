import { supabase } from './supabase';

// Every function here is a best-effort background sync: if there's no
// session or Supabase isn't configured, it quietly does nothing and the
// app keeps working from localStorage alone.

export async function syncWaterDay(userId: string | undefined, day: string, ml: number, meals: string[]) {
  if (!supabase || !userId) return;
  await supabase.from('vessel_water_logs').upsert(
    { user_id: userId, day, ml, meals, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,day' }
  );
}

export async function fetchWaterDay(userId: string | undefined, day: string) {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from('vessel_water_logs')
    .select('ml, meals')
    .eq('user_id', userId)
    .eq('day', day)
    .maybeSingle();
  return data as { ml: number; meals: string[] } | null;
}

export async function syncSleepDay(userId: string | undefined, day: string, bedtime: string, waketime: string) {
  if (!supabase || !userId) return;
  await supabase.from('vessel_sleep_logs').upsert(
    { user_id: userId, day, bedtime, waketime, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,day' }
  );
}

export async function fetchSleepDay(userId: string | undefined, day: string) {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from('vessel_sleep_logs')
    .select('bedtime, waketime')
    .eq('user_id', userId)
    .eq('day', day)
    .maybeSingle();
  return data as { bedtime: string; waketime: string } | null;
}

export async function syncBreathDay(userId: string | undefined, day: string, sessionsCount: number) {
  if (!supabase || !userId) return;
  await supabase.from('vessel_breath_sessions').upsert(
    { user_id: userId, day, sessions_count: sessionsCount, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,day' }
  );
}

export async function fetchBreathDay(userId: string | undefined, day: string) {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from('vessel_breath_sessions')
    .select('sessions_count')
    .eq('user_id', userId)
    .eq('day', day)
    .maybeSingle();
  return data as { sessions_count: number } | null;
}

export interface RemoteMedItem {
  id: string;
  name: string;
  time: string;
}

export async function fetchMedsItems(userId: string | undefined) {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from('vessel_meds_items')
    .select('id, name, time')
    .eq('user_id', userId)
    .order('time', { ascending: true });
  return data as RemoteMedItem[] | null;
}

export async function addMedsItem(userId: string | undefined, item: RemoteMedItem) {
  if (!supabase || !userId) return;
  await supabase.from('vessel_meds_items').upsert({ ...item, user_id: userId });
}

export async function removeMedsItem(userId: string | undefined, id: string) {
  if (!supabase || !userId) return;
  await supabase.from('vessel_meds_items').delete().eq('id', id).eq('user_id', userId);
}

export async function fetchMedsTaken(userId: string | undefined, day: string) {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from('vessel_meds_taken')
    .select('item_id')
    .eq('user_id', userId)
    .eq('day', day);
  return data ? data.map((r) => r.item_id as string) : null;
}

export async function setMedsTaken(userId: string | undefined, itemId: string, day: string, taken: boolean) {
  if (!supabase || !userId) return;
  if (taken) {
    await supabase.from('vessel_meds_taken').upsert({ user_id: userId, item_id: itemId, day });
  } else {
    await supabase.from('vessel_meds_taken').delete().eq('user_id', userId).eq('item_id', itemId).eq('day', day);
  }
}
