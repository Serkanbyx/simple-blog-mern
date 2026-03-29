import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'

const ToastContext = createContext(null)

const AUTO_DISMISS_MS = 3000

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

let toastId = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = 'info') => {
      const id = ++toastId

      setToasts((prev) => [...prev, { id, message, type }])

      setTimeout(() => removeToast(id), AUTO_DISMISS_MS)

      return id
    },
    [removeToast],
  )

  const success = useCallback(
    (message) => addToast(message, 'success'),
    [addToast],
  )

  const error = useCallback(
    (message) => addToast(message, 'error'),
    [addToast],
  )

  const info = useCallback(
    (message) => addToast(message, 'info'),
    [addToast],
  )

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, success, error, info }),
    [toasts, addToast, removeToast, success, error, info],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
