import { TelekomLogo } from './TelekomLogo'
import { useApp } from '../state/AppContext'

/**
 * Brand splash + login entry. Full-bleed magenta with the centered Telekom logo
 * (Figma node 352:7834) and a CTA that logs the user in: first-time users land
 * on the notification sheet (over the overview), returning users go straight to
 * the overview.
 */
export function Splash() {
  const { state, dispatch } = useApp()

  function onStart() {
    if (state.prefs.state === 'unset') {
      dispatch({ type: 'SHOW_SHEET' }) // sheet over the overview
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'overview' })
    }
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
          Get started and login
        </button>
      </div>
    </div>
  )
}
