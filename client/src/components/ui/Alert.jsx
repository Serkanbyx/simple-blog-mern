const variantStyles = {
  success: {
    container: 'border-green-200 bg-green-50 text-green-800',
    icon: 'text-green-500',
    path: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-700',
    icon: 'text-red-500',
    path: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    icon: 'text-yellow-500',
    path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-700',
    icon: 'text-blue-500',
    path: 'M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
  },
}

const Alert = ({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const styles = variantStyles[variant] || variantStyles.info

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${styles.container} ${className}`}
    >
      <svg
        className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={styles.path}
        />
      </svg>

      <div className="flex-1">{children}</div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-none"
          aria-label="Kapat"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert
