import {
  Bell,
  CreditCard,
  Wrench,
  ShieldCheck,
  Tag,
  Mail,
  MessageSquare,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryId, Channel } from '../state/types'

/** Bell-family / topical icon per onboarding category. */
export const CATEGORY_ICON: Record<CategoryId, LucideIcon> = {
  billing: CreditCard,
  service: Bell,
  system: Wrench,
  security: ShieldCheck,
  offers: Tag,
}

/** Channel icons used in Settings. */
export const CHANNEL_ICON: Record<Channel, LucideIcon> = {
  push: Bell,
  email: Mail,
  sms: MessageSquare,
  inapp: Smartphone,
}
