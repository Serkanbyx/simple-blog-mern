const colorStyles = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-700',
  pink: 'bg-pink-100 text-pink-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  gray: 'bg-gray-100 text-gray-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-3.5 py-1.5 text-sm',
}

const Badge = ({
  children,
  color = 'blue',
  size = 'md',
  rounded = true,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center font-semibold ${
        rounded ? 'rounded-full' : 'rounded-md'
      } ${colorStyles[color] || colorStyles.blue} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
