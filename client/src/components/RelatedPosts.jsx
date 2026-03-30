import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&h=400&fit=crop'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const RelatedPosts = ({ category, currentPostId }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return

    const fetchRelated = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/posts', {
          params: { category, limit: 4 },
        })
        const filtered = data.posts
          .filter((p) => p._id !== currentPostId)
          .slice(0, 3)
        setPosts(filtered)
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [category, currentPostId])

  if (loading || posts.length === 0) return null

  return (
    <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
      <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        Related Posts
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post.slug}`}
            className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
          >
            <div className="aspect-3/2 overflow-hidden">
              <img
                src={post.image || PLACEHOLDER_IMAGE}
                alt={post.title}
                loading="lazy"
                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 dark:text-white">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
                {post.readingTime && ` · ${post.readingTime} min read`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
