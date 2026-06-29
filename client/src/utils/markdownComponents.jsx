import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const SPACING = {
  full: {
    h1: 'mt-8 mb-4 text-3xl',
    h2: 'mt-7 mb-3 text-2xl',
    h3: 'mt-6 mb-3 text-xl',
    h4: 'mt-5 mb-2 text-lg',
    h5: 'mt-4 mb-2 text-base',
    h6: 'mt-4 mb-2 text-sm',
    p: 'mb-4',
    list: 'mb-4',
    blockquote: 'my-4',
    code: 'my-4',
    img: 'my-6',
    hr: 'my-8',
    table: 'my-4',
  },
  compact: {
    h1: 'mt-6 mb-3 text-2xl',
    h2: 'mt-5 mb-2 text-xl',
    h3: 'mt-4 mb-2 text-lg',
    h4: 'mt-4 mb-2 text-base',
    h5: 'mt-3 mb-1.5 text-sm',
    h6: 'mt-3 mb-1.5 text-xs',
    p: 'mb-3',
    list: 'mb-3',
    blockquote: 'my-3',
    code: 'my-3',
    img: 'my-4',
    hr: 'my-6',
    table: 'my-3',
  },
}

const extractLanguage = (className) => {
  const match = className?.match(/language-(\w+)/)
  return match ? match[1] : null
}

const createMarkdownComponents = (variant = 'full') => {
  const s = SPACING[variant]

  return {
    h1: ({ children }) => (
      <h1 className={`${s.h1} font-extrabold text-gray-900 dark:text-gray-50`}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className={`${s.h2} font-bold text-gray-900 dark:text-gray-100`}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className={`${s.h3} font-semibold text-gray-900 dark:text-gray-100`}>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className={`${s.h4} font-semibold text-gray-800 dark:text-gray-200`}>{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className={`${s.h5} font-semibold text-gray-800 dark:text-gray-200`}>{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className={`${s.h6} font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400`}>
        {children}
      </h6>
    ),

    p: ({ children }) => (
      <p className={`${s.p} leading-relaxed text-gray-700 dark:text-gray-300`}>{children}</p>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 transition-colors hover:text-blue-800 hover:decoration-blue-500 dark:text-blue-400 dark:decoration-blue-600 dark:hover:text-blue-300"
      >
        {children}
      </a>
    ),

    ul: ({ children }) => (
      <ul className={`${s.list} ml-6 list-disc space-y-1 text-gray-700 dark:text-gray-300`}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={`${s.list} ml-6 list-decimal space-y-1 text-gray-700 dark:text-gray-300`}>{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    blockquote: ({ children }) => (
      <blockquote
        className={`${s.blockquote} border-l-4 border-blue-400 bg-blue-50 py-2 pr-4 pl-4 italic text-gray-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-gray-300`}
      >
        {children}
      </blockquote>
    ),

    code: ({ className, children }) => {
      const language = extractLanguage(className)
      const codeString = String(children).replace(/\n$/, '')

      if (!language) {
        return (
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:bg-gray-800 dark:text-pink-400">
            {children}
          </code>
        )
      }

      return (
        <div className={`${s.code} overflow-hidden rounded-lg`}>
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 dark:bg-gray-900">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {language}
            </span>
          </div>
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              fontSize: '0.875rem',
            }}
            showLineNumbers
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      )
    },

    pre: ({ children }) => <>{children}</>,

    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        className={`${s.img} w-full rounded-lg shadow-sm`}
      />
    ),

    hr: () => <hr className={`${s.hr} border-gray-200 dark:border-gray-700`} />,

    table: ({ children }) => (
      <div className={`${s.table} overflow-x-auto`}>
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border-t border-gray-200 px-4 py-2 text-gray-600 dark:border-gray-700 dark:text-gray-300">
        {children}
      </td>
    ),
  }
}

export default createMarkdownComponents
