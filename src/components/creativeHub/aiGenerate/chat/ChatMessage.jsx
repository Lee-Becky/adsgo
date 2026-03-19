import { Sparkles } from 'lucide-react';

export function AiMessage({ text, children }) {
  return (
    <div className="flex gap-3 msg-in">
      <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">{text}</p>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}

export function UserBubble({ children, onChangeStep }) {
  return (
    <div className="flex justify-end msg-in">
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl text-sm max-w-[90%]">
        {children}
        <button
          onClick={onChangeStep}
          className="text-xs text-primary-500 hover:text-primary-600 font-medium ml-1 flex-shrink-0 transition-colors"
        >
          Change
        </button>
      </div>
    </div>
  );
}
