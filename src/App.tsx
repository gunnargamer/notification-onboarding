import { createPortal } from 'react-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { Sheet } from './components/Sheet'
import { OSDialog } from './components/OSDialog'
import { usePortalRoot } from './components/usePortalRoot'
import { useApp } from './state/AppContext'

export default function App() {
  const { state, dispatch } = useApp()
  const overlayRoot = usePortalRoot()

  return (
    <PhoneFrame>
      {/* Temporary scaffold screen — real login/overview land in step 4. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-text-secondary">
        <p>screen: {state.screen}</p>
        <button
          type="button"
          className="rounded-pill bg-primary px-5 py-3 text-white"
          onClick={() => dispatch({ type: 'SHOW_SHEET' })}
        >
          Sheet öffnen (dev)
        </button>
      </div>

      {overlayRoot &&
        (state.screen === 'sheet' || state.screen === 'os-dialog') &&
        createPortal(
          <>
            <Sheet />
            {state.screen === 'os-dialog' && <OSDialog />}
          </>,
          overlayRoot,
        )}
    </PhoneFrame>
  )
}
