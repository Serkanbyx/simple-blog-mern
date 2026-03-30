import { Link } from 'react-router-dom'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&h=400&fit=crop'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const PostCard = ({ post }) => {
  const { title, slug, excerpt, image, category, author, createdAt, readingTime } = post

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
      {/* Post image */}
      <Link to={`/post/${slug}`} className="relative block aspect-3/2 overflow-hidden">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
          {category}
        </span>
      </Link>

      {/* Post content */}
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/post/${slug}`}>
          <h2 className="mb-2 text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2 dark:text-white">
            {title}
          </h2>
        </Link>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3 dark:text-gray-300">
          {excerpt}
        </p>

        {/* Author & date */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {author?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">{author?.username || 'Unknown'}</span>
          <span className="text-gray-300">•</span>
          <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          {readingTime && (
            <>
              <span className="text-gray-300">•</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default PostCard
