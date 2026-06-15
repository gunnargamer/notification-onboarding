import { createPortal } from 'react-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { Splash } from './components/Splash'
import { Overview } from './components/Overview'
import { Settings } from './components/Settings'
import { Sheet } from './components/Sheet'
import { OSDialog } from './components/OSDialog'
import { usePortalRoot } from './components/usePortalRoot'
import { useApp } from './state/AppContext'

export default function App() {
  const { state } = useApp()
  const overlayRoot = usePortalRoot()

  const { screen } = state
  const overlayActive = screen === 'sheet' || screen === 'os-dialog'

  // Splash is the login entry; the sheet and OS dialog render over the overview.
  const base =
    screen === 'splash' ? (
      <Splash />
    ) : screen === 'settings' ? (
      <Settings />
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
    </PhoneFrame>
  )
}
