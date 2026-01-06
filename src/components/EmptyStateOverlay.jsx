import { Link, Rocket, Zap, Sparkles } from 'lucide-react'

const EmptyStateOverlay = ({ onConnectAccount }) => {
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-primary to-purple-600 p-6 rounded-full shadow-2xl">
              <Rocket size={48} className="text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to Optimize Your Campaigns?
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Connect your ad accounts to unlock AI-powered budget optimizations, 
          real-time performance insights, and automated recommendations.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-primary/10 to-purple-100/30 p-6 rounded-xl border border-primary/20">
            <Zap size={32} className="text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600">Get intelligent budget suggestions based on performance data</p>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-purple-100/30 p-6 rounded-xl border border-primary/20">
            <Sparkles size={32} className="text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-sm text-gray-600">Monitor your campaigns with live performance metrics</p>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-purple-100/30 p-6 rounded-xl border border-primary/20">
            <Link size={32} className="text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Easy Integration</h3>
            <p className="text-sm text-gray-600">Connect Google, Meta, and TikTok in minutes</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onConnectAccount}
            className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Connect Ad Account
          </button>
          
          <button className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-primary hover:text-primary transition-all">
            Create New Campaign
          </button>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Preview Mode: Data shown above is for demonstration purposes</p>
        </div>
      </div>
    </div>
  )
}

export default EmptyStateOverlay
