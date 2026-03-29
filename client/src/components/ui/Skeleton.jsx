const Base = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 ${className}`}
    aria-hidden="true"
  />
)

const TextLine = ({ width = 'w-full' }) => (
  <Base className={`h-4 ${width}`} />
)

const TextBlock = ({ lines = 3 }) => {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-full']

  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <TextLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  )
}

const PostCardSkeleton = () => (
  <div
    className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
    aria-hidden="true"
  >
    <div className="h-48 bg-gray-200" />
    <div className="p-5">
      <Base className="mb-3 h-4 w-3/4" />
      <Base className="mb-2 h-3 w-full" />
      <Base className="mb-2 h-3 w-5/6" />
      <Base className="mb-4 h-3 w-2/3" />
      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <Base className="h-7 w-7 rounded-full" />
        <Base className="h-3 w-20" />
      </div>
    </div>
  </div>
)

const DetailSkeleton = () => (
  <div className="animate-pulse" aria-hidden="true">
    <Base className="mb-8 h-64 w-full rounded-xl sm:h-80 lg:h-96" />
    <div className="mx-auto max-w-3xl">
      <Base className="mb-4 h-8 w-3/4" />
      <div className="mb-6 flex items-center gap-3">
        <Base className="h-9 w-9 rounded-full" />
        <Base className="h-4 w-24" />
        <Base className="h-4 w-32" />
        <Base className="h-6 w-20 rounded-full" />
      </div>
      <TextBlock lines={7} />
    </div>
  </div>
)

const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="animate-pulse" aria-hidden="true">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Base className="h-4 w-20" />
      </td>
    ))}
  </tr>
)

const Skeleton = {
  Base,
  TextLine,
  TextBlock,
  PostCard: PostCardSkeleton,
  Detail: DetailSkeleton,
  TableRow: TableRowSkeleton,
}

export default Skeleton
