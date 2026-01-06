import { Sparkles, Rocket, Database, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'

const GlobalDemoOverlay = ({ onConnect, onCreate }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      onConnect()
    }, 2000)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      onCreate()
    }, 2000)
  }

  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-br from-white/60 via-purple-50/60 to-white/60 flex items-center justify-center">
      <div className="p-8 w-full h-full flex items-center justify-center">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
              <Sparkles size={24} />
              <span className="text-2xl font-bold">Welcome to AdsGo</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Unlock AI-Powered Campaign Optimization
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You're currently viewing demo data. Choose your path to get started with real campaign insights.
            </p>
          </div>

          {/* Two Path Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Connect Account */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Database size={40} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Connect Active Ad Account</h2>
                  <p className="text-gray-500">Sync your existing campaigns</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Already have ads running on Google, Meta, or TikTok? Connect your account to get real-time AI budget optimizations and performance insights.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Import all active campaigns automatically</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>AI analyzes your historical performance</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Get personalized budget suggestions</span>
                </li>
              </ul>

              <button
                onClick={handleConnect}
                disabled={isConnecting || isCreating}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect Now</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Create New Campaign */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
                  <Rocket size={40} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Create New Campaign</h2>
                  <p className="text-gray-500">Start from scratch</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ready to start fresh? Use our AI assistant to set up and launch your first optimized campaign in minutes.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>AI-guided campaign setup wizard</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Smart budget recommendations</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Launch across multiple platforms</span>
                </li>
              </ul>

              <button
                onClick={handleCreate}
                disabled={isConnecting || isCreating}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold py-4 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Get Started</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-primary/30 text-gray-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <span>👁️ Preview Mode: The data shown above is for demonstration purposes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalDemoOverlay
