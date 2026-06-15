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
    scenario: 'Ihre Rechnung für Oktober ist da.',
  },
  service: {
    id: 'service',
    title: 'Service & Tarif',
    description: 'Updates zu Ihrem Tarif und Datenverbrauch',
    scenario: 'Ihr Datenvolumen ist fast aufgebraucht.',
  },
  system: {
    id: 'system',
    title: 'System & Wartung',
    description: 'Informationen zu Wartungsarbeiten und Störungen',
    scenario: 'Störung in Ihrer Region behoben.',
  },
  security: {
    id: 'security',
    title: 'Konto & Sicherheit',
    description: 'Wichtige Informationen zu Ihrem Konto',
    scenario: 'Neue Anmeldung auf Ihrem Konto.',
    locked: true,
  },
  offers: {
    id: 'offers',
    title: 'Angebote & Empfehlungen',
    description: 'Personalisierte Angebote und Empfehlungen',
    scenario: 'Nur wenn Sie möchten.',
  },
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  push: 'Push',
  email: 'E-Mail',
  sms: 'SMS',
  inapp: 'In-App',
}
