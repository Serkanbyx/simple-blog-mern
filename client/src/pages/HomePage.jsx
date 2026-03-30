import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import SEO from '../components/SEO'
import useDocumentTitle from '../hooks/useDocumentTitle'

const POSTS_PER_PAGE = 6
const DEBOUNCE_DELAY = 300

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

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
)

const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const HomePage = () => {
  useDocumentTitle(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  // Filter options from backend
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  // Active filters — sourced from URL
  const activeSearch = searchParams.get('search') || ''
  const activeCategory = searchParams.get('category') || ''
  const activeTag = searchParams.get('tag') || ''

  // Local search input (for debouncing)
  const [searchInput, setSearchInput] = useState(activeSearch)
  const debounceRef = useRef(null)
  const isFirstRender = useRef(true)

  const hasActiveFilters = activeSearch || activeCategory || activeTag

  // ----- Fetch filter options on mount -----
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data } = await api.get('/posts/filters')
        setCategories(data.categories)
        setTags(data.tags)
      } catch {
        // Filters are non-critical; silently ignore
      }
    }
    fetchFilterOptions()
  }, [])

  // ----- Fetch posts whenever URL params change -----
  const fetchPosts = useCallback(
    async (pageNum, append = false) => {
      try {
        if (append) {
          setLoadingMore(true)
        } else {
          setLoading(true)
        }
        setError(null)

        const params = { page: pageNum, limit: POSTS_PER_PAGE }
        if (activeSearch) params.search = activeSearch
        if (activeCategory) params.category = activeCategory
        if (activeTag) params.tag = activeTag

        const { data } = await api.get('/posts', { params })

        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts))
        setTotalPages(data.totalPages)
        setTotalPosts(data.totalPosts)
        setPage(data.currentPage)
      } catch {
        setError('Something went wrong while loading posts.')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [activeSearch, activeCategory, activeTag],
  )

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  // Sync local search input when URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    setSearchInput(activeSearch)
  }, [activeSearch])

  // ----- Debounced search -----
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (searchInput.trim()) {
          next.set('search', searchInput.trim())
        } else {
          next.delete('search')
        }
        return next
      })
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(debounceRef.current)
  }, [searchInput, setSearchParams])

  // ----- Filter handlers -----
  const handleCategoryChange = (category) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (category && category !== activeCategory) {
        next.set('category', category)
      } else {
        next.delete('category')
      }
      return next
    })
  }

  const handleTagChange = (tag) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (tag && tag !== activeTag) {
        next.set('tag', tag)
      } else {
        next.delete('tag')
      }
      return next
    })
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setSearchParams({})
  }

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchPosts(page + 1, true)
    }
  }

  const hasMore = page < totalPages

  return (
    <div>
      <SEO description="Discover the latest articles on technology, software, and current topics." />

      {/* Hero section */}
      <section className="mb-8 text-center sm:mb-12">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:mb-3 sm:text-4xl lg:text-5xl dark:text-white">
          Blog
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
          Discover the latest articles on technology, software, and current topics.
        </p>
      </section>

      {/* Search & Filters */}
      <section className="mb-8 space-y-4" aria-label="Search and filters">
        {/* Search bar */}
        <div className="relative mx-auto max-w-xl">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
            <SearchIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title..."
            aria-label="Search by title"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-10 pl-11 text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition hover:text-gray-600"
              aria-label="Clear search"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm font-medium text-gray-500">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Tag filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm font-medium text-gray-500">Tag:</span>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => handleTagChange(t)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  activeTag === t
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {/* Reset filters */}
        {hasActiveFilters && (
          <div className="text-center">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <XIcon className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Error state */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
          <p>{error}</p>
          <button
            onClick={() => fetchPosts(1)}
            className="mt-2 text-sm font-semibold text-red-600 underline hover:text-red-800"
          >
            Try again
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
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            {hasActiveFilters ? 'No results found' : 'No posts yet'}
          </h2>
          <p className="text-gray-500">
            {hasActiveFilters
              ? 'Try a different keyword or filters.'
              : 'The first post will appear here once published.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-4 text-sm font-semibold text-blue-600 underline hover:text-blue-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Post grid */}
      {!loading && posts.length > 0 && (
        <>
          {totalPosts > 0 && (
            <p className="mb-4 text-sm text-gray-500">
              {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found
            </p>
          )}

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
                    Loading...
                  </>
                ) : (
                  'Load More'
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
