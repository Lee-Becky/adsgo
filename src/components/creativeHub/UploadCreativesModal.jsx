import React from 'react';
import { X, UploadCloud } from 'lucide-react';

const UploadCreativesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Upload creatives</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-8">
          <div className="border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50/30 p-12 flex flex-col items-center justify-center min-h-[400px] group hover:border-blue-300 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud size={32} className="text-blue-600" />
            </div>
            
            <h3 className="text-xl font-medium text-blue-700 mb-2">
              Click or drag file to this area to upload
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              Drag & drop or select multiple tagged creatives for bulk upload!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-8 py-2.5 border border-gray-200 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCreativesModal;
