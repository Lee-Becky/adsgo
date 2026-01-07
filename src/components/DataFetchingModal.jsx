import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'

const DataFetchingModal = ({ onGenerateCreative, onNewCampaign, onViewDemo }) => {
  return (
    <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
      <div className="max-w-3xl w-full px-6">
        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={32} className="text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Note
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="text-center mb-10">
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Data is being fetched and analyzed for your linked ad accounts. Please wait!
          </p>
          <p className="text-lg text-gray-600">
            You can choose to generate new creatives or campaigns.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <button
            onClick={onGenerateCreative}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Generate Creative</span>
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onNewCampaign}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold py-4 px-8 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <span>New Campaign</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* View Demo Mode Link */}
        <div className="text-center">
          <button
            onClick={onViewDemo}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors group"
          >
            <span>View Demo Mode</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Click to see the complete demo data and interactive effects
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataFetchingModal
