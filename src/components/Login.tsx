import { Button } from './ui/Button'
import { useApp } from '../state/AppContext'

export function Login() {
  const { state, dispatch } = useApp()

  function onLogin() {
    if (state.prefs.state === 'unset') {
      dispatch({ type: 'SHOW_SHEET' }) // sheet over the overview
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'overview' })
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-between px-6 py-16">
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Telekom-style wordmark placeholder. */}
        <div className="flex items-end gap-2" aria-label="Telekom">
          <span className="text-[28px] font-bold tracking-tight text-text">
            MagentaSERVICE
          </span>
          <span className="mb-1 flex gap-1" aria-hidden="true">
            <span className="h-3 w-3 rounded-[2px] bg-primary" />
            <span className="h-3 w-3 rounded-[2px] bg-primary" />
            <span className="h-3 w-3 rounded-[2px] bg-primary" />
          </span>
        </div>
        <p className="mt-3 text-base text-text-secondary">Ihr Telekom Konto</p>
      </div>
      <Button className="w-full" onClick={onLogin}>
        Anmelden
      </Button>
    </div>
  )
}
