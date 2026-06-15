# MagentaSERVICE Notifications Prototype

Clickable, testable mobile-web prototype of the **notification permission
onboarding** and **notification settings** for a Telekom service app. Built for
moderated usability tests on mobile devices. German UI, no backend —
state lives in `localStorage`.

> Design spine: *Ich verstehe, worüber Telekom mich informiert · Ich habe die
> Themen selbst gewählt · Ich kann es jederzeit ändern · Ich komme so oder so
> weiter.* This is not a permission request — it is a confidence-building moment.

## Setup

```bash
npm i
npm run dev      # start Vite dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

Mobile-first, designed for 390×844 (iPhone 14). On desktop it renders inside a
centered phone frame.

## State machine

```
                       ┌──────────────── reload ───────────────┐
                       │  (sheet never reappears once decided)  │
                       ▼                                        │
  [unset] ──Anmelden──▶ sheet shown once                       │
                       │                                        │
        ┌──────────────┼─────────────────────────┐             │
        │              │                          │            (persisted
   „Später" /      „Aktivieren"              (category          state)
   drag-down           │                    toggles persist
        │              ▼                    immediately either way)
        ▼         OS dialog                      │
   [postponed]    ┌────┴────┐                     │
                  │         │                     │
             „Erlauben" „Nicht erlauben"          │
                  │         │                     │
                  ▼         ▼                      │
            [enabled]   [declined]  ──────────────┘
            os=granted  os=denied
```

- `postponed_final` exists in the model for the P2 re-prompt flow; P1 only
  reaches `postponed`.
- Category selections made in the sheet pre-populate the Settings screen.

## localStorage keys

| Key | Contents |
|---|---|
| `notif_state` | `'unset' \| 'enabled' \| 'postponed' \| 'postponed_final' \| 'declined'` |
| `notif_os` | simulated OS permission: `'unset' \| 'granted' \| 'denied'` |
| `notif_categories` | `Record<CategoryId, boolean>` — master on/off per category |
| `notif_channels` | `Record<CategoryId, Record<Channel, boolean>>` — channel matrix |
| `notif_events` | append-only telemetry event log (for test moderators) |

`CategoryId = billing | service | system | security | offers`,
`Channel = push | email | sms | inapp`.

Security is always active (locked master) and must keep at least one channel on.

## Debug panel (for test moderators)

Floating bug button, **bottom-left** (intentionally not part of the design;
hidden while the sheet/OS dialog is open). It opens a panel that lets a moderator:

- **Reset all state** → back to `unset`; use this **between participants**.
- **Force `osPermission`** → `unset` / `granted` / `denied` (e.g. to demo the
  "push disabled on this device" banner).
- **Show current state** as live JSON.
- **Event log** — timestamped, append-only list of telemetry events
  (`impression`, `category_toggle`, `enable`, `later`, `os_allow`, `os_deny`,
  `settings_master_toggle`, `settings_channel_toggle`, `settings_expand`,
  `os_banner_tap`). Clearable.

## Token-swap note (real ODS later)

The mock ODS layer is `src/styles/tokens.css` (CSS custom properties), referenced
**only** via `tailwind.config.js` — no component hardcodes these values. To adopt
the real design system, replace `tokens.css` and the thin UI wrappers with their
`@telekom-ods/react-ui-kit` equivalents:

| Prototype wrapper | ODS equivalent |
|---|---|
| `src/components/ui/Button.tsx` | `ODSButton` |
| `src/components/ui/Toggle.tsx` | ODS switch / `ODSListRowStandard` control |
| text styles in components | `ODSText` |
| list rows (sheet / cards) | `ODSListRowStandard` |

## Tech

Vite · React 18 · TypeScript · Tailwind CSS · lucide-react. State via React
context + reducer, persisted to `localStorage`. No router — a single `screen`
state (`login | sheet | os-dialog | overview | settings`) drives navigation.

## Out of scope for P1

Contextual re-prompt (P2), EN locale (P2), the real ODS package, server
persistence.
