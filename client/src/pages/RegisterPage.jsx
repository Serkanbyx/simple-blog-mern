import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const VALIDATION_RULES = {
  USERNAME_MIN: 3,
  PASSWORD_MIN: 6,
}

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.username.trim().length < VALIDATION_RULES.USERNAME_MIN) {
      newErrors.username = `Username must be at least ${VALIDATION_RULES.USERNAME_MIN} characters.`
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    }

    if (formData.password.length < VALIDATION_RULES.PASSWORD_MIN) {
      newErrors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN} characters.`
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await register(formData.username, formData.email, formData.password)
      toast.success('Hesap başarıyla oluşturuldu! Hoş geldiniz.')
      navigate('/', { replace: true })
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      setServerError(serverMessage)
      toast.error(serverMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName = (fieldName) =>
    `w-full rounded-lg border px-4 py-2.5 text-gray-800 transition focus:ring-2 focus:outline-none ${
      errors[fieldName]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
    }`

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Create Account
        </h1>

        {serverError && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              className={inputClassName('username')}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClassName('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={inputClassName('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClassName('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
