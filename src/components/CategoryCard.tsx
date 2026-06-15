import { useEffect, useState } from 'react'
import { ChevronDown, Lock } from 'lucide-react'
import { CHANNEL_ORDER } from '../state/defaults'
import { CATEGORIES, CHANNEL_LABELS } from '../state/catalog'
import { CHANNEL_ICON } from './categoryIcons'
import { Toggle } from './ui/Toggle'
import { useApp } from '../state/AppContext'
import { activeChannelCount } from '../state/reducer'
import type { CategoryId, Channel } from '../state/types'

export function CategoryCard({ id }: { id: CategoryId }) {
  const { state, dispatch } = useApp()
  const meta = CATEGORIES[id]
  const locked = !!meta.locked
  const masterOn = locked || state.prefs.categories[id]
  const channels = state.prefs.channels[id]
  const denied = state.prefs.osPermission === 'denied'

  const [expanded, setExpanded] = useState(false)
  const [hintChannel, setHintChannel] = useState<Channel | null>(null)
  const panelId = `card-panel-${id}`

  // Auto-clear the "last channel" hint after a moment.
  useEffect(() => {
    if (!hintChannel) return
    const t = setTimeout(() => setHintChannel(null), 2400)
    return () => clearTimeout(t)
  }, [hintChannel])

  function toggleExpand() {
    setExpanded((prev) => {
      const next = !prev
      if (next) dispatch({ type: 'LOG', name: 'settings_expand', detail: { id } })
      return next
    })
  }

  function onChannelToggle(channel: Channel) {
    // Security: block turning off the last active channel.
    if (locked && channels[channel] && activeChannelCount(state.prefs, id) <= 1) {
      setHintChannel(channel)
      return
    }
    dispatch({ type: 'CHANNEL_TOGGLE', id, channel })
  }

  // SMS is a security-only channel (PRD D12) — hidden in service categories.
  const visibleChannels = locked
    ? CHANNEL_ORDER
    : CHANNEL_ORDER.filter((c) => c !== 'sms')

  const activeSummary = masterOn
    ? visibleChannels
        .filter((c) => channels[c])
        .map((c) => CHANNEL_LABELS[c])
        .join(' · ') || 'Keine aktiv'
    : 'Aus'

  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggleExpand}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-start gap-2 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-base font-medium text-text">
              {locked && (
                <Lock size={14} className="text-text-secondary" aria-hidden="true" />
              )}
              <span>{meta.title}</span>
            </div>
            <p className="mt-0.5 text-sm text-text-secondary">{meta.description}</p>
            <p className="mt-1 text-sm text-text-secondary">{activeSummary}</p>
          </div>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={[
              'mt-0.5 shrink-0 text-text-secondary transition-transform',
              expanded ? 'rotate-180' : '',
            ].join(' ')}
          />
        </button>

        {locked ? (
          <span className="mt-0.5 shrink-0 self-start rounded-full bg-white px-3 py-1 text-sm text-text-secondary">
            Immer aktiv
          </span>
        ) : (
          <Toggle
            checked={masterOn}
            onChange={() => dispatch({ type: 'MASTER_TOGGLE', id })}
            label={`${meta.title} aktivieren`}
          />
        )}
      </div>

      {expanded && (
        <div id={panelId} className="mt-3 border-t border-black/5 pt-3">
          {locked && (
            <p className="mb-3 text-sm text-text-secondary">
              Sicherheitshinweise können nicht deaktiviert werden. So schützen wir
              Ihr Konto.
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {visibleChannels.map((channel) => {
              const Icon = CHANNEL_ICON[channel]
              const channelDisabled = !masterOn
              return (
                <li key={channel} className="flex flex-col">
                  <div className="flex items-center gap-3 py-1">
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className={channelDisabled ? 'text-text-secondary opacity-40' : 'text-text'}
                    />
                    <span
                      className={[
                        'flex-1 text-base',
                        channelDisabled ? 'text-text-secondary' : 'text-text',
                      ].join(' ')}
                    >
                      {CHANNEL_LABELS[channel]}
                    </span>
                    <Toggle
                      checked={channels[channel]}
                      disabled={channelDisabled}
                      onChange={() => onChannelToggle(channel)}
                      label={`${meta.title} – ${CHANNEL_LABELS[channel]}`}
                    />
                  </div>
                  {channel === 'push' && denied && (
                    <p className="ml-8 text-sm text-text-secondary">
                      Wirkt erst, wenn Push auf dem Gerät erlaubt ist.
                    </p>
                  )}
                  {hintChannel === channel && (
                    <p className="ml-8 text-sm text-primary" role="status">
                      Mindestens ein Kanal muss aktiv bleiben.
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
