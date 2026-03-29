import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import api from '../api/axios'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200&h=600&fit=crop'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Custom styled components for react-markdown output
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-4 text-3xl font-extrabold text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-7 mb-3 text-2xl font-bold text-gray-900">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-5 mb-2 text-lg font-semibold text-gray-800">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 transition-colors hover:text-blue-800"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-blue-400 bg-blue-50 py-2 pr-4 pl-4 italic text-gray-700">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600">
          {children}
        </code>
      )
    }
    return (
      <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4">
        <code className={`font-mono text-sm text-gray-100 ${className || ''}`}>
          {children}
        </code>
      </pre>
    )
  },
  pre: ({ children }) => <>{children}</>,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      className="my-6 w-full rounded-lg shadow-sm"
    />
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold text-gray-700">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-gray-200 px-4 py-2 text-gray-600">{children}</td>
  ),
}

const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-8 h-64 w-full rounded-xl bg-gray-200 sm:h-80 lg:h-96" />
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200" />
      <div className="mb-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-6 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-4/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  </div>
)

const NotFound = () => (
  <div className="py-20 text-center">
    <svg
      className="mx-auto mb-4 h-20 w-20 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
    <h2 className="mb-2 text-2xl font-bold text-gray-700">Gönderi bulunamadı</h2>
    <p className="mb-6 text-gray-500">Aradığınız gönderi mevcut değil veya kaldırılmış olabilir.</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
    >
      ← Ana Sayfaya Dön
    </Link>
  </div>
)

const PostDetailPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        setNotFound(false)

        const { data } = await api.get(`/posts/${slug}`)
        setPost(data)
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 400) {
          setNotFound(true)
        } else {
          setError('Gönderi yüklenirken bir hata oluştu.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) return <DetailSkeleton />
  if (notFound) return <NotFound />

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="mb-4 text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm font-semibold text-blue-600 underline hover:text-blue-800"
        >
          Tekrar dene
        </button>
      </div>
    )
  }

  const { title, content, image, category, tags, author, createdAt } = post

  return (
    <article>
      {/* Back link */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Ana Sayfaya Dön
      </Link>

      {/* Featured image */}
      <div className="mb-8 overflow-hidden rounded-xl shadow-sm">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE
          }}
          className="h-64 w-full object-cover sm:h-80 lg:h-96"
        />
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-3xl">
        {/* Title */}
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {author?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="font-medium text-gray-700">{author?.username || 'Unknown'}</span>
          </div>

          <span className="text-gray-300">•</span>
          <time dateTime={createdAt}>{formatDate(createdAt)}</time>

          <span className="text-gray-300">•</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {category}
          </span>
        </div>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <hr className="mb-8 border-gray-200" />

        {/* Markdown content */}
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>

        {/* Bottom back link */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostDetailPage
