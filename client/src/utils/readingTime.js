const WORDS_PER_MINUTE = 238

const getReadingTime = (content) => {
  if (!content) return 1
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export default getReadingTime
