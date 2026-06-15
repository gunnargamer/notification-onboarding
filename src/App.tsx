import { useState } from 'react'
import { createPortal } from 'react-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { Login } from './components/Login'
import { Overview } from './components/Overview'
import { Settings } from './components/Settings'
import { Sheet } from './components/Sheet'
import { OSDialog } from './components/OSDialog'
import { DebugPanel } from './components/DebugPanel'
import { usePortalRoot } from './components/usePortalRoot'
import { useApp } from './state/AppContext'

export default function App() {
  const { state } = useApp()
  const overlayRoot = usePortalRoot()
  const [debugOpen, setDebugOpen] = useState(false)

  const { screen } = state
  const overlayActive = screen === 'sheet' || screen === 'os-dialog'

  // The sheet and OS dialog render over the overview (real app behavior).
  const base =
    screen === 'login' ? (
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
          <DebugPanel open={debugOpen} onOpenChange={setDebugOpen} />,
          overlayRoot,
        )}
    </PhoneFrame>
  )
}
