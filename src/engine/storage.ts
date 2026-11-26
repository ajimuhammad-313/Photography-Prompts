import { DEFAULT_SETTINGS } from '../data/catalog';
import { SavedPromptItem, StudioSettings } from '../types/photography';

const KEYS = {
  favorites: 'lenscraft_favorites_v1',
  history: 'lenscraft_history_v1',
  settings: 'lenscraft_settings_v1',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function loadFavorites(): SavedPromptItem[] {
  return safeRead<SavedPromptItem[]>(KEYS.favorites, []);
}

export function saveFavorites(items: SavedPromptItem[]): void {
  safeWrite(KEYS.favorites, items);
}

export function loadHistory(): SavedPromptItem[] {
  return safeRead<SavedPromptItem[]>(KEYS.history, []);
}

export function saveHistory(items: SavedPromptItem[]): void {
  safeWrite(KEYS.history, items.slice(0, 40));
}

export function loadSettings(): StudioSettings {
  const loaded = safeRead<Partial<StudioSettings>>(KEYS.settings, {});
  return { ...DEFAULT_SETTINGS, ...loaded };
}

export function saveSettings(settings: StudioSettings): void {
  safeWrite(KEYS.settings, settings);
}

export function clearAllStoredPrompts(): void {
  safeWrite(KEYS.favorites, []);
  safeWrite(KEYS.history, []);
}
