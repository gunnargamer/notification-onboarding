import { TelekomLogo } from './TelekomLogo'

/**
 * Brand splash shown on launch. Full-bleed magenta with the centered Telekom
 * logo, matching the Figma design (node 352:7834): logo 98px wide, sitting at
 * ~32% from the top. The whole surface is tappable to skip ahead.
 */
export function Splash({ onDone }: { onDone: () => void }) {
  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Weiter zur Anmeldung"
      className="relative h-full w-full bg-primary"
    >
      <TelekomLogo className="absolute left-1/2 top-[32.2%] w-[98px] -translate-x-1/2 text-white" />
    </button>
  )
}
