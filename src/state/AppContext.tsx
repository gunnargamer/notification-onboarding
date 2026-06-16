import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { reducer, type Action, type AppState } from './reducer'
import { DEFAULT_PREFS } from './defaults'
import type { FlowMode } from './types'
import {
  clearAll,
  loadFlowMode,
  saveEvents,
  saveFlowMode,
  savePrefs,
} from './persistence'

/** Optional ?flow=v1|v2 override for moderators (persisted once set). */
function readFlowOverride(): FlowMode | null {
  try {
    const f = new URLSearchParams(window.location.search).get('flow')
    return f === 'v1' || f === 'v2' ? f : null
  } catch {
    return null
  }
}

/**
 * Every page load starts the prototype fresh — identical to entering via the
 * CTA. We wipe the persisted prefs/events and seed defaults; only the flow mode
 * (chosen via ?flow= or persisted) is kept so moderators stay on their variant.
 */
function init(): AppState {
  clearAll()
  const flowMode = readFlowOverride() ?? loadFlowMode()
  return {
    screen: 'splash',
    prefs: structuredClone(DEFAULT_PREFS),
    events: [],
    flowMode,
  }
}

interface AppContextValue {
  state: AppState
  dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  // Persist prefs and events whenever they change.
  useEffect(() => {
    savePrefs(state.prefs)
  }, [state.prefs])

  useEffect(() => {
    saveEvents(state.events)
  }, [state.events])

  useEffect(() => {
    saveFlowMode(state.flowMode)
  }, [state.flowMode])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
