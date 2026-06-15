import { useEffect, useRef } from 'react'
import { useApp } from '../state/AppContext'

/**
 * iOS-style permission alert rendered on top of the sheet (which stays visible
 * behind, mirroring real OS behavior).
 */
export function OSDialog() {
  const { dispatch } = useApp()
  const dialogRef = useRef<HTMLDivElement>(null)
  const allowRef = useRef<HTMLButtonElement>(null)
  const titleId = 'os-dialog-title'
  const bodyId = 'os-dialog-body'

  useEffect(() => {
    allowRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const panel = dialogRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>('button:not([disabled])')
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

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-10">
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="relative w-full max-w-[270px] overflow-hidden rounded-[14px] bg-white/95 text-center backdrop-blur"
      >
        <div className="px-4 pb-4 pt-5">
          <h2 id={titleId} className="text-[17px] font-semibold text-text">
            OneApp möchte Ihnen Mitteilungen senden
          </h2>
          <p id={bodyId} className="mt-1 text-[13px] leading-snug text-text">
            Mitteilungen können Hinweise, Töne und Kennzeichen enthalten. Sie
            können das in den Einstellungen anpassen.
          </p>
        </div>
        <div className="grid grid-cols-2 border-t border-black/10 divide-x divide-black/10">
          <button
            type="button"
            onClick={() => dispatch({ type: 'OS_DENY' })}
            className="px-3 py-3 text-[17px] text-[color:var(--color-primary)]"
          >
            Nicht erlauben
          </button>
          <button
            ref={allowRef}
            type="button"
            onClick={() => dispatch({ type: 'OS_ALLOW' })}
            className="px-3 py-3 text-[17px] font-semibold text-[color:var(--color-primary)]"
          >
            Erlauben
          </button>
        </div>
      </div>
    </div>
  )
}
