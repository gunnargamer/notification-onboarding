import { DEFAULT_PREFS } from './defaults'
import type { CategoryId, FlowMode, NotifPrefs, TelemetryEvent } from './types'

export const KEYS = {
  state: 'notif_state',
  os: 'notif_os',
  categories: 'notif_categories',
  channels: 'notif_channels',
  initialOptIn: 'notif_initial_optin',
  events: 'notif_events',
  flowMode: 'notif_flowmode',
} as const

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Load prefs from the split localStorage keys, falling back to defaults. */
export function loadPrefs(): NotifPrefs {
  const categories = {
    ...DEFAULT_PREFS.categories,
    ...readJSON(KEYS.categories, {} as Partial<Record<CategoryId, boolean>>),
  }
  const channels = {
    ...DEFAULT_PREFS.channels,
    ...readJSON(KEYS.channels, {} as NotifPrefs['channels']),
  }
  return {
    state: readJSON(KEYS.state, DEFAULT_PREFS.state),
    osPermission: readJSON(KEYS.os, DEFAULT_PREFS.osPermission),
    initialOptIn: readJSON(KEYS.initialOptIn, DEFAULT_PREFS.initialOptIn),
    categories,
    channels,
  }
}

/** Persist each slice under its own key. */
export function savePrefs(prefs: NotifPrefs): void {
  try {
    localStorage.setItem(KEYS.state, JSON.stringify(prefs.state))
    localStorage.setItem(KEYS.os, JSON.stringify(prefs.osPermission))
    localStorage.setItem(KEYS.categories, JSON.stringify(prefs.categories))
    localStorage.setItem(KEYS.channels, JSON.stringify(prefs.channels))
    localStorage.setItem(KEYS.initialOptIn, JSON.stringify(prefs.initialOptIn))
  } catch {
    // best-effort; prototype only
  }
}

export function loadFlowMode(): FlowMode {
  return readJSON<FlowMode>(KEYS.flowMode, 'v1')
}

export function saveFlowMode(mode: FlowMode): void {
  try {
    localStorage.setItem(KEYS.flowMode, JSON.stringify(mode))
  } catch {
    // best-effort
  }
}

export function loadEvents(): TelemetryEvent[] {
  return readJSON<TelemetryEvent[]>(KEYS.events, [])
}

export function saveEvents(events: TelemetryEvent[]): void {
  try {
    localStorage.setItem(KEYS.events, JSON.stringify(events))
  } catch {
    // best-effort
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(KEYS.state)
    localStorage.removeItem(KEYS.os)
    localStorage.removeItem(KEYS.categories)
    localStorage.removeItem(KEYS.channels)
    localStorage.removeItem(KEYS.initialOptIn)
  } catch {
    // best-effort
  }
}
