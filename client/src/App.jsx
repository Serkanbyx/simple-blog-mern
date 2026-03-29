import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="post/:slug" element={<PostDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Admin-only routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/posts/new"
          element={
            <ProtectedRoute requireAdmin>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/posts/:id"
          element={
            <ProtectedRoute requireAdmin>
              <EditPostPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
