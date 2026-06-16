import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Wifi } from 'lucide-react'
import { useApp } from '../state/AppContext'

const SCREEN_W = 390
const SCREEN_H = 844
const BEZEL = 11

/** iOS-style status bar shown inside the device mockup. */
function StatusBar({ light }: { light: boolean }) {
  const color = light ? 'text-white' : 'text-text'
  return (
    <div
      className={`pointer-events-none flex h-[44px] shrink-0 items-center justify-between px-7 pt-1 ${color}`}
      aria-hidden="true"
    >
      <span className="text-[15px] font-semibold tracking-tight">9:41</span>
      <span className="flex items-center gap-1.5">
        {/* cellular bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
          <rect x="4.7" y="5" width="3" height="6" rx="1" />
          <rect x="9.3" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="14" y="0" width="3" height="11" rx="1" />
        </svg>
        <Wifi size={16} strokeWidth={2.4} />
        {/* battery */}
        <span className="flex items-center gap-[1px]">
          <span className="relative flex h-[11px] w-[22px] items-center rounded-[3px] border border-current px-[1.5px]">
            <span className="h-[7px] w-[13px] rounded-[1px] bg-current" />
          </span>
          <span className="h-[4px] w-[1.5px] rounded-r-[1px] bg-current" />
        </span>
      </span>
    </div>
  )
}

/**
 * Renders the prototype inside a realistic iPhone mockup (device bezel, Dynamic
 * Island, status bar) on a dark backdrop. The screen stays a fixed 390×844 so
 * the content never reflows; the whole device is scaled with a transform to fit
 * the available space. Overlays portal into #phone-overlay-root.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { state } = useApp()
  const onSplash = state.screen === 'splash' // full-bleed magenta → light status bar

  const areaRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const area = areaRef.current
    if (!area) return
    const deviceW = SCREEN_W + BEZEL * 2
    const deviceH = SCREEN_H + BEZEL * 2
    const compute = () => {
      const s = Math.min(area.clientWidth / deviceW, area.clientHeight / deviceH, 1)
      setScale(s > 0 ? s : 1)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(area)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={areaRef}
      className="flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#F1F1F1] p-3"
    >
      <div style={{ transform: `scale(${scale})` }} className="shrink-0">
        <div
          id="phone-frame"
          style={{ width: SCREEN_W + BEZEL * 2, height: SCREEN_H + BEZEL * 2 }}
          className="relative overflow-hidden rounded-[54px] border-[11px] border-black bg-black shadow-2xl"
        >
          {/* Screen */}
          <div
            className={`relative flex h-full w-full flex-col overflow-hidden rounded-[44px] ${
              onSplash ? 'bg-primary' : 'bg-surface'
            }`}
          >
            <StatusBar light={onSplash} />

            {/* Dynamic Island */}
            <div
              className="absolute left-1/2 top-2 z-40 h-[26px] w-[105px] -translate-x-1/2 rounded-full bg-black"
              aria-hidden="true"
            />

            <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>

            {/* Overlays render here, clipped to the screen. */}
            <div id="phone-overlay-root" className="pointer-events-none absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
