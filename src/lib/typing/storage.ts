import type { TestMode } from "./words";

/**
 * Personal bests, kept in localStorage.
 *
 * Records are scoped per mode and per setting, so a 15-second best is never
 * compared against a 60-second one.
 */

const KEY_PREFIX = "microtool.typing.pb.";

export interface PersonalBest {
  wpm: number;
  accuracy: number;
  /** ISO date the record was set. */
  date: string;
}

function keyFor(mode: TestMode, setting: string | number): string {
  return `${KEY_PREFIX}${mode}.${setting}`;
}

export function readPersonalBest(
  mode: TestMode,
  setting: string | number,
): PersonalBest | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(keyFor(mode, setting));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersonalBest>;
    if (typeof parsed.wpm !== "number" || typeof parsed.accuracy !== "number") {
      return null;
    }

    return {
      wpm: parsed.wpm,
      accuracy: parsed.accuracy,
      date: parsed.date ?? "",
    };
  } catch {
    // Storage can be unavailable in private mode, or the value corrupted.
    return null;
  }
}

/**
 * Snapshot cache backing `useSyncExternalStore`.
 *
 * Reading localStorage during render would produce a different value on the
 * server than the client. Going through a cached snapshot with a null server
 * value keeps hydration consistent and gives React a stable object identity.
 */
const snapshots = new Map<string, PersonalBest | null>();
const listeners = new Set<() => void>();

export function subscribeToPersonalBests(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getPersonalBestSnapshot(
  mode: TestMode,
  setting: string | number,
): PersonalBest | null {
  const key = keyFor(mode, setting);
  if (!snapshots.has(key)) {
    snapshots.set(key, readPersonalBest(mode, setting));
  }
  return snapshots.get(key) ?? null;
}

/** The server has no localStorage, so it always sees "no record yet". */
export function getPersonalBestServerSnapshot(): PersonalBest | null {
  return null;
}

/** Saves the result when it beats the stored record. Returns true if it did. */
export function savePersonalBest(
  mode: TestMode,
  setting: string | number,
  result: { wpm: number; accuracy: number },
): boolean {
  if (typeof window === "undefined") return false;

  const existing = readPersonalBest(mode, setting);
  if (existing && existing.wpm >= result.wpm) return false;

  try {
    const record: PersonalBest = {
      wpm: result.wpm,
      accuracy: result.accuracy,
      date: new Date().toISOString().slice(0, 10),
    };

    window.localStorage.setItem(keyFor(mode, setting), JSON.stringify(record));
    snapshots.set(keyFor(mode, setting), record);
    listeners.forEach((listener) => listener());
    return true;
  } catch {
    return false;
  }
}

export function clearPersonalBests(): void {
  if (typeof window === "undefined") return;

  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(KEY_PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
    snapshots.clear();
    listeners.forEach((listener) => listener());
  } catch {
    // Nothing to do — clearing is best-effort.
  }
}
