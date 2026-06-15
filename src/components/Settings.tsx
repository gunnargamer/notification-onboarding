import { ArrowLeft } from 'lucide-react'
import { CATEGORY_ORDER } from '../state/defaults'
import { CategoryCard } from './CategoryCard'
import { useApp } from '../state/AppContext'

export function Settings({ onOpenDeviceSettings }: { onOpenDeviceSettings: () => void }) {
  const { state, dispatch } = useApp()
  const denied = state.prefs.osPermission === 'denied'

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-black/5 px-2 py-3">
        <button
          type="button"
          aria-label="Zurück"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'overview' })}
          className="flex h-touch w-touch items-center justify-center rounded-full text-text"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="text-[20px] font-bold text-text">Benachrichtigungen</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <p className="text-sm text-text-secondary">
          Legen Sie fest, worüber und wie wir Sie informieren.
        </p>

        {denied && (
          <div className="mt-4 rounded-2xl bg-card p-4">
            <p className="text-base font-bold text-text">
              Push-Benachrichtigungen sind auf diesem Gerät deaktiviert.
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'LOG', name: 'os_banner_tap' })
                onOpenDeviceSettings()
              }}
              className="mt-3 inline-flex min-h-touch items-center rounded-pill bg-white px-4 py-2 text-base font-medium text-text"
            >
              Einstellungen öffnen
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {CATEGORY_ORDER.map((id) => (
            <CategoryCard key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  )
}
