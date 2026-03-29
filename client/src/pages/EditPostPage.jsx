import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import api from '../api/axios'

const ACCEPTED_FORMATS = '.jpg,.jpeg,.png,.webp'
const MAX_FILE_SIZE_MB = 5

const CATEGORY_OPTIONS = [
  'Teknoloji',
  'Yazılım',
  'Tasarım',
  'Yaşam',
  'Bilim',
  'Eğitim',
  'Spor',
  'Seyahat',
]

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-2xl font-extrabold text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 text-xl font-bold text-gray-900">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 ml-6 list-disc space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-6 list-decimal space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-blue-400 bg-blue-50 py-2 pr-4 pl-4 italic text-gray-700">
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
      <pre className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-4">
        <code className={`font-mono text-sm text-gray-100 ${className || ''}`}>
          {children}
        </code>
      </pre>
    )
  },
  pre: ({ children }) => <>{children}</>,
  img: ({ src, alt }) => (
    <img src={src} alt={alt || ''} loading="lazy" className="my-4 w-full rounded-lg shadow-sm" />
  ),
  hr: () => <hr className="my-6 border-gray-200" />,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto">
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

const EditPostPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageUrl, setImageUrl] = useState('')

  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const slug = useMemo(() => slugify(title), [title])
  const activeCategory = category === '__custom__' ? customCategory : category

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/id/${id}`)

        setTitle(data.title || '')
        setContent(data.content || '')
        setTags(data.tags || [])

        if (data.image) {
          setImageUrl(data.image)
          setImagePreview(data.image)
        }

        const isPreset = CATEGORY_OPTIONS.includes(data.category)
        if (isPreset) {
          setCategory(data.category)
        } else if (data.category) {
          setCategory('__custom__')
          setCustomCategory(data.category)
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Gönderi yüklenirken bir hata oluştu.'
        setFetchError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!title.trim()) newErrors.title = 'Başlık zorunludur.'
    if (title.trim().length > 200) newErrors.title = 'Başlık en fazla 200 karakter olabilir.'
    if (!activeCategory.trim()) newErrors.category = 'Kategori zorunludur.'
    if (!content.trim()) newErrors.content = 'İçerik zorunludur.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title, activeCategory, content])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `Dosya boyutu en fazla ${MAX_FILE_SIZE_MB} MB olabilir.` }))
      return
    }

    setErrors((prev) => {
      const { image: _, ...rest } = prev
      return rest
    })
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl('')

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', file)

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setImageUrl(data.url)
    } catch (err) {
      const msg = err.response?.data?.message || 'Görsel yüklenirken bir hata oluştu.'
      setErrors((prev) => ({ ...prev, image: msg }))
      setImageFile(null)
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl('')
    setErrors((prev) => {
      const { image: _, ...rest } = prev
      return rest
    })
  }

  const handleTagKeyDown = (e) => {
    if (e.key !== 'Enter' && e.key !== ',') return
    e.preventDefault()

    const value = tagInput.trim().replace(/,/g, '')
    if (!value) return
    if (tags.includes(value)) {
      setTagInput('')
      return
    }
    if (tags.length >= 10) {
      setErrors((prev) => ({ ...prev, tags: 'En fazla 10 etiket ekleyebilirsiniz.' }))
      return
    }

    setTags((prev) => [...prev, value])
    setTagInput('')
    setErrors((prev) => {
      const { tags: _, ...rest } = prev
      return rest
    })
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (uploading) {
      setErrors((prev) => ({ ...prev, image: 'Görsel hâlâ yükleniyor, lütfen bekleyin.' }))
      return
    }

    try {
      setSubmitting(true)
      setErrors({})

      await api.put(`/posts/${id}`, {
        title: title.trim(),
        content: content.trim(),
        category: activeCategory.trim(),
        tags,
        image: imageUrl,
      })

      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Gönderi güncellenirken bir hata oluştu.'
      setErrors({ submit: msg })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm text-gray-500">Gönderi yükleniyor...</span>
        </div>
      </div>
    )
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
      {/* Header */}
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

      {/* Global error */}
      {errors.submit && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left — Editor */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Başlık
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Gönderi başlığını yazın..."
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                  errors.title
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-400 focus:ring-blue-100'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
              {title.trim() && (
                <p className="mt-1.5 text-xs text-gray-400">
                  <span className="font-medium text-gray-500">Slug:</span>{' '}
                  <span className="font-mono">{slug || '—'}</span>
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Kategori
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  if (e.target.value !== '__custom__') setCustomCategory('')
                }}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                  errors.category
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-400 focus:ring-blue-100'
                }`}
              >
                <option value="">Kategori seçin...</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">Diğer (elle yazın)</option>
              </select>
              {category === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Kategori adını yazın..."
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              )}
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tagInput" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Etiketler
              </label>
              <div
                className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 transition-colors focus-within:ring-2 ${
                  errors.tags
                    ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
                    : 'border-gray-300 focus-within:border-blue-400 focus-within:ring-blue-100'
                }`}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-0.5 rounded-full p-0.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
                      aria-label={`${tag} etiketini kaldır`}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  id="tagInput"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? 'Etiket yazıp Enter\'a basın...' : 'Etiket ekle...'}
                  className="min-w-[120px] flex-1 border-none py-1 text-sm focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.tags && (
                <p className="mt-1 text-xs text-red-600">{errors.tags}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Enter veya virgül ile etiket ekleyin. Maks. 10 etiket.
              </p>
            </div>

            {/* Featured Image */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Öne Çıkan Görsel
              </label>
              {!imagePreview ? (
                <label
                  htmlFor="imageUpload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-blue-400 hover:bg-blue-50/30"
                >
                  <svg className="mb-2 h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Görsel yüklemek için tıklayın</span>
                  <span className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP — Maks. {MAX_FILE_SIZE_MB} MB</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept={ACCEPTED_FORMATS}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Mevcut görsel"
                    className="h-48 w-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        Yükleniyor...
                      </div>
                    </div>
                  )}
                  {imageUrl && !imageFile && (
                    <div className="absolute top-2 left-2 rounded-full bg-gray-700/80 px-2.5 py-1 text-xs font-medium text-white shadow">
                      Mevcut görsel
                    </div>
                  )}
                  {imageUrl && imageFile && (
                    <div className="absolute top-2 left-2 rounded-full bg-emerald-500 p-1 shadow">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-gray-600 shadow transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Görseli kaldır"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Content (Markdown editor) */}
            <div>
              <label htmlFor="content" className="mb-1.5 block text-sm font-semibold text-gray-700">
                İçerik <span className="font-normal text-gray-400">(Markdown)</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Markdown formatında içerik yazın..."
                rows={16}
                className={`w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm leading-relaxed transition-colors focus:ring-2 focus:outline-none ${
                  errors.content
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-400 focus:ring-blue-100'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-xs text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                **kalın**, *italik*, ## başlık, - liste, `kod`, [link](url) vb. desteklenir.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Güncelle
                  </>
                )}
              </button>
              <Link
                to="/admin"
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                İptal
              </Link>
            </div>
          </div>

          {/* Right — Markdown Preview */}
          <div className="flex-1 lg:max-w-[50%]">
            <div className="sticky top-6">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span className="text-sm font-semibold text-gray-500">Önizleme</span>
              </div>
              <div className="min-h-[400px] overflow-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="flex h-[360px] flex-col items-center justify-center text-center">
                    <svg className="mb-3 h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <p className="text-sm text-gray-400">
                      Markdown içeriğinizin önizlemesi burada görünecek.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditPostPage
