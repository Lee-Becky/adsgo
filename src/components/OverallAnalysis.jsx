import { Sparkles, ChevronRight, TrendingUp, TrendingDown, DollarSign, Target, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const OverallAnalysis = () => {
  const [showDrawer, setShowDrawer] = useState(false)

  return (
    <>
      <div className="bg-gradient-to-r from-primary/10 to-purple-100/30 rounded-xl border border-primary/20 p-4 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="text-primary" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Today's Overview</h2>
                <span className="text-xs font-bold text-gray-600">Updated: January 4, 2026, 13:24:56 (UTC-8)</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Based on last 7 days data</p>
            </div>
          </div>
          <button
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            View Details
            <ChevronRight size={16} />
          </button>
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

      {/* Right Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDrawer(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Overall Insight</h2>
                <p className="text-white/80 text-sm mt-1">AI-generated insights based on last 7 days data</p>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Today's Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-gray-600 mb-1">Total Budget Today</p>
                  <p className="text-2xl font-bold text-primary">¥1,750</p>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-gray-600 mb-1">Avg Cost/Conv.</p>
                  <p className="text-2xl font-bold text-primary">¥34.50</p>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-gray-600 mb-1">ROAS</p>
                  <p className="text-2xl font-bold text-primary">6.95</p>
                </div>
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-green-600" />
                    <span className="font-semibold text-gray-700">Overall Performance</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">Excellent</p>
                  <p className="text-sm text-gray-600 mt-1">Overall ROI increased by 23%</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-yellow-600" />
                    <span className="font-semibold text-gray-700">Cost Efficiency</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">Good</p>
                  <p className="text-sm text-gray-600 mt-1">CPC decreased by 8%</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-blue-600" />
                    <span className="font-semibold text-gray-700">Conversion Performance</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">Excellent</p>
                  <p className="text-sm text-gray-600 mt-1">Conversion rate increased by 15%</p>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-5 mb-6 border border-primary/20">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Key Findings
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 font-bold">•</span>
                    <span>Brand promotion Campaign performance outstanding, ROI reached 4.2, recommend increasing budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5 font-bold">•</span>
                    <span>Search ad CTR is low (1.2%), recommend optimizing keywords and ad creative</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 font-bold">•</span>
                    <span>Display ad CVR reached 3.5%, exceeding industry average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5 font-bold">•</span>
                    <span>Facebook Ads cost is relatively high, recommend reevaluating投放 strategy</span>
                  </li>
                </ul>
              </div>

              {/* Performance by Channel */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Performance by Channel</h3>
                <div className="space-y-3">
                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Google Ads</span>
                      <span className="text-sm text-green-600 font-medium">ROI 4.2</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Facebook Ads</span>
                      <span className="text-sm text-red-600 font-medium">ROI 1.8</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">TikTok Ads</span>
                      <span className="text-sm text-yellow-600 font-medium">ROI 2.5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-5 mb-6 border border-primary/20">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-yellow-600" />
                  AI Recommended Actions
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Increase daily budget of brand promotion Campaign from ¥500 to ¥800</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Run A/B tests on 3 underperforming search ads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Pause ad groups in Facebook Ads with ROI below 2.0</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>Consider increasing video content diversity for TikTok Ads targeting young audiences</span>
                  </li>
                </ul>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Risk Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle size={18} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">High Risk</p>
                      <p className="text-sm text-red-700 mt-1">Facebook Ads retargeting Campaign ROI continues to decline, immediate optimization needed</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle size={18} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Medium Risk</p>
                      <p className="text-sm text-yellow-700 mt-1">Search ad CTR below industry average, recommend optimizing soon</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle size={18} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Low Risk</p>
                      <p className="text-sm text-green-700 mt-1">Display ads and brand promotion stable, can expand scale appropriately</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OverallAnalysis
