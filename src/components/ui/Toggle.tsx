interface ToggleProps {
  checked: boolean
  onChange: () => void
  /** Accessible label (associated with the control). */
  label: string
  disabled?: boolean
}

/**
 * Accessible switch. role="switch" + aria-checked, 44px touch target.
 * The whole control is the hit area.
 */
export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className="relative inline-flex h-touch min-w-touch items-center justify-center disabled:cursor-not-allowed"
    >
      <span
        aria-hidden="true"
        className={[
          'relative h-[31px] w-[51px] rounded-full transition-colors duration-200',
          disabled ? 'opacity-40' : '',
          checked ? 'bg-primary' : 'bg-black/20',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-all duration-200',
            checked ? 'left-[22px]' : 'left-[2px]',
          ].join(' ')}
        />
      </span>
    </button>
  )
}
