import { TelekomLogo } from './TelekomLogo'
import { clearAll } from '../state/persistence'
import { useApp } from '../state/AppContext'

/**
 * Brand splash + login entry. Full-bleed magenta with the centered Telekom logo
 * (Figma node 352:7834) and a CTA that logs in. Every entry via the CTA resets
 * the prototype to a fresh state, so each test participant starts clean, then
 * lands on the notification sheet.
 */
export function Splash() {
  const { dispatch } = useApp()

  function onStart() {
    clearAll()
    dispatch({ type: 'RESET' }) // wipe prefs + event log back to defaults
    dispatch({ type: 'SHOW_SHEET' }) // fresh sheet over the overview
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-primary">
      <TelekomLogo className="absolute left-1/2 top-[32.2%] w-[98px] -translate-x-1/2 text-white" />
      <div className="mt-auto p-6">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex min-h-touch w-full items-center justify-center rounded-pill bg-white px-5 py-3 text-base font-medium text-primary"
        >
          Anmelden und loslegen
        </button>
      </div>
    </div>
  )
}
