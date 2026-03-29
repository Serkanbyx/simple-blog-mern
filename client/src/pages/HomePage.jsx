import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import PostCard from '../components/PostCard'

const POSTS_PER_PAGE = 6

const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm">
    <div className="h-48 bg-gray-200" />
    <div className="p-5">
      <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 h-3 w-full rounded bg-gray-200" />
      <div className="mb-2 h-3 w-5/6 rounded bg-gray-200" />
      <div className="mb-4 h-3 w-2/3 rounded bg-gray-200" />
      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <div className="h-7 w-7 rounded-full bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-200" />
      </div>
    </div>
  </div>
)

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const fetchPosts = useCallback(async (pageNum, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const { data } = await api.get('/posts', {
        params: { page: pageNum, limit: POSTS_PER_PAGE },
      })

      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts))
      setTotalPages(data.totalPages)
      setPage(data.currentPage)
    } catch {
      setError('Gönderiler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchPosts(page + 1, true)
    }
  }

  const hasMore = page < totalPages

  return (
    <div>
      {/* Hero section */}
      <section className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Blog
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Teknoloji, yazılım ve güncel konularda en yeni yazıları keşfedin.
        </p>
      </section>

      {/* Error state */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
          <p>{error}</p>
          <button
            onClick={() => fetchPosts(1)}
            className="mt-2 text-sm font-semibold text-red-600 underline hover:text-red-800"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {/* Initial loading skeleton */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="py-20 text-center">
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
          <p className="text-gray-500">İlk gönderi yayınlandığında burada görünecek.</p>
        </div>
      )}

      {/* Post grid */}
      {!loading && posts.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Yükleniyor...
                  </>
                ) : (
                  'Daha Fazla Göster'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage
