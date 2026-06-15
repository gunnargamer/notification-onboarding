import { ArrowRight, House, MessageCircleQuestion, Sparkles } from 'lucide-react'
import { useApp } from '../state/AppContext'
import avatarUrl from '../assets/home/avatar.jpg'
import iphoneUrl from '../assets/home/iphone.png'
import promoUrl from '../assets/home/promo.png'
import m1Url from '../assets/home/magentaone.svg'

const SEGMENTS = ['Mobile', 'Internet', 'TV'] as const

/**
 * MeinMagenta-style home (Figma node 321:17657), in German.
 * Two prototype hooks are preserved:
 *  - avatar (top-right, with notification badge) → notification Settings
 *  - "Rechnungen verwalten" card → contextual sheet (V2: fires while `unset`)
 */
export function Overview() {
  const { state, dispatch } = useApp()
  const contextualTrigger = state.prefs.state === 'unset'

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Header */}
      <header className="flex items-start gap-2 px-4 pt-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-4">
          <p className="text-[20px] leading-tight text-text">Willkommen zurück,</p>
          <p className="text-[32px] font-bold leading-tight text-text">Annabelle!</p>
        </div>
        <button
          type="button"
          aria-label="Benachrichtigungseinstellungen"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'settings' })}
          className="relative mt-2 h-12 w-12 shrink-0"
        >
          <img
            src={avatarUrl}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="absolute -top-0.5 left-9 flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full bg-primary px-1 text-sm font-bold text-white">
            1
          </span>
        </button>
      </header>

      {/* Segmented control (Mobile active) */}
      <div className="px-2 pb-4">
        <div className="flex gap-1 rounded-full bg-card p-1">
          {SEGMENTS.map((seg, i) => (
            <div
              key={seg}
              className={[
                'flex min-h-[56px] flex-1 items-center justify-center rounded-full px-2 text-base font-bold',
                i === 0 ? 'bg-primary text-white' : 'text-text',
              ].join(' ')}
            >
              {seg}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 pb-4">
        {/* Tariff card */}
        <div className="relative h-[202px] overflow-hidden rounded-2xl bg-card p-6">
          <img
            src={m1Url}
            alt="MagentaEINS"
            className="absolute right-4 top-5 h-6 w-6"
          />
          <img
            src={iphoneUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 right-2 w-[150px]"
          />
          <p className="text-[22px] text-text">+49 151 222 2222</p>
          <p className="mt-1 text-base font-bold text-text-secondary">
            MagentaMobil PlusKarte
          </p>
          <div className="mt-4 h-2 w-14 overflow-hidden rounded-full bg-black/15">
            <div className="h-full w-1/2 rounded-full bg-text" />
          </div>
        </div>

        {/* Manage bills — contextual trigger */}
        <button
          type="button"
          onClick={() => contextualTrigger && dispatch({ type: 'SHOW_SHEET' })}
          className="flex items-center gap-6 rounded-2xl bg-card py-6 pl-6 pr-8 text-left"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-[20px] text-text">Rechnungen verwalten</p>
              <p className="text-base font-bold text-text">
                Rechnungskonto 483 348 491 48
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-md bg-surface px-2 py-1 text-base font-bold text-text">
              MagentaEINS
            </span>
          </div>
          <ArrowRight size={16} className="shrink-0 text-text" aria-hidden="true" />
        </button>

        {/* Promo banner */}
        <div>
          <div className="relative flex h-[120px] items-center overflow-hidden rounded-2xl bg-banner py-3 pl-6 pr-[144px]">
            <p className="text-base font-bold leading-tight text-text">
              Neues Apple iPhone 16 mit drei Kameras und frischen Farben. Jetzt im
              Shop ausprobieren und direkt in der App bestellen.
            </p>
            <img
              src={promoUrl}
              alt=""
              aria-hidden="true"
              className="absolute right-0 top-0 h-full w-[120px] object-cover"
            />
          </div>
          {/* Carousel dots */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={[
                  'h-2 w-2 rounded-full',
                  i === 0 ? 'bg-text' : 'border border-text-secondary',
                ].join(' ')}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="flex border-t border-black/10 bg-surface">
        {[
          { icon: House, label: 'Start', active: true },
          { icon: Sparkles, label: 'Momente', active: false },
          { icon: MessageCircleQuestion, label: 'Hilfe', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-1 pb-4 pt-3',
              active ? 'text-primary' : 'text-text-secondary',
            ].join(' ')}
          >
            <Icon size={20} aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}
