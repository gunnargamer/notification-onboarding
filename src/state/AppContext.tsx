import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { reducer, type Action, type AppState } from './reducer'
import { loadEvents, loadPrefs, saveEvents, savePrefs } from './persistence'

function init(): AppState {
  return {
    screen: 'login',
    prefs: loadPrefs(),
    events: loadEvents(),
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
