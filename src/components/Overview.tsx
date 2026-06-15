import { FileText, Gauge, Settings as SettingsIcon } from 'lucide-react'
import { useApp } from '../state/AppContext'

const SERVICE_CARDS = [
  {
    icon: FileText,
    title: 'Rechnung',
    subline: 'Aktuelle Rechnung: 42,99 €',
  },
  {
    icon: Gauge,
    title: 'Datenverbrauch',
    subline: '7,2 von 10 GB verbraucht',
  },
]

export function Overview() {
  const { dispatch } = useApp()

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <div>
          <p className="text-sm text-text-secondary">Willkommen zurück</p>
          <h1 className="text-[20px] font-bold text-text">Guten Tag</h1>
        </div>
        <button
          type="button"
          aria-label="Einstellungen"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'settings' })}
          className="flex h-touch w-touch items-center justify-center rounded-full text-text"
        >
          <SettingsIcon size={22} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pb-8 pt-3">
        {SERVICE_CARDS.map(({ icon: Icon, title, subline }) => (
          <div key={title} className="flex items-center gap-3 rounded-2xl bg-card p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-text">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-medium text-text">{title}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{subline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
