import type { CategoryId, Channel } from './types'

export interface CategoryMeta {
  id: CategoryId
  title: string
  /** Short description used in Settings cards. */
  description: string
  /** Scenario example shown in the onboarding sheet. */
  scenario: string
  locked?: boolean // security cannot be turned off anywhere
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  billing: {
    id: 'billing',
    title: 'Rechnungen & Zahlungen',
    description: 'Benachrichtigungen zu Rechnungen und Zahlungserinnerungen',
    scenario: 'Rechnungen und Zahlungserinnerungen',
  },
  service: {
    id: 'service',
    title: 'Tarif & Verbrauch',
    description: 'Updates zu Ihrem Tarif und Datenverbrauch',
    scenario: 'Tarif-Updates und Verbrauchshinweise',
  },
  system: {
    id: 'system',
    title: 'System & Wartung',
    description: 'Informationen zu Wartungsarbeiten und Störungen',
    scenario: 'Wartung und Störungen',
  },
  security: {
    id: 'security',
    title: 'Konto & Sicherheit',
    description: 'Wichtige Informationen zu Ihrem Konto',
    scenario: 'Wichtige Hinweise zu Ihrem Konto',
    locked: true,
  },
  offers: {
    id: 'offers',
    title: 'Angebote & Empfehlungen',
    description: 'Personalisierte Angebote und Empfehlungen',
    scenario: 'Persönliche Angebote und Empfehlungen',
  },
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  push: 'Push',
  email: 'E-Mail',
  sms: 'SMS',
  inapp: 'In-App',
}
