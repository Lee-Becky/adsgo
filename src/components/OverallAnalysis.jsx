import { Sparkles } from 'lucide-react'

const OverallAnalysis = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-purple-100/30 rounded-xl border border-primary/20 p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="text-primary" size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Today's Overview</h2>
            <span className="text-xs font-bold text-gray-600">Updated: January 4, 2026, 13:24:56 (UTC-8)</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Based on last 14 days data</p>
        </div>
      </div>

        <div className="space-y-2 flex-1">
          <p className="text-gray-700 leading-relaxed text-sm">
            Overall performance improved by <span className="text-green-600 font-semibold">23%</span> compared to yesterday, ROI increased from 3.2 to 4.2, and conversion cost decreased by 15%.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="pl-3 border-l-4 border-green-500">
              <p className="text-xs font-semibold text-gray-900 mb-1">Today's Highlights</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                <li>• Brand promotion Campaign ROI reached 4.2, exceeding target by 40%</li>
                <li>• Display ad CVR reached 3.5%, industry leading</li>
                <li>• TikTok Ads CTR increased to 3.2%, young audience response positive</li>
              </ul>
            </div>

            <div className="pl-3 border-l-4 border-yellow-500">
              <p className="text-xs font-semibold text-gray-900 mb-1">Key Insights</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                <li>• Search ad CTR still below industry average (1.2% vs 2.5%), keywords need optimization</li>
                <li>• Facebook Ads cost is high, recommend reevaluating投放 strategy</li>
                <li>• Overall traffic quality stable, invalid click rate decreased by 8%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
}

export default OverallAnalysis
