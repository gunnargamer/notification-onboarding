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
  // The OS prompt can come from the onboarding sheet or from a first opt-in in
  // Settings — in the latter case it overlays Settings, with no sheet behind.
  const osFromSettings = screen === 'os-dialog' && state.osPromptFrom === 'settings'

  // Splash is the login entry; the sheet and OS dialog render over the overview.
  const base =
    screen === 'splash' ? (
      <Splash />
    ) : screen === 'settings' || osFromSettings ? (
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
            {!osFromSettings && <Sheet />}
            {screen === 'os-dialog' && <OSDialog />}
          </>,
          overlayRoot,
        )}
    </PhoneFrame>
  )
}
