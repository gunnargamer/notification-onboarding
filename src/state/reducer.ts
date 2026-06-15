import { DEFAULT_PREFS } from './defaults'
import { CATEGORIES } from './catalog'
import type {
  CategoryId,
  Channel,
  NotifPrefs,
  OsPermission,
  Screen,
  TelemetryEvent,
  TelemetryEventName,
} from './types'

export interface AppState {
  screen: Screen
  prefs: NotifPrefs
  events: TelemetryEvent[]
}

export type Action =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SHOW_SHEET' }
  | { type: 'TOGGLE_CATEGORY'; id: CategoryId }
  | { type: 'ENABLE' }
  | { type: 'LATER'; via: 'button' | 'drag' }
  | { type: 'OS_ALLOW' }
  | { type: 'OS_DENY' }
  | { type: 'MASTER_TOGGLE'; id: CategoryId }
  | { type: 'CHANNEL_TOGGLE'; id: CategoryId; channel: Channel }
  | { type: 'LOG'; name: TelemetryEventName; detail?: Record<string, unknown> }
  | { type: 'FORCE_OS'; value: OsPermission }
  | { type: 'RESET' }
  | { type: 'CLEAR_EVENTS' }

function log(
  state: AppState,
  name: TelemetryEventName,
  detail?: Record<string, unknown>,
): TelemetryEvent[] {
  // Append-only; array order is the authoritative interaction order.
  return [...state.events, { name, ts: Date.now(), detail }]
}

/** Number of channels currently active for a category. */
export function activeChannelCount(prefs: NotifPrefs, id: CategoryId): number {
  return Object.values(prefs.channels[id]).filter(Boolean).length
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }

    case 'SHOW_SHEET':
      return {
        ...state,
        screen: 'sheet',
        events: log(state, 'impression'),
      }

    case 'TOGGLE_CATEGORY': {
      // Security is locked and can never be toggled off.
      if (CATEGORIES[action.id].locked) return state
      const next = !state.prefs.categories[action.id]
      return {
        ...state,
        prefs: {
          ...state.prefs,
          categories: { ...state.prefs.categories, [action.id]: next },
        },
        events: log(state, 'category_toggle', { id: action.id, value: next }),
      }
    }

    case 'ENABLE':
      return {
        ...state,
        screen: 'os-dialog',
        events: log(state, 'enable'),
      }

    case 'LATER':
      return {
        ...state,
        screen: 'overview',
        prefs: { ...state.prefs, state: 'postponed' },
        events: log(state, 'later', { via: action.via }),
      }

    case 'OS_ALLOW':
      return {
        ...state,
        screen: 'overview',
        prefs: { ...state.prefs, state: 'enabled', osPermission: 'granted' },
        events: log(state, 'os_allow'),
      }

    case 'OS_DENY':
      return {
        ...state,
        screen: 'overview',
        prefs: { ...state.prefs, state: 'declined', osPermission: 'denied' },
        events: log(state, 'os_deny'),
      }

    case 'MASTER_TOGGLE': {
      // Security master can never be disabled.
      if (CATEGORIES[action.id].locked) return state
      const next = !state.prefs.categories[action.id]
      return {
        ...state,
        prefs: {
          ...state.prefs,
          categories: { ...state.prefs.categories, [action.id]: next },
        },
        events: log(state, 'settings_master_toggle', {
          id: action.id,
          value: next,
        }),
      }
    }

    case 'CHANNEL_TOGGLE': {
      const current = state.prefs.channels[action.id][action.channel]
      const next = !current
      // Security must always keep at least one channel active.
      if (
        CATEGORIES[action.id].locked &&
        !next &&
        activeChannelCount(state.prefs, action.id) <= 1
      ) {
        return state // rejected; component shows the inline hint
      }
      return {
        ...state,
        prefs: {
          ...state.prefs,
          channels: {
            ...state.prefs.channels,
            [action.id]: {
              ...state.prefs.channels[action.id],
              [action.channel]: next,
            },
          },
        },
        events: log(state, 'settings_channel_toggle', {
          id: action.id,
          channel: action.channel,
          value: next,
        }),
      }
    }

    case 'LOG':
      return { ...state, events: log(state, action.name, action.detail) }

    case 'FORCE_OS':
      return {
        ...state,
        prefs: { ...state.prefs, osPermission: action.value },
      }

    case 'RESET':
      return {
        screen: 'login',
        prefs: {
          ...DEFAULT_PREFS,
          categories: { ...DEFAULT_PREFS.categories },
          channels: {
            billing: { ...DEFAULT_PREFS.channels.billing },
            service: { ...DEFAULT_PREFS.channels.service },
            system: { ...DEFAULT_PREFS.channels.system },
            security: { ...DEFAULT_PREFS.channels.security },
            offers: { ...DEFAULT_PREFS.channels.offers },
          },
        },
        events: [],
      }

    case 'CLEAR_EVENTS':
      return { ...state, events: [] }

    default:
      return state
  }
}
