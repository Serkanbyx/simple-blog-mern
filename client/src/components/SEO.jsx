import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Simple Blog'
const DEFAULT_DESCRIPTION = 'A modern blog about technology, software, and current topics.'

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = 'website',
}) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Technology & Software`
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}

export default SEO
