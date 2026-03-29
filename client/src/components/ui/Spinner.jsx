const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
}

const colorStyles = {
  primary: 'border-blue-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent',
}

const Spinner = ({
  size = 'md',
  color = 'primary',
  label = 'Yükleniyor',
  className = '',
}) => {
  return (
    <span role="status" className={`inline-flex items-center ${className}`}>
      <span
        className={`animate-spin rounded-full ${sizeStyles[size]} ${colorStyles[color]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export default Spinner
