import { X } from 'lucide-react';
import { useZIndex } from '../../../../hooks/useZIndex';

export default function ConnectPlatformModal({ isOpen, platformName, onClose, onConnect }) {
  const zIndex = useZIndex(isOpen);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      style={{ zIndex }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Connect {platformName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Authorize access to import your product catalog directly.</p>
          <button
            onClick={onConnect}
            className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm shadow-primary-500/20 transition-all"
          >
            Authorize &amp; Connect
          </button>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <span className="text-xs text-gray-500 hover:text-primary-600 transition-colors cursor-pointer">
            Manage all connections in Settings &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
