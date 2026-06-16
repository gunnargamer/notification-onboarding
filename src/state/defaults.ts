import type { CategoryId, Channel, NotifPrefs } from './types'

export const CATEGORY_ORDER: CategoryId[] = [
  'billing',
  'service',
  'system',
  'security',
  'offers',
]

export const CHANNEL_ORDER: Channel[] = ['push', 'email', 'sms', 'inapp']

// Category defaults for the onboarding sheet.
// billing ✓, service ✓, system ✓, security ✓ (locked), offers ✗
export const DEFAULT_CATEGORIES: Record<CategoryId, boolean> = {
  billing: true,
  service: true,
  system: true,
  security: true,
  offers: false,
}

// Channel default matrix (Settings).
export const DEFAULT_CHANNELS: Record<CategoryId, Record<Channel, boolean>> = {
  billing: { push: true, email: true, sms: false, inapp: true },
  service: { push: true, email: false, sms: false, inapp: true },
  system: { push: true, email: true, sms: false, inapp: true },
  security: { push: true, email: true, sms: true, inapp: true },
  offers: { push: false, email: false, sms: false, inapp: false },
}

export const DEFAULT_PREFS: NotifPrefs = {
  state: 'unset',
  osPermission: 'unset',
  initialOptIn: null,
  categories: { ...DEFAULT_CATEGORIES },
  channels: {
    billing: { ...DEFAULT_CHANNELS.billing },
    service: { ...DEFAULT_CHANNELS.service },
    system: { ...DEFAULT_CHANNELS.system },
    security: { ...DEFAULT_CHANNELS.security },
    offers: { ...DEFAULT_CHANNELS.offers },
  },
}
