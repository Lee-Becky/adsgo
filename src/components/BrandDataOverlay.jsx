import { 
  Database, 
  Rocket, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  ArrowRight
} from 'lucide-react'

const BrandDataOverlay = ({ 
  status = 'no-accounts', 
  onConnectAccount, 
  onCreateCampaign, 
  onRetry,
  onViewDemo,
  onViewError
}) => {
  // Status: 'no-accounts' | 'fetching' | 'no-data'
  
  if (status === 'no-accounts') {
    return (
      <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
        <div className="p-6 w-full h-full flex items-center justify-center">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                <Rocket size={20} />
                <span className="text-base font-bold">Get Started with AdsGo</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Connect Ad Accounts, Enable Smart Optimization
              </h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Choose your starting point and experience AI-driven ad management immediately
              </p>
            </div>

            {/* Two Path Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Connect Account */}
              <div 
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                onClick={onConnectAccount}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-primary to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Database size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Connect Ad Account</h2>
                    <p className="text-gray-500 text-sm">Sync existing ad data</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  Already have Google, Meta, or TikTok ad accounts? Connect now to get real-time AI budget optimization recommendations and performance insights.
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Auto-import all active campaigns</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>AI analyzes historical performance data</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Get personalized budget recommendations</span>
                  </li>
                </ul>

                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white text-base font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
                  <span>Connect Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Option 2: Create New Campaign */}
              <div 
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                onClick={onCreateCampaign}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Rocket size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Create New Campaign</h2>
                    <p className="text-gray-500 text-sm">Start from scratch</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  Ready to start a new ad campaign? Use our AI assistant to set up and launch optimized campaigns in minutes.
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>AI-guided campaign setup wizard</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Smart budget recommendations</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>One-click cross-platform publishing</span>
                  </li>
                </ul>

                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
                  <span>Start Creating</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'fetching') {
    return (
      <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full px-6 text-center">
          {/* Loading Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Fetching Data
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-2">
              Data is being fetched and analyzed, please wait...
            </p>
            <p className="text-sm text-gray-500">
              We are syncing the latest ad data from your connected ad accounts
            </p>
          </div>

          {/* Loading Progress Indicator */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Data Syncing</span>
              <span className="animate-pulse">Processing...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={onViewDemo}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors group text-sm"
            >
              <span>View demo</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onViewError}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group text-sm"
            >
              <span>View error</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'no-data') {
    return (
      <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
        <div className="max-w-2xl w-full px-6 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-full shadow-2xl">
                <AlertCircle size={48} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Data Fetching Error
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-3">
              Please check if your connected account has active ads
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-orange-700">If you have active ads:</span> Please click the retry button to fetch data again
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-orange-700">If no active ads:</span> Please publish ads first to view data
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white text-base font-semibold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Retry Fetching Data</span>
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default BrandDataOverlay
