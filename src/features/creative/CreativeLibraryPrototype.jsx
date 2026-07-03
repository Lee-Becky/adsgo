import { useMemo, useState } from 'react'
import {
  Check,
  Eye,
  Filter,
  Image as ImageIcon,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react'

const initialAssets = [
  {
    id: 'asset-1',
    name: 'Core Legging Video V12',
    type: 'Video',
    format: 'MP4',
    size: '1080 x 1920',
    duration: '00:18',
    usage: 12,
    owner: 'LumaFit',
    updatedAt: '2026-06-29 09:40',
    tags: ['Legging', 'UGC', 'Prospecting'],
    thumbnail: 'from-neutral-950 via-orange-500 to-amber-300',
    previewTitle: 'ORDER NOW',
  },
  {
    id: 'asset-2',
    name: 'Customer Proof Carousel',
    type: 'Image',
    format: 'PNG',
    size: '1080 x 1080',
    duration: '-',
    usage: 8,
    owner: 'LumaFit',
    updatedAt: '2026-06-29 09:18',
    tags: ['Review', 'Retargeting'],
    thumbnail: 'from-blue-500 via-sky-300 to-amber-100',
    previewTitle: 'SOCIAL PROOF',
  },
  {
    id: 'asset-3',
    name: 'UGC Hook 01 - Compression Fit',
    type: 'Video',
    format: 'MP4',
    size: '1080 x 1920',
    duration: '00:15',
    usage: 0,
    owner: 'LumaFit',
    updatedAt: '2026-06-29 11:05',
    tags: ['UGC', 'New Hook'],
    thumbnail: 'from-cyan-400 via-teal-300 to-orange-400',
    previewTitle: 'GRAB IT',
  },
  {
    id: 'asset-4',
    name: 'Studio Static Set A',
    type: 'Image',
    format: 'JPG',
    size: '1200 x 1200',
    duration: '-',
    usage: 5,
    owner: 'LumaFit',
    updatedAt: '2026-06-28 16:22',
    tags: ['Studio', 'Product'],
    thumbnail: 'from-red-500 via-orange-300 to-amber-100',
    previewTitle: 'SPECIAL',
  },
  {
    id: 'asset-5',
    name: 'Morning Routine UGC Draft',
    type: 'Video',
    format: 'MP4',
    size: '1080 x 1920',
    duration: '00:21',
    usage: 0,
    owner: 'LumaFit',
    updatedAt: '2026-06-29 13:12',
    tags: ['Routine', 'UGC'],
    thumbnail: 'from-lime-300 via-yellow-300 to-green-600',
    previewTitle: 'MORNING',
  },
  {
    id: 'asset-6',
    name: 'Brand Search Static Banner',
    type: 'Image',
    format: 'WEBP',
    size: '1600 x 900',
    duration: '-',
    usage: 4,
    owner: 'LumaFit',
    updatedAt: '2026-06-27 18:30',
    tags: ['Search', 'Banner'],
    thumbnail: 'from-violet-500 via-indigo-500 to-slate-800',
    previewTitle: 'VALUE',
  },
]

const typeIcon = {
  Video,
  Image: ImageIcon,
}

const AssetPreview = ({ asset, compact = false }) => (
  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${asset.thumbnail} ${compact ? 'aspect-square' : 'aspect-[4/5]'}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_30%)]" />
    <div className="absolute left-3 right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-center text-[11px] font-black leading-tight text-neutral-950 shadow-sm">
      {asset.previewTitle}
    </div>
    <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-neutral-950/30 px-3 py-2 text-white backdrop-blur-sm">
      <p className="truncate text-xs font-semibold">{asset.name}</p>
      <p className="text-[10px] opacity-80">{asset.format} · {asset.size}</p>
    </div>
  </div>
)

const CreativeLibraryPrototype = () => {
  const [assets, setAssets] = useState(initialAssets)
  const [previewAsset, setPreviewAsset] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  const filteredAssets = useMemo(() => assets.filter((asset) => {
    const matchesFilter = filter === 'All' || asset.type === filter
    const text = `${asset.name} ${asset.tags.join(' ')}`.toLowerCase()
    return matchesFilter && text.includes(query.toLowerCase())
  }), [assets, filter, query])

  const toggleSelect = (event, id) => {
    event.stopPropagation()
    setSelectedIds((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ))
  }

  const deleteSelected = () => {
    setAssets((prev) => prev.filter((asset) => !selectedIds.includes(asset.id)))
    if (previewAsset && selectedIds.includes(previewAsset.id)) setPreviewAsset(null)
    setSelectedIds([])
  }

  const deleteAsset = (event, id) => {
    event.stopPropagation()
    setAssets((prev) => prev.filter((asset) => asset.id !== id))
    setSelectedIds((prev) => prev.filter((item) => item !== id))
    if (previewAsset?.id === id) setPreviewAsset(null)
  }

  return (
    <div className="-mx-6 min-h-[100dvh] bg-neutral-50 px-6 py-6 text-neutral-900 lg:px-8">
      <div className="w-full space-y-5">
        <header className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-neutral-500">统一管理图片、视频和待发布素材，支持筛选、选择、删除和预览。</p>
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={deleteSelected}
                className="inline-flex items-center gap-2 rounded-lg bg-danger-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger-600"
              >
                <Trash2 size={15} /> 删除 {selectedIds.length} 个
              </button>
            )}
            <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-600">
              <Upload size={15} /> 上传素材
            </button>
          </div>
        </header>

        <main>
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative max-w-md flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索素材名称或标签"
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter size={15} className="text-neutral-400" />
                {['All', 'Image', 'Video'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      filter === item
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 bg-white text-neutral-500 hover:border-primary-200 hover:text-primary-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {filteredAssets.map((asset) => {
                const TypeIcon = typeIcon[asset.type]
                const checked = selectedIds.includes(asset.id)
                return (
                  <button
                    key={asset.id}
                    onClick={() => setPreviewAsset(asset)}
                    className="group overflow-hidden rounded-xl border border-neutral-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                  >
                    <div className="relative">
                      <AssetPreview asset={asset} compact />
                      <button
                        onClick={(event) => toggleSelect(event, asset.id)}
                        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition-colors ${
                          checked
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-white/80 bg-white/90 text-transparent group-hover:text-neutral-300'
                        }`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-neutral-950">{asset.name}</p>
                        <p className="mt-0.5 truncate text-[10px] text-neutral-500">{asset.format} · {asset.size}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2 text-[10px] text-neutral-500">
                        <span className="inline-flex items-center gap-1">
                          <TypeIcon size={11} /> {asset.type}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-primary-600">
                          <Eye size={11} /> 预览
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {filteredAssets.length === 0 && (
              <div className="mt-5 flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 text-neutral-400">
                <ImageIcon size={36} />
                <p className="mt-3 text-sm font-medium">没有匹配的素材</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {previewAsset && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <button
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
            onClick={() => setPreviewAsset(null)}
            aria-label="关闭预览"
          />
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Preview</p>
                <h2 className="mt-1 text-lg font-semibold text-neutral-950">{previewAsset.name}</h2>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_240px]">
              <AssetPreview asset={previewAsset} />
              <div className="space-y-3">
                {[
                  ['类型', previewAsset.type],
                  ['格式', previewAsset.format],
                  ['尺寸', previewAsset.size],
                  ['时长', previewAsset.duration],
                  ['更新时间', previewAsset.updatedAt],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-neutral-50 px-3 py-2">
                    <p className="text-[10px] text-neutral-400">{label}</p>
                    <p className="mt-1 text-xs font-semibold text-neutral-800">{value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-semibold text-neutral-500">标签</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewAsset.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(event) => deleteAsset(event, previewAsset.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-600 transition-colors hover:bg-danger-100"
                >
                  <Trash2 size={15} /> 删除素材
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreativeLibraryPrototype
