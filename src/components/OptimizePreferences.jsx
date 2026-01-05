import { useState } from 'react'
import { Settings, X, Minus, Plus, ListChecks } from 'lucide-react'

const OptimizePreferences = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [rules, setRules] = useState([])
  const [newRule, setNewRule] = useState('')
  const [editingRules, setEditingRules] = useState([])

  const handleOpenConfig = () => {
    console.log('Opening config, current rules:', rules)
    setEditingRules([...rules])
    setIsConfigOpen(true)
  }

  const handleAddRule = () => {
    if (newRule.trim()) {
      const updatedRules = [...editingRules, newRule.trim()]
      console.log('Adding rule, editingRules:', updatedRules)
      setEditingRules(updatedRules)
      setNewRule('')
    }
  }

  const handleDeleteRule = (index) => {
    const updatedRules = editingRules.filter((_, i) => i !== index)
    console.log('Deleting rule, editingRules:', updatedRules)
    setEditingRules(updatedRules)
  }

  const handleUpdateRule = (index, value) => {
    const updatedRules = [...editingRules]
    updatedRules[index] = value
    console.log('Updating rule, editingRules:', updatedRules)
    setEditingRules(updatedRules)
  }

  const handleSave = () => {
    console.log('Save clicked, newRule:', newRule)
    console.log('Save clicked, editingRules:', editingRules)
    
    // 如果输入框有内容，先添加到编辑列表
    let finalRules = [...editingRules]
    if (newRule.trim()) {
      finalRules = [...finalRules, newRule.trim()]
      console.log('Adding newRule to finalRules:', finalRules)
    }
    
    console.log('Setting rules to:', finalRules)
    setRules(finalRules)
    setNewRule('')
    setIsConfigOpen(false)
  }

  console.log('Rendering, rules:', rules)

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md border-2 border-blue-600/30 h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-blue-600/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/10 rounded-lg">
            <ListChecks size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-600">Optimize preferences</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Monitor and optimize according to your preferences
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenConfig}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Settings size={14} />
          Config
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {rules.length > 0 ? (
          <div className="space-y-2">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="p-2 bg-white rounded-lg border border-blue-600/20 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 text-xs">•</span>
                  <p className="text-xs text-gray-700 flex-1 leading-tight">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-gray-700 leading-relaxed">
              If you want adsgo to monitor and provide timely optimization suggestions for your trigger rules based on your optimization rules, please configure it now;
            </p>
          </div>
        )}
      </div>

      {/* Config Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsConfigOpen(false)}
          />

          {/* Modal */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Configure Optimization Rules
              </h2>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {editingRules.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No rules configured yet. Add your first rule below.
                </div>
              ) : (
                <div className="space-y-3">
                  {editingRules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm"
                      />
                      <button
                        onClick={() => handleDeleteRule(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete rule"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Rule */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                    placeholder="Add new optimization rule..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm"
                  />
                  <button
                    onClick={handleAddRule}
                    className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    title="Add rule"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-gray-50">
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OptimizePreferences
