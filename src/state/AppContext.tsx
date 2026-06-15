import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { reducer, type Action, type AppState } from './reducer'
import type { FlowMode } from './types'
import {
  loadEvents,
  loadFlowMode,
  loadPrefs,
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

function init(): AppState {
  return {
    screen: 'splash',
    prefs: loadPrefs(),
    events: loadEvents(),
    flowMode: readFlowOverride() ?? loadFlowMode(),
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
