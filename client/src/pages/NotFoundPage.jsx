import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

const NotFoundPage = () => {
  useDocumentTitle('Page Not Found')
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-7xl font-extrabold text-gray-200">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-gray-700">Page Not Found</h2>
        <p className="mb-8 max-w-md text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
