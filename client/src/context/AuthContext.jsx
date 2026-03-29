import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Validate existing token on mount
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem('token')

      if (!savedToken) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
        setToken(savedToken)
      } catch {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [])

  // Listen for forced logout from axios interceptor (e.g. expired token during usage)
  useEffect(() => {
    const handleExpired = () => {
      setToken(null)
      setUser(null)
      navigate('/login')
    }

    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [navigate])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (username, email, password) => {
    const { data } = await api.post('/auth/register', {
      username,
      email,
      password,
    })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/')
  }, [navigate])

  const isAdmin = user?.role === 'admin'

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, isAdmin }),
    [user, token, loading, login, register, logout, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
