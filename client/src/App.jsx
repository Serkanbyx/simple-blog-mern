import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'))
const EditPostPage = lazy(() => import('./pages/EditPostPage'))

const PageFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="flex items-center gap-3">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <span className="text-sm text-gray-500">Yükleniyor...</span>
    </div>
  </div>
)

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<Suspense fallback={<PageFallback />}><HomePage /></Suspense>} />
        <Route path="post/:slug" element={<Suspense fallback={<PageFallback />}><PostDetailPage /></Suspense>} />
        <Route path="login" element={<Suspense fallback={<PageFallback />}><LoginPage /></Suspense>} />
        <Route path="register" element={<Suspense fallback={<PageFallback />}><RegisterPage /></Suspense>} />

        {/* Admin-only routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/posts/new"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageFallback />}><CreatePostPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/posts/:id"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageFallback />}><EditPostPage /></Suspense>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
