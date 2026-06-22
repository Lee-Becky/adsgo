/* ── Shimmer base ─────────────────────────────────────────── */
const shimmerBase = 'animate-shimmer bg-gradient-to-r from-neutral-100 via-neutral-200/60 to-neutral-100 bg-[length:200%_100%] rounded-sm'

/* ── Text skeleton ────────────────────────────────────────── */
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`} role="status" aria-label="Loading">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 rounded-sm ${shimmerBase}`}
        style={{
          width: i === lines - 1 ? '60%' : i === lines - 2 ? '80%' : '100%',
        }}
      />
    ))}
  </div>
)

/* ── Card skeleton ────────────────────────────────────────── */
export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`rounded-lg overflow-hidden ${className}`}
    role="status"
    aria-label="Loading"
  >
    {/* Image area */}
    <div className={`h-32 ${shimmerBase} rounded-none`} />
    {/* Content area */}
    <div className="p-4 space-y-3">
      <div className={`h-5 w-3/4 ${shimmerBase}`} />
      <div className={`h-4 w-full ${shimmerBase}`} />
      <div className={`h-4 w-2/3 ${shimmerBase}`} />
    </div>
  </div>
)

/* ── Chart skeleton ───────────────────────────────────────── */
export const SkeletonChart = ({ className = '' }) => (
  <div
    className={`p-4 ${className}`}
    role="status"
    aria-label="Loading chart"
  >
    {/* Chart area */}
    <div className="flex items-end gap-2 h-40">
      {[40, 65, 50, 80, 35, 70, 55, 90, 45, 60].map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm ${shimmerBase}`}
          style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
    {/* X-axis labels */}
    <div className="flex gap-2 mt-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`flex-1 h-3 ${shimmerBase}`} />
      ))}
    </div>
  </div>
)

/* ── Table skeleton ───────────────────────────────────────── */
export const SkeletonTableRow = ({ cols = 5, className = '' }) => (
  <div className={`flex items-center gap-4 h-12 px-4 ${className}`} role="status" aria-label="Loading row">
    {Array.from({ length: cols }).map((_, i) => (
      <div key={i} className={`h-4 flex-1 ${shimmerBase}`} />
    ))}
  </div>
)

const SkeletonTable = ({ rows = 5, cols = 5, className = '' }) => (
  <div className={className} role="status" aria-label="Loading table">
    {/* Header */}
    <div className="flex items-center gap-4 h-10 px-4 surface-nested border-b border-neutral-200">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className={`h-3 flex-1 ${shimmerBase} opacity-70`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 h-12 px-4 border-b border-neutral-100"
        style={{ animationDelay: `${i * 50}ms` }}
      >
        {Array.from({ length: cols }).map((_, j) => (
          <div
            key={j}
            className={`h-4 flex-1 ${shimmerBase}`}
            style={{ width: j === 0 ? '30%' : undefined }}
          />
        ))}
      </div>
    ))}
  </div>
)

/* ── KPI / Metric skeleton ────────────────────────────────── */
export const SkeletonMetric = ({ className = '' }) => (
  <div className={`flex flex-col gap-2.5 p-5 ${className}`} role="status" aria-label="Loading metric">
    <div className={`h-3 w-20 ${shimmerBase}`} />
    <div className={`h-8 w-32 ${shimmerBase}`} />
    <div className={`h-3 w-16 ${shimmerBase}`} />
  </div>
)

/* ── Avatar skeleton ──────────────────────────────────────── */
export const SkeletonAvatar = ({ size = 32, className = '' }) => (
  <div
    className={`rounded-md ${shimmerBase} ${className}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading avatar"
  />
)

/* ── Custom skeleton ──────────────────────────────────────── */
const SkeletonCustom = ({ width, height, className = '' }) => (
  <div
    className={`${shimmerBase} ${className}`}
    style={{ width, height }}
    role="status"
    aria-label="Loading"
  />
)

/* ── Unified Skeleton Component ───────────────────────────── */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  lines = 3,
  rows,
  cols,
  size,
  className = '',
}) => {
  switch (variant) {
    case 'text':
      return <SkeletonText lines={lines} className={className} />
    case 'card':
      return <SkeletonCard className={className} />
    case 'chart':
      return <SkeletonChart className={className} />
    case 'table':
      return <SkeletonTable rows={rows} cols={cols} className={className} />
    case 'kpi':
      return <SkeletonMetric className={className} />
    case 'avatar':
      return <SkeletonAvatar size={size} className={className} />
    case 'custom':
      return <SkeletonCustom width={width} height={height} className={className} />
    default:
      return <SkeletonCustom width={width} height={height} className={className} />
  }
}

// Compound component API (backward compat)
Skeleton.Text = SkeletonText
Skeleton.Card = SkeletonCard
Skeleton.Chart = SkeletonChart
Skeleton.Table = SkeletonTable
Skeleton.Metric = SkeletonMetric
Skeleton.Avatar = SkeletonAvatar
Skeleton.TableRow = SkeletonTableRow
Skeleton.Custom = SkeletonCustom

export { SkeletonChart }
export default Skeleton
