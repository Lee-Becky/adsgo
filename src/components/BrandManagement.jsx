import { useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import BrandDetailEdit from './BrandDetailEdit'

const BrandManagement = () => {
  const [editingBrand, setEditingBrand] = useState(null)
  
  // 模拟品牌数据
  const brands = [
    {
      id: 1,
      name: 'neopets',
      logo: '🐾',
      industry: 'Gaming',
      dailyBudget: '$500',
      convGoal: 'Max conversions-purchase',
      kpi: 'ROAS > 400%',
      color: 'bg-purple-500'
    },
    {
      id: 2,
      name: 'gaming studio',
      logo: '🎮',
      industry: 'Gaming',
      dailyBudget: '$1,200',
      convGoal: 'Max conversions-signup',
      kpi: 'CPA <= 30.00 USD',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'tech brand',
      logo: '💻',
      industry: 'Technology',
      dailyBudget: '$2,000',
      convGoal: 'Max leads',
      kpi: 'CPA <= 100.00 USD',
      color: 'bg-green-500'
    }
  ]

  const handleEdit = (brand) => {
    setEditingBrand(brand)
  }

  const handleSave = (updatedBrand) => {
    console.log('Saving brand:', updatedBrand)
    // TODO: 实际保存逻辑
    setEditingBrand(null)
  }

  const handleCancelEdit = () => {
    setEditingBrand(null)
  }

  if (editingBrand) {
    return (
      <BrandDetailEdit
        brand={editingBrand}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={20} />
          <span className="font-medium">New brand</span>
        </button>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={`bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow`}
          >
            {/* Brand Header with Brand Color */}
            <div className={`${brand.color} p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center text-3xl backdrop-blur-sm">
                  {brand.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                  <p className="text-sm text-white/80">{brand.industry}</p>
                </div>
              </div>
            </div>

            {/* Brand Stats */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Daily Budget</p>
                <p className="text-lg font-semibold text-gray-900">{brand.dailyBudget}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Conversion Goal</p>
                <p className="text-base font-semibold text-gray-900">{brand.convGoal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">KPI</p>
                <p className="text-base font-semibold text-gray-900">{brand.kpi}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 pt-0">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(brand)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 py-2.5 rounded-lg transition-colors border border-border"
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 text-sm text-white bg-primary hover:bg-primary/90 py-2.5 rounded-lg transition-colors">
                  <Plus size={16} />
                  <span>New campaign</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrandManagement
