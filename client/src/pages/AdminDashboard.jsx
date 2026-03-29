import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const FETCH_LIMIT = 20

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&h=400&fit=crop'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-10 w-16 rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-48 rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-20 rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3">
      <div className="flex gap-2">
        <div className="h-8 w-16 rounded bg-gray-200" />
        <div className="h-8 w-16 rounded bg-gray-200" />
      </div>
    </td>
  </tr>
)

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl bg-white p-4 shadow-sm">
    <div className="flex gap-4">
      <div className="h-16 w-20 shrink-0 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  </div>
)

const DeleteModal = ({ postTitle, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">Gönderiyi Sil</h3>
      <p className="mb-6 text-sm text-gray-600">
        <span className="font-medium text-gray-800">&quot;{postTitle}&quot;</span> gönderisini silmek
        istediğinize emin misiniz? Bu işlem geri alınamaz.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          İptal
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {deleting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Siliniyor...
            </>
          ) : (
            'Evet, Sil'
          )}
        </button>
      </div>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchAllPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const allPosts = []
      let currentPage = 1
      let totalPages = 1

      do {
        const { data } = await api.get('/posts', {
          params: { page: currentPage, limit: FETCH_LIMIT },
        })
        allPosts.push(...data.posts)
        totalPages = data.totalPages
        currentPage++
      } while (currentPage <= totalPages)

      setPosts(allPosts)
    } catch {
      setError('Gönderiler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllPosts()
  }, [fetchAllPosts])

  const uniqueCategories = [...new Set(posts.map((p) => p.category))]

  const handleDeleteClick = (post) => {
    setDeleteTarget(post)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    try {
      setDeleting(true)
      await api.delete(`/posts/${deleteTarget._id}`)
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch {
      setError('Gönderi silinirken bir hata oluştu.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    if (!deleting) setDeleteTarget(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yeni Gönderi
        </Link>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Gönderi</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueCategories.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
          <p>{error}</p>
          <button
            onClick={fetchAllPosts}
            className="mt-2 text-sm font-semibold text-red-600 underline hover:text-red-800"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <>
          {/* Desktop skeleton */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Görsel</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Başlık</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tarih</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile skeleton */}
          <div className="space-y-3 md:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">Henüz gönderi yok</h2>
          <p className="mb-6 text-gray-500">İlk gönderinizi oluşturarak başlayın.</p>
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Gönderi Oluştur
          </Link>
        </div>
      )}

      {/* Posts — Desktop table */}
      {!loading && posts.length > 0 && (
        <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Görsel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Başlık</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tarih</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post._id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={post.image || PLACEHOLDER_IMAGE}
                      alt={post.title}
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                      className="h-10 w-16 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-xs truncate font-medium text-gray-900">{post.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/posts/${post._id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(post)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Posts — Mobile cards */}
      {!loading && posts.length > 0 && (
        <div className="space-y-3 md:hidden">
          {posts.map((post) => (
            <div key={post._id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                <img
                  src={post.image || PLACEHOLDER_IMAGE}
                  alt={post.title}
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                  className="h-16 w-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{post.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {post.category}
                    </span>
                    <span className="text-gray-300">|</span>
                    <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <Link
                  to={`/admin/posts/${post._id}`}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDeleteClick(post)}
                  className="flex-1 rounded-lg border border-red-200 py-2 text-center text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          postTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          deleting={deleting}
        />
      )}
    </div>
  )
}

export default AdminDashboard
