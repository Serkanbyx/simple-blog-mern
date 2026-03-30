import { useEffect } from 'react'

const BASE_TITLE = 'Simple Blog'

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} — Technology & Software`
  }, [title])
}

export default useDocumentTitle
