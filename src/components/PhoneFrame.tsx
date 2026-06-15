import type { ReactNode } from 'react'

/**
 * Centers the prototype inside a 390px phone frame on desktop.
 * Overlays (sheet, OS dialog, debug panel) portal into #phone-overlay-root so
 * they are clipped to the frame rather than the full viewport.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center sm:py-6">
      <div
        id="phone-frame"
        className="relative flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-surface sm:h-[844px] sm:rounded-[44px] sm:border sm:border-black/10 sm:shadow-xl"
      >
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
        {/* Overlays render here, clipped to the frame. */}
        <div id="phone-overlay-root" className="pointer-events-none absolute inset-0" />
      </div>
    </div>
  )
}
