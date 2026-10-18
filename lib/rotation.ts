import type { Chore, Completion, Member } from "./types";

export type TodayItem = { chore: Chore; assignee: Member | null; done: boolean; skipped?: boolean };

export function getToday(
  members: Member[],
  chores: Chore[],
  completions: Completion[],
  today: string
): TodayItem[] {
  if (members.length === 0) return [];

  // load = how many chores each person has done (before today) or been given today
  const load = new Map<string, number>(members.map((m) => [m.id, 0]));
  completions
    .filter((c) => c.done_on < today && load.has(c.member_id))
    .forEach((c) => load.set(c.member_id, load.get(c.member_id)! + 1));

  const items: TodayItem[] = [];
  const sorted = [...chores].sort((a, b) => a.name.localeCompare(b.name));

  for (const chore of sorted) {
    const mine = completions.filter((c) => c.chore_id === chore.id);
    const doneToday = mine.find((c) => c.done_on === today);

    if (doneToday) {
      const who = members.find((m) => m.id === doneToday.member_id) ?? null;
      if (who) load.set(who.id, load.get(who.id)! + 1);
      items.push({ chore, assignee: who, done: true });
      continue;
    }
    if (chore.skipped_on === today) {
      items.push({ chore, assignee: null, done: false, skipped: true });
      continue;
    }

    const last = mine.map((c) => c.done_on).sort().pop();
    const due = !last || daysBetween(last, today) >= chore.every_n_days;
    if (!due) continue;

    // Give it to whoever has the lightest load
    const pick = members.reduce((a, b) =>
      load.get(b.id)! < load.get(a.id)! ? b : a
    );
    load.set(pick.id, load.get(pick.id)! + 1);
    items.push({ chore, assignee: pick, done: false });
  }
  return items;
}

function daysBetween(from: string, to: string) {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}