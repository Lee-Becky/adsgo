import { X } from 'lucide-react';

export default function DiscardModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">Start New AI Creative?</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 text-neutral-400 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            You have an unfinished creative in progress. Starting a new one will discard your current selections.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 h-9 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium rounded-full hover:bg-neutral-50 whitespace-nowrap transition-all"
            >
              Keep Editing
            </button>
            <button
              onClick={() => { onClose(); onConfirm(); }}
              className="flex-1 px-4 h-9 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 whitespace-nowrap transition-all shadow-sm shadow-primary-500/20"
            >
              Discard & Start New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
