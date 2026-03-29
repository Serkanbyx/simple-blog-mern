import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import PostForm from '../components/admin/PostForm'

const EditPostPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [postData, setPostData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/id/${id}`)
        setPostData(data)
      } catch (err) {
        const msg = err.response?.data?.message || 'Gönderi yüklenirken bir hata oluştu.'
        setFetchError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleSubmit = async (formData) => {
    await api.put(`/posts/${id}`, formData)
    navigate('/admin')
  }

  if (fetchError) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="mb-4 text-sm text-red-600">{fetchError}</p>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Admin Paneline Dön
        </Link>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900">Gönderiyi Düzenle</h1>
      </div>

      <PostForm
        initialData={postData}
        onSubmit={handleSubmit}
        isEditing
        loading={loading}
      />
    </div>
  )
}

export default EditPostPage
