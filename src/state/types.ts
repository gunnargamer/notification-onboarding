export type NotifState =
  | 'unset'
  | 'enabled'
  | 'postponed'
  | 'postponed_final'
  | 'declined'

export type OsPermission = 'unset' | 'granted' | 'denied'

export type Channel = 'push' | 'email' | 'sms' | 'inapp'

export type CategoryId = 'billing' | 'service' | 'system' | 'security' | 'offers'

export type Screen = 'splash' | 'sheet' | 'os-dialog' | 'overview' | 'settings'

/**
 * Onboarding entry flow (test config, not participant state).
 * v1 = prompt immediately after login; v2 = contextual, after the user opens a
 * task (the Rechnung card) on the overview.
 */
export type FlowMode = 'v1' | 'v2'

export interface NotifPrefs {
  state: NotifState // localStorage key: notif_state
  osPermission: OsPermission // simulated; key: notif_os
  categories: Record<CategoryId, boolean> // key: notif_categories
  channels: Record<CategoryId, Record<Channel, boolean>> // key: notif_channels
}

export type TelemetryEventName =
  | 'impression'
  | 'category_toggle'
  | 'enable'
  | 'later'
  | 'os_allow'
  | 'os_deny'
  | 'settings_master_toggle'
  | 'settings_channel_toggle'
  | 'settings_expand'
  | 'os_banner_tap'

export interface TelemetryEvent {
  name: TelemetryEventName
  ts: number // epoch ms
  detail?: Record<string, unknown>
}
