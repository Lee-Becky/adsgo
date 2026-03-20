import { useCallback, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { Minus, Plus } from 'lucide-react'
import countries110m from 'world-atlas/countries-110m.json'

/** Madgicx 地图：绿=表现好，灰=中性；按 GDP 分层近似 Tier（演示用） */
const TIER1_ISO = new Set([
  'US',
  'CA',
  'GB',
  'DE',
  'FR',
  'IT',
  'ES',
  'AU',
  'JP',
  'NL',
  'SE',
  'NO',
  'CH',
  'AT',
  'BE',
  'IE',
  'NZ',
  'SG',
  'KR',
  'DK',
  'FI',
  'LU',
  'IL',
  'AE'
])
const TIER2_ISO = new Set([
  'BR',
  'MX',
  'PL',
  'TR',
  'PT',
  'GR',
  'CZ',
  'HU',
  'RO',
  'CL',
  'AR',
  'CO',
  'ZA',
  'TH',
  'MY',
  'SA',
  'TW',
  'RU'
])
const TIER3_ISO = new Set([
  'CN',
  'IN',
  'ID',
  'PH',
  'VN',
  'EG',
  'NG',
  'KE',
  'MA',
  'PK',
  'BD',
  'UA'
])

function isoFromGeo(geo) {
  const p = geo.properties || {}
  const iso = p.ISO_A2 || p.WB_A2 || p.ADM0_A3 || ''
  if (iso === '-99' || iso.length !== 2) return null
  return iso
}

function fillForCountry(iso, tierFilter) {
  const ocean = '#f1f5f9'
  const neutral = '#e2e8f0'
  const muted = '#cbd5e1'
  const good = '#bbf7d0'
  const better = '#4ade80'

  if (!iso) return ocean

  if (tierFilter === 'top') {
    return iso === 'US' ? better : muted
  }
  if (tierFilter === 't1') {
    return TIER1_ISO.has(iso) ? good : muted
  }
  if (tierFilter === 't2') {
    return TIER2_ISO.has(iso) ? good : muted
  }
  if (tierFilter === 't3') {
    return TIER3_ISO.has(iso) ? good : muted
  }
  if (tierFilter === 't4') {
    if (TIER1_ISO.has(iso) || TIER2_ISO.has(iso) || TIER3_ISO.has(iso)) return muted
    return good
  }
  // all：参考账号以美国为主 — 美国偏绿，其余中性
  return iso === 'US' ? good : neutral
}

const MAP_W = 960
const MAP_H = 420

/**
 * @param {{ tierFilter: string, onTierFilterChange?: (id: string) => void }} props
 */
export function GeoAuditWorldMap({ tierFilter = 'all', onTierFilterChange }) {
  const [zoom, setZoom] = useState(1)

  const bumpZoom = useCallback((delta) => {
    setZoom((z) => Math.min(5, Math.max(0.6, Math.round((z + delta) * 20) / 20)))
  }, [])

  const tierButtons = useMemo(
    () => [
      { id: 'top', label: 'Top country' },
      { id: 't1', label: 'Tier 1' },
      { id: 't2', label: 'Tier 2' },
      { id: 't3', label: 'Tier 3' },
      { id: 't4', label: 'Tier 4' }
    ],
    []
  )

  return (
    <div className="relative h-[min(420px,55vh)] min-h-[280px] w-full bg-[#eef2f7]">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 168, center: [0, 12] }}
        width={MAP_W}
        height={MAP_H}
        className="h-full w-full max-h-[420px] [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-[420px]"
      >
        <ZoomableGroup zoom={zoom} center={[0, 12]} minZoom={0.5} maxZoom={5}>
          <Geographies geography={countries110m}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = isoFromGeo(geo)
                const fill = fillForCountry(iso, tierFilter)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill,
                        stroke: '#94a3b8',
                        strokeWidth: 0.35,
                        outline: 'none'
                      },
                      hover: {
                        fill: iso ? '#a5b4fc' : fill,
                        stroke: '#64748b',
                        strokeWidth: 0.5,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#818cf8',
                        stroke: '#475569',
                        outline: 'none'
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#eef2f7]/90 via-transparent to-transparent" />

      <div className="absolute right-3 top-3 flex flex-col gap-1 rounded-lg border border-gray-200 bg-white/95 p-1 shadow-sm pointer-events-auto">
        <button
          type="button"
          className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-50"
          aria-label="Zoom in"
          onClick={() => bumpZoom(0.25)}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-50"
          aria-label="Zoom out"
          onClick={() => bumpZoom(-0.25)}
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 pointer-events-auto">
        {tierButtons.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTierFilterChange?.(t.id)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
              tierFilter === t.id
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
