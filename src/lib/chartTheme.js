/**
 * Shared Recharts theme — keeps every chart visually consistent.
 * All colors reference CSS design tokens from design-tokens.css.
 *
 * Usage:
 *   import { getChartColors, chartGrid, chartAxis, chartTooltip } from '@/lib/chartTheme'
 *
 *   // In component (after mount):
 *   const COLORS = getChartColors()
 *   <Cell fill={COLORS[index]} />
 *
 *   // Static Recharts props:
 *   <CartesianGrid {...chartGrid} />
 *   <XAxis tick={chartAxis} />
 *   <Tooltip contentStyle={chartTooltip} />
 */

const getCSSVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/**
 * Returns resolved hex values for chart-1 through chart-10.
 * Must be called after DOM mount (inside useEffect/useMemo).
 */
export const getChartColors = () =>
  Array.from({ length: 10 }, (_, i) => getCSSVar(`--chart-${i + 1}`))

/**
 * Static chart configuration objects — use CSS vars directly
 * where SVG supports them (stroke, border), or resolved values
 * where they don't (fill in Recharts).
 */
export const chartGrid = {
  stroke: 'var(--neutral-200)',
  strokeDasharray: '3 3',
}

export const chartAxis = {
  fontSize: 11,
  fontWeight: 500,
  fill: 'var(--neutral-500)',
  fontFamily: 'var(--font-body)',
}

export const chartTooltip = {
  fontSize: 12,
  borderRadius: 8,
  padding: '8px 12px',
  border: '1px solid var(--neutral-200)',
  boxShadow: 'var(--shadow-md)',
  backgroundColor: 'var(--surface-card)',
  color: 'var(--neutral-800)',
}

export const chartLegend = {
  fontSize: 12,
  fontFamily: 'var(--font-body)',
}

export const chartArea = { fillOpacity: 0.06 }
export const chartLine = { strokeWidth: 2 }
export const chartDot = { r: 3, fill: '#fff', strokeWidth: 2 }

/**
 * Legacy compat — combined theme object
 */
export const chartTheme = {
  grid: chartGrid,
  axis: chartAxis,
  tooltip: chartTooltip,
  colors: getChartColors,
  area: chartArea,
  line: chartLine,
  dot: chartDot,
}
