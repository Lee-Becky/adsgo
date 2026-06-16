/**
 * Shared Recharts theme — keeps every chart visually consistent.
 * Import individual keys where needed:
 *   import { chartTheme } from '@/lib/chartTheme'
 */
export const chartTheme = {
  grid:    { stroke: '#E8E6E3', strokeDasharray: '3 3' },
  axis:    { fill: '#78716C', fontSize: 11, fontWeight: 500, fontFamily: 'Inter' },
  tooltip: { bg: '#1C1917', color: '#FAFAF9', radius: 8, padding: '8px 12px', fontSize: 13 },
  colors:  ['#2563EB', '#00C48C', '#F59E0B', '#FF4757', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899'],
  area:    { fillOpacity: 0.06 },
  line:    { strokeWidth: 2 },
  dot:     { r: 3, fill: '#fff', strokeWidth: 2 },
};
