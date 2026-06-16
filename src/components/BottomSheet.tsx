import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft } from 'lucide-react'
import { usePortalRoot } from './usePortalRoot'

/**
 * Reusable bottom sheet: dimmed overlay + slide-up panel, portalled into the
 * device frame so it stays clipped to the phone. Overlay and panel are siblings
 * (not nested) so an overlay tap closes without the panel catching the click.
 */
export function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const root = usePortalRoot()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!root) return null

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-50">
      {/* Dimmed overlay — tap closes */}
      <div
        onClick={onClose}
        className="animate-sheet-fade absolute inset-0 bg-black/[0.38]"
        aria-hidden="true"
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet-up absolute inset-x-0 bottom-0 z-[51] flex max-h-[92%] flex-col overflow-hidden rounded-t-[24px] bg-surface"
      >
        {/* Drag handle */}
        <div className="flex justify-center pb-1.5 pt-3">
          <span className="h-1 w-9 rounded-full bg-black/15" aria-hidden="true" />
        </div>
        {/* Header */}
        <div className="flex items-center px-3.5 pb-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zurück"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text"
          >
            <ArrowLeft size={22} aria-hidden="true" />
          </button>
          <h2 className="flex-1 text-center text-[18px] font-bold text-text">
            {title}
          </h2>
          <span className="w-10" aria-hidden="true" />
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-10">{children}</div>
      </div>
    </div>,
    root,
  )
}
