import { forwardRef, useId } from 'react'

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      className = '',
      id: externalId,
      type = 'text',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = externalId || generatedId
    const errorId = `${inputId}-error`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 transition focus:ring-2 focus:outline-none ${
              Icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
            } ${className}`}
            {...rest}
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
