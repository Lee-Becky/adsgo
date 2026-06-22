import { X as CloseIcon, Send } from 'lucide-react';
import { AiAvatar } from './constants';

export default function RegeneratePanel({
  regenInitialImages,
  regenIsMultiple,
  regenChatInput,
  onSetRegenChatInput,
  onSetShowRegenerateChat,
  onSubmit,
}) {
  return (
    <div className="w-[360px] shrink-0 min-h-0 bg-white rounded-2xl border border-[#F0F0F0] card-shadow flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F5] bg-neutral-50/50 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">
            <AiAvatar uid="regen_hdr" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-neutral-900">AdsGo Creative Expert</h3>
            <div className="flex items-center gap-1.5 text-[14px] text-neutral-400 font-normal mt-0.5">
              <span>Regenerate</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onSetShowRegenerateChat(false)}
          className="p-2 hover:bg-neutral-100 text-neutral-400 rounded-full transition-all"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* User bubble */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2.5 bg-primary-50 rounded-xl rounded-tr-sm px-3.5 py-2.5">
            {regenInitialImages.length > 0 && (
              <div className="relative w-9 h-9 rounded-md overflow-hidden shrink-0">
                <img src={regenInitialImages[0]} className="w-full h-full object-cover" alt="" />
                {regenInitialImages.length > 1 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-[10px] leading-none">+{regenInitialImages.length - 1}</span>
                  </div>
                )}
              </div>
            )}
            <span className="text-[16px] text-primary-700">
              {regenIsMultiple ? 'Regenerate These Creatives' : 'Regenerate This Creative'}
            </span>
          </div>
        </div>

        {/* AI message */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5"><AiAvatar uid="regen_ai" /></div>
          <div className="flex-1 pt-1">
            <p className="text-[16px] text-[#141414] mt-2 leading-relaxed">
              What to change? Just tell me below. A new version will be generated based on your prompt.
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 px-5 pb-5 pt-2">
        <div className="bg-[#F7F8FA] rounded-2xl border border-neutral-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
          <textarea
            autoFocus
            placeholder="e.g. Make the background darker, add a discount badge..."
            value={regenChatInput}
            onChange={e => {
              onSetRegenChatInput(e.target.value);
              const ta = e.target;
              ta.style.height = 'auto';
              ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && regenChatInput.trim()) {
                e.preventDefault();
                onSubmit();
              }
            }}
            style={{ minHeight: '76px', maxHeight: '160px', overflowY: 'auto' }}
            className="w-full px-4 pt-3.5 pb-1 text-sm bg-transparent resize-none focus:outline-none placeholder:text-neutral-400"
          />
          <div className="flex justify-end px-3 pb-3 pt-1">
            <button
              disabled={!regenChatInput.trim()}
              onClick={onSubmit}
              className="w-8 h-8 flex items-center justify-center bg-primary-500 disabled:bg-neutral-200 text-white disabled:text-neutral-400 rounded-full transition-all hover:bg-primary-600 active:bg-primary-700 shadow-sm shadow-primary-500/20"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
