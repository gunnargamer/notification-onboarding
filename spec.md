# Phase 5 · Claude Code Kickoff — MagentaSERVICE Notifications Prototype

> **Usage:** Paste this entire document as the first prompt in a Claude Code session (or save as `SPEC.md` in the repo root and prompt: "Read SPEC.md and build P1."). It is self-contained — no other context required. Companion docs (01_Understand, 02_PRD, 03_Ideate) add rationale but are not needed to build.
> **Tip:** Register the Mobbin MCP in the session for visual reference checks: `claude mcp add mobbin --scope user --transport http https://api.mobbin.com/mcp`

---

## Mission

Build a clickable, testable mobile-web prototype of the **notification permission onboarding** and **notification settings** for a Telekom service app. Target: moderated usability tests on mobile devices. German UI. No backend — localStorage only.

**The design spine — every element serves at least one link:**
> "Ich verstehe, worüber Telekom mich informiert · Ich habe die Themen selbst gewählt · Ich kann es jederzeit ändern · Ich komme so oder so weiter."

**Design principle:** This is not a permission request. It is a confidence-building moment. Value first, control visible, continuation always possible. Tone: simple, human, trustworthy. No marketing speak, no exclamation marks, no emojis in product copy. Sie-form throughout.

---

## Stack & Setup

- **Vite + React 18 + TypeScript + Tailwind CSS** (no Next.js — static prototype, no SSR needed)
- Mobile-first: design for 390×844 (iPhone 14); on desktop, render inside a centered phone frame (`max-w-[390px]`, full height, subtle border) with overlays portal-rendered into a `#phone-overlay-root` inside that frame
- `lucide-react` for icons (Bell, Mail, MessageSquare, Smartphone, Lock, ChevronDown, ArrowLeft, Settings)
- State: React context + reducer; persisted to localStorage
- No router needed — a simple `screen` state (`login | sheet | os-dialog | overview | settings`) is sufficient

## Design Tokens (mock ODS layer — REQUIRED structure)

Create `src/styles/tokens.css` with CSS custom properties and reference ONLY these via Tailwind config. This file is the swap-in point for the real `@telekom-ods/react-ui-kit` later — never hardcode these values in components.

```css
:root[data-mode='light'] {
  --color-primary: #E20074;        /* Magenta — primary CTAs and accents ONLY, never body text */
  --color-text: #191919;
  --color-text-secondary: #6B6B6B;
  --color-surface: #FFFFFF;
  --color-card: #F1F1F1;           /* card surfaces: rounded-2xl, no border, no shadow */
  --color-backdrop: rgba(0,0,0,0.5);
  --radius-pill: 72px;             /* all buttons */
  --radius-card: 16px;
  --radius-sheet: 16px;            /* sheet top corners */
  --spacing-button-gap: 12px;
  --touch-target-min: 44px;
}
```

Typography: system font stack is fine (real build uses TeleNeo). Title scale: sheet/page titles 20px bold centered; body 16px; sublines 14px secondary.

## Data Model & State Machine

```ts
type NotifState = 'unset' | 'enabled' | 'postponed' | 'postponed_final' | 'declined';
type Channel = 'push' | 'email' | 'sms' | 'inapp';
type CategoryId = 'billing' | 'service' | 'system' | 'security' | 'offers';

interface NotifPrefs {
  state: NotifState;                       // localStorage key: notif_state
  osPermission: 'unset' | 'granted' | 'denied';  // simulated; key: notif_os
  categories: Record<CategoryId, boolean>; // key: notif_categories
  channels: Record<CategoryId, Record<Channel, boolean>>; // key: notif_channels
}
```

**Category defaults** (onboarding toggles): billing ✓, service ✓, system ✓, security ✓ LOCKED (cannot be turned off anywhere), offers ✗.

**Channel default matrix** (Settings):
| Category | push | email | sms | inapp |
|---|---|---|---|---|
| billing | ✓ | ✓ | ✗ | ✓ |
| service | ✓ | ✗ | ✗ | ✓ |
| system | ✓ | ✓ | ✗ | ✓ |
| security | ✓ | ✓ | ✓ | ✓ (min. one channel must always stay on) |
| offers | ✗ | ✗ | ✗ | ✗ |

**Transitions:** `unset` → sheet shown once → Enable tap → simulated OS dialog → Allow = `enabled`+`granted` / Don't allow = `declined`+`denied`. "Später" or drag-down = `postponed`. SMS toggles for non-security categories exist in the model but only security has SMS on by default.

## Screens (P1 scope)

### 1. Login stub
Minimal: Telekom-style wordmark placeholder, single button „Anmelden". On tap → if `notif_state === 'unset'` → show sheet over the overview; else → overview.

### 2. Notification bottom sheet
- Slides up (~250 ms ease-out), dim backdrop, ~70% height, rounded top 16px
- **Drag handle: interactive.** Drag down past threshold = same as „Später". Backdrop tap and Escape do nothing (accidental-dismiss protection). No dead affordances.
- Header: „Benachrichtigungen" (centered, bold)
- Intent line: „Wählen Sie, worüber wir Sie informieren."
- 5 rows, each: Bell-family icon · title · scenario subline · toggle right (44px target):
  1. ✓ **Rechnungen & Zahlungen** — z. B. „Ihre Rechnung für Oktober ist da."
  2. ✓ **Service & Tarif** — z. B. „Ihr Datenvolumen ist fast aufgebraucht."
  3. ✓ **System & Wartung** — z. B. „Störung in Ihrer Region behoben."
  4. 🔒 **Konto & Sicherheit** · Badge „Immer aktiv" instead of toggle — z. B. „Neue Anmeldung auf Ihrem Konto."
  5. ✗ **Angebote & Empfehlungen** — „Nur wenn Sie möchten."
- Reassurance line above footer (14px secondary): „Sie können das jederzeit in den Einstellungen ändern."
- Footer (sticky, right-aligned, 12px gap): secondary pill „Später" · primary pill (magenta) „Benachrichtigungen aktivieren"
- Category toggle states persist immediately, regardless of which CTA is tapped

### 3. Simulated iOS permission dialog
Rendered as iOS-style alert on top of the sheet (sheet stays visible behind — real OS behavior):
- Title: „OneApp möchte Ihnen Mitteilungen senden"
- Body: „Mitteilungen können Hinweise, Töne und Kennzeichen enthalten. Sie können das in den Einstellungen anpassen."
- Buttons: „Nicht erlauben" / „Erlauben" (bold)
Outcome updates `osPermission` + `state`, closes sheet + dialog → overview.

### 4. App overview stub
Greeting, 2–3 dummy service cards (Rechnung, Datenverbrauch), gear icon → Settings. If `state === 'postponed'`: show nothing special in P1 (re-prompt is P2).

### 5. Settings → Benachrichtigungen
- Header: back arrow + „Benachrichtigungen"
- Intent line: „Legen Sie fest, worüber und wie wir Sie informieren."
- **Conditional OS-denied banner** (only if `osPermission === 'denied'`), card-styled, top:
  „**Push-Benachrichtigungen sind auf diesem Gerät deaktiviert.**" + button „Einstellungen öffnen" (in prototype: opens debug panel hint)
- 5 category cards (#F1F1F1, rounded-2xl, no border/shadow), collapsed by default:
  - Collapsed: title · description · master toggle · summary line of active channels („Push · E-Mail · In-App") · chevron
  - Expanded (tap row, not toggle): one labelled toggle per channel with icon (Push=Bell, E-Mail=Mail, SMS=MessageSquare, In-App=Smartphone)
  - Master toggle off → channels disabled visually but values remembered (restore on re-enable)
  - **Security card:** lock badge „Immer aktiv" instead of master toggle + line „Sicherheitshinweise können nicht deaktiviert werden. So schützen wir Ihr Konto." Channel toggles editable, but prevent turning off the last active channel (toggle snaps back + brief inline hint)
  - If `osPermission === 'denied'`: under each push toggle show „Wirkt erst, wenn Push auf dem Gerät erlaubt ist."
- **Save-on-change:** optimistic, persist immediately, no save button. No toast on success.

Category descriptions: billing „Benachrichtigungen zu Rechnungen und Zahlungserinnerungen" · service „Updates zu Ihrem Tarif und Datenverbrauch" · system „Informationen zu Wartungsarbeiten und Störungen" · security „Wichtige Informationen zu Ihrem Konto" · offers „Personalisierte Angebote und Empfehlungen".

### 6. Debug panel
Floating button (bottom-left, dev-styled, clearly not part of the design). Opens panel:
- Reset all state (back to `unset`)
- Force `osPermission`: unset / granted / denied
- Show current state JSON
- **Event log:** append-only list of telemetry events with timestamp: `impression, category_toggle, enable, later, os_allow, os_deny, settings_master_toggle, settings_channel_toggle, settings_expand, os_banner_tap`. Persist to localStorage, clearable. (Used by test moderators.)

## Accessibility (hard requirements)
- All toggles: `role="switch"`, `aria-checked`, visible label association
- Focus visible on all interactive elements; logical focus order; sheet traps focus
- Touch targets ≥ 44px; toggle rows fully tappable
- Sheet announces via `role="dialog"` + `aria-modal` + labelled title

## Acceptance criteria (from PRD scorecard)
1. Cold start → Anmelden → sheet appears exactly once; „Später" → app continues immediately, state `postponed`; sheet never reappears on reload
2. Enable → OS dialog → both outcomes wired; category selections from sheet pre-populate Settings
3. Settings: „Tarif-Push ausschalten" achievable in ≤2 taps from page open (expand counts as one); master off = 1 tap
4. Security category can never reach zero channels; master cannot be disabled
5. `osPermission = denied` → banner visible + push-toggle honesty lines visible
6. All copy German, no „!", no emoji, Sie-form; magenta only on primary CTA and accents
7. Event log captures all listed events in correct order

## Build order
1. Tokens + phone frame + state/reducer + persistence
2. Sheet (incl. drag gesture + iOS dialog)
3. Settings page (cards, expand, matrix, security lock, denied banner)
4. Login/overview stubs + debug panel + event log
5. Pass through acceptance criteria, fix, then `npm run build` must be clean

## Git handoff
- Repo: `magentaservice-notifications-prototype`; branch `main` protected, work on `proto/p1`
- Conventional commits (`feat:`, `fix:`, `chore:`); commit per build-order step minimum
- `README.md`: setup (`npm i && npm run dev`), state-machine diagram, localStorage keys, debug-panel guide for test moderators, token-swap note (replace `tokens.css` + Button/Toggle/ListRow wrappers with `@telekom-ods/react-ui-kit` equivalents: ODSText, ODSButton, ODSListRowStandard)
- Out of scope for P1: contextual re-prompt (P2), EN locale (P2), real ODS package, server persistence

---
*Done when: a person with no project context can run the repo, click through login → sheet → OS dialog → settings, complete acceptance criteria 1–7, and a test moderator can reset state between participants via the debug panel.*
