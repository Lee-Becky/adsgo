import { Sparkles } from 'lucide-react';

export default function GalleryEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 h-full">
      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-primary-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Your creative gallery</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-xs">
        Configure your product and style on the left, then hit Generate. All your creatives will appear here.
      </p>
    </div>
  );
}
