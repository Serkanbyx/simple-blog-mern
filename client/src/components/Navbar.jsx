import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  `transition-colors duration-200 ${
    isActive
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600'
  }`

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors"
          onClick={closeMobileMenu}
        >
          Simple Blog
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          {user ? (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin Dashboard
                </NavLink>
              )}

              <span className="text-sm text-gray-500">
                Welcome,{' '}
                <span className="font-medium text-gray-700">
                  {user.username}
                </span>
              </span>

              <button
                onClick={logout}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 md:hidden cursor-pointer"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full bg-current transition-all duration-300 ${
                isMobileMenuOpen
                  ? 'translate-y-2 rotate-45'
                  : ''
              }`}
            />
            <span
              className={`h-0.5 w-full bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full bg-current transition-all duration-300 ${
                isMobileMenuOpen
                  ? '-translate-y-2 -rotate-45'
                  : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3">
          <NavLink
            to="/"
            className={navLinkClass}
            end
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          {user ? (
            <>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={navLinkClass}
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </NavLink>
              )}

              <span className="py-1 text-sm text-gray-500">
                Welcome,{' '}
                <span className="font-medium text-gray-700">
                  {user.username}
                </span>
              </span>

              <button
                onClick={() => {
                  logout()
                  closeMobileMenu()
                }}
                className="mt-1 w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="mt-1 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                onClick={closeMobileMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
