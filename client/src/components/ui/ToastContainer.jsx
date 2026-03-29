import { useToast } from '../../context/ToastContext'

const ICON_MAP = {
  success: (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
}

const STYLE_MAP = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
}

const CLOSE_STYLE_MAP = {
  success: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100',
  error: 'text-red-500 hover:text-red-700 hover:bg-red-100',
  info: 'text-blue-500 hover:text-blue-700 hover:bg-blue-100',
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-4 right-4 left-4 z-50 flex flex-col items-end gap-3 sm:left-auto"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-lg sm:w-80 ${STYLE_MAP[toast.type]}`}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {ICON_MAP[toast.type]}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className={`shrink-0 rounded-lg p-1 transition-colors ${CLOSE_STYLE_MAP[toast.type]}`}
            aria-label="Close notification"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
