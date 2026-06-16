import { ArrowLeft, Check } from 'lucide-react'
import { CATEGORY_ORDER } from '../state/defaults'
import { CATEGORIES } from '../state/catalog'
import { CategoryCard } from './CategoryCard'
import { useApp } from '../state/AppContext'

export function Settings() {
  const { state, dispatch } = useApp()
  const denied = state.prefs.osPermission === 'denied'

  // Live summary of the currently enabled (non-locked) categories — updates in
  // realtime as the user flips the toggles below.
  const activeTitles = CATEGORY_ORDER.filter(
    (id) => !CATEGORIES[id].locked && state.prefs.categories[id],
  ).map((id) => CATEGORIES[id].title)

  function handleBack() {
    // Leaving Settings with a category enabled but no OS permission yet → the
    // system prompt appears (first opt-in). Otherwise just go back.
    const hasSelection = CATEGORY_ORDER.some(
      (id) => !CATEGORIES[id].locked && state.prefs.categories[id],
    )
    if (hasSelection && state.prefs.osPermission === 'unset') {
      dispatch({ type: 'SETTINGS_REQUEST_OS' })
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'overview' })
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-black/5 px-2 py-3">
        <button
          type="button"
          aria-label="Zurück"
          onClick={handleBack}
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

        {activeTitles.length > 0 && (
          <div className="mt-4 rounded-2xl bg-card p-4">
            <p className="text-sm font-bold text-text">Aktuell ausgewählt</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {activeTitles.map((title) => (
                <li
                  key={title}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <Check
                    size={16}
                    className="shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {denied && (
          <div className="mt-4 rounded-2xl bg-card p-4">
            <p className="text-base font-bold text-text">
              Push-Benachrichtigungen sind auf diesem Gerät deaktiviert.
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: 'LOG', name: 'os_banner_tap' })}
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
