import { Bug, X } from 'lucide-react'
import { clearAll } from '../state/persistence'
import { useApp } from '../state/AppContext'
import type { OsPermission } from '../state/types'

function fmtTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString('de-DE', { hour12: false })
  } catch {
    return String(ts)
  }
}

const OS_OPTIONS: OsPermission[] = ['unset', 'granted', 'denied']

export function DebugPanel({
  open,
  onOpenChange,
  launcherHidden = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Hide the floating launcher while an overlay (sheet/dialog) is on top. */
  launcherHidden?: boolean
}) {
  const { state, dispatch } = useApp()

  if (!open) {
    if (launcherHidden) return null
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        aria-label="Debug-Panel öffnen"
        className="pointer-events-auto absolute bottom-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-yellow-500 bg-yellow-100 text-yellow-900 shadow"
      >
        <Bug size={20} aria-hidden="true" />
      </button>
    )
  }

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex flex-col bg-white font-mono text-[12px] text-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-yellow-100 px-4 py-3">
        <span className="font-bold">Debug-Panel (nicht Teil des Designs)</span>
        <button
          type="button"
          aria-label="Debug-Panel schließen"
          onClick={() => onOpenChange(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <section>
          <h2 className="mb-2 font-bold uppercase tracking-wide text-zinc-500">
            Aktionen
          </h2>
          <button
            type="button"
            onClick={() => {
              clearAll()
              dispatch({ type: 'RESET' })
              onOpenChange(false)
            }}
            className="w-full rounded border border-zinc-300 px-3 py-2 text-left hover:bg-zinc-50"
          >
            Reset all state (→ unset)
          </button>
        </section>

        <section>
          <h2 className="mb-2 font-bold uppercase tracking-wide text-zinc-500">
            Force osPermission
          </h2>
          <div className="flex gap-2">
            {OS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => dispatch({ type: 'FORCE_OS', value: opt })}
                className={[
                  'flex-1 rounded border px-2 py-2',
                  state.prefs.osPermission === opt
                    ? 'border-zinc-800 bg-zinc-800 text-white'
                    : 'border-zinc-300 hover:bg-zinc-50',
                ].join(' ')}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-bold uppercase tracking-wide text-zinc-500">
            Current state
          </h2>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-zinc-100 p-3">
            {JSON.stringify(
              { screen: state.screen, ...state.prefs },
              null,
              2,
            )}
          </pre>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold uppercase tracking-wide text-zinc-500">
              Event log ({state.events.length})
            </h2>
            <button
              type="button"
              onClick={() => dispatch({ type: 'CLEAR_EVENTS' })}
              className="rounded border border-zinc-300 px-2 py-1 hover:bg-zinc-50"
            >
              Clear
            </button>
          </div>
          {state.events.length === 0 ? (
            <p className="text-zinc-400">Keine Events.</p>
          ) : (
            <ol className="space-y-1">
              {state.events.map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-zinc-400">{fmtTime(e.ts)}</span>
                  <span className="font-bold">{e.name}</span>
                  {e.detail && (
                    <span className="text-zinc-500">
                      {JSON.stringify(e.detail)}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}
