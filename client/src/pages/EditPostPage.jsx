import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import PostForm from '../components/admin/PostForm'
import { useToast } from '../context/ToastContext'
import useDocumentTitle from '../hooks/useDocumentTitle'

const EditPostPage = () => {
  useDocumentTitle('Edit Post')
  const navigate = useNavigate()
  const { id } = useParams()
  const toast = useToast()

  const [postData, setPostData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/id/${id}`)
        setPostData(data)
      } catch (err) {
        const msg = err.response?.data?.message || 'Something went wrong while loading the post.'
        setFetchError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/posts/${id}`, formData)
      toast.success('Post updated successfully!')
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong while updating the post.'
      toast.error(msg)
    }
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
          Back to Admin Panel
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
          aria-label="Back to admin panel"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Edit Post</h1>
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
