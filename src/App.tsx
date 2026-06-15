import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { Splash } from './components/Splash'
import { Login } from './components/Login'
import { Overview } from './components/Overview'
import { Settings } from './components/Settings'
import { Sheet } from './components/Sheet'
import { OSDialog } from './components/OSDialog'
import { DebugPanel } from './components/DebugPanel'
import { usePortalRoot } from './components/usePortalRoot'
import { useApp } from './state/AppContext'

const SPLASH_DURATION_MS = 1800

export default function App() {
  const { state, dispatch } = useApp()
  const overlayRoot = usePortalRoot()
  const [debugOpen, setDebugOpen] = useState(false)

  const { screen } = state
  const overlayActive = screen === 'sheet' || screen === 'os-dialog'

  // Auto-advance the launch splash to the login screen (tap skips it sooner).
  useEffect(() => {
    if (screen !== 'splash') return
    const t = setTimeout(
      () => dispatch({ type: 'SET_SCREEN', screen: 'login' }),
      SPLASH_DURATION_MS,
    )
    return () => clearTimeout(t)
  }, [screen, dispatch])

  // The sheet and OS dialog render over the overview (real app behavior).
  const base =
    screen === 'splash' ? (
      <Splash onDone={() => dispatch({ type: 'SET_SCREEN', screen: 'login' })} />
    ) : screen === 'login' ? (
      <Login />
    ) : screen === 'settings' ? (
      <Settings onOpenDeviceSettings={() => setDebugOpen(true)} />
    ) : (
      <Overview />
    )

  return (
    <PhoneFrame>
      {base}

      {overlayRoot &&
        overlayActive &&
        createPortal(
          <>
            <Sheet />
            {screen === 'os-dialog' && <OSDialog />}
          </>,
          overlayRoot,
        )}

      {overlayRoot &&
        createPortal(
          <DebugPanel
            open={debugOpen}
            onOpenChange={setDebugOpen}
            launcherHidden={overlayActive || screen === 'splash'}
          />,
          overlayRoot,
        )}
    </PhoneFrame>
  )
}
