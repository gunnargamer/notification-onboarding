import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { CATEGORY_ORDER } from '../state/defaults'
import { CATEGORIES } from '../state/catalog'
import { CATEGORY_ICON } from './categoryIcons'
import { Toggle } from './ui/Toggle'
import { Button } from './ui/Button'
import { useApp } from '../state/AppContext'

const DRAG_DISMISS_THRESHOLD = 110 // px past which release = „Später"

export function Sheet() {
  const { state, dispatch } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = 'sheet-title'

  const [entered, setEntered] = useState(false)
  const [drag, setDrag] = useState(0)
  const dragging = useRef(false)
  const startY = useRef(0)

  // Slide up on mount.
  useEffect(() => {
    const r = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(r)
  }, [])

  // Move focus into the sheet; trap Tab; Escape is intentionally inert.
  useEffect(() => {
    panelRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault() // accidental-dismiss protection
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true
    startY.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    setDrag(Math.max(0, e.clientY - startY.current))
  }
  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    if (drag > DRAG_DISMISS_THRESHOLD) {
      dispatch({ type: 'LATER', via: 'drag' })
    } else {
      setDrag(0) // snap back
    }
  }

  const translateY = entered ? drag : 9999

  return (
    <div className="pointer-events-auto absolute inset-0 z-30">
      {/* Dim backdrop — tap does nothing (accidental-dismiss protection). */}
      <div
        className="absolute inset-0 bg-backdrop transition-opacity duration-200"
        style={{ opacity: entered ? 1 : 0 }}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex max-h-[72%] flex-col rounded-t-sheet bg-surface outline-none"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging.current ? 'none' : 'transform 250ms ease-out',
        }}
      >
        {/* Interactive drag handle. */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="button"
          aria-label="Nach unten ziehen, um später zu entscheiden"
          tabIndex={0}
          className="flex cursor-grab touch-none justify-center pb-2 pt-3 active:cursor-grabbing"
        >
          <span className="h-1 w-10 rounded-full bg-black/20" aria-hidden="true" />
        </div>

        <div className="px-5">
          <h2 id={titleId} className="text-center text-[20px] font-bold text-text">
            Benachrichtigungen
          </h2>
          <p className="mt-1 text-center text-base text-text-secondary">
            Wählen Sie, worüber wir Sie informieren.
          </p>
        </div>

        {/* Category rows. */}
        <div className="mt-3 flex-1 overflow-y-auto px-5">
          <ul className="divide-y divide-black/5">
            {CATEGORY_ORDER.map((id) => {
              const meta = CATEGORIES[id]
              const Icon = CATEGORY_ICON[id]
              const checked = state.prefs.categories[id]
              return (
                <li key={id} className="flex items-center gap-3 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-text">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-base font-medium text-text">
                      {meta.locked && (
                        <Lock size={14} className="text-text-secondary" aria-hidden="true" />
                      )}
                      <span>{meta.title}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-text-secondary">
                      {meta.scenario}
                    </p>
                  </div>
                  {meta.locked ? (
                    <span className="shrink-0 rounded-full bg-card px-3 py-1 text-sm text-text-secondary">
                      Immer aktiv
                    </span>
                  ) : (
                    <Toggle
                      checked={checked}
                      onChange={() => dispatch({ type: 'TOGGLE_CATEGORY', id })}
                      label={`${meta.title} benachrichtigen`}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Reassurance + footer. */}
        <div className="border-t border-black/5 px-5 pb-5 pt-3">
          <p className="text-sm text-text-secondary">
            Sie können das jederzeit in den Einstellungen ändern.
          </p>
          <div className="mt-3 flex justify-end gap-button-gap">
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'LATER', via: 'button' })}
            >
              Später
            </Button>
            <Button onClick={() => dispatch({ type: 'ENABLE' })}>
              Benachrichtigungen aktivieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
