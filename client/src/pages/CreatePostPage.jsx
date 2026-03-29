import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import PostForm from '../components/admin/PostForm'
import { useToast } from '../context/ToastContext'

const CreatePostPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (formData) => {
    try {
      await api.post('/posts', formData)
      toast.success('Gönderi başarıyla oluşturuldu!')
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Gönderi oluşturulurken bir hata oluştu.'
      toast.error(msg)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Admin paneline dön"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Yeni Gönderi</h1>
      </div>

      <PostForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreatePostPage
