import { X } from 'lucide-react'

const AdsetDetailModal = ({ isOpen, onClose, adset }) => {
  if (!isOpen || !adset) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform">
        {/* Header with only X icon */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {adset.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content - Only Image */}
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="/ad-preview.jpg" 
              alt="Ad Preview" 
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16"%3EAd Preview Image%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Ad preview for {adset.name}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdsetDetailModal
