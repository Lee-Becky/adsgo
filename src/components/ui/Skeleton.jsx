const base = 'animate-shimmer bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%]'

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 rounded-md ${base}`}
        style={{ width: i === lines - 1 ? '60%' : i === lines - 2 ? '80%' : '100%' }}
      />
    ))}
  </div>
)

export const SkeletonCard = ({ className = '' }) => (
  <div className={`h-48 rounded-xl ${base} ${className}`} />
)

export const SkeletonMetric = ({ className = '' }) => (
  <div className={`flex flex-col gap-2 p-5 ${className}`}>
    <div className={`h-3 w-20 rounded-md ${base}`} />
    <div className={`h-8 w-32 rounded-md ${base}`} />
    <div className={`h-3 w-16 rounded-md ${base}`} />
  </div>
)

export const SkeletonAvatar = ({ size = 32, className = '' }) => (
  <div
    className={`rounded-lg ${base} ${className}`}
    style={{ width: size, height: size }}
  />
)

export const SkeletonTableRow = ({ cols = 5, className = '' }) => (
  <div className={`flex items-center gap-4 h-11 px-4 ${className}`}>
    {Array.from({ length: cols }).map((_, i) => (
      <div key={i} className={`h-4 rounded-md flex-1 ${base}`} />
    ))}
  </div>
)

const Skeleton = { Text: SkeletonText, Card: SkeletonCard, Metric: SkeletonMetric, Avatar: SkeletonAvatar, TableRow: SkeletonTableRow }
export default Skeleton
