/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Reference ONLY tokens.css custom properties — never hardcode here.
        primary: 'var(--color-primary)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        banner: 'var(--color-banner)',
        backdrop: 'var(--color-backdrop)',
      },
      borderRadius: {
        pill: 'var(--radius-pill)',
        card: 'var(--radius-card)',
        sheet: 'var(--radius-sheet)',
      },
      spacing: {
        'button-gap': 'var(--spacing-button-gap)',
        touch: 'var(--touch-target-min)',
      },
      minHeight: {
        touch: 'var(--touch-target-min)',
      },
      minWidth: {
        touch: 'var(--touch-target-min)',
      },
    },
  },
  plugins: [],
}
