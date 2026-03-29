import { useEffect, useRef, useCallback } from 'react'

const Modal = ({
  open = false,
  title,
  message,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  const variantColors = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20',
    },
    primary: {
      icon: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20',
    },
  }

  const colors = variantColors[variant] || variantColors.danger

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && !loading) {
        onCancel?.()
        return
      }

      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    },
    [loading, onCancel],
  )

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const timer = setTimeout(() => {
      const firstBtn = modalRef.current?.querySelector('button:not([disabled])')
      firstBtn?.focus()
    }, 50)

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel?.()
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Icon */}
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colors.icon}`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        {/* Title */}
        {title && (
          <h3
            id="modal-title"
            className="mb-2 text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
        )}

        {/* Message */}
        {message && <p className="mb-6 text-sm text-gray-600">{message}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300/30 focus:outline-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            aria-busy={loading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:outline-none disabled:opacity-60 ${colors.button}`}
          >
            {loading && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
