import React from 'react';
import { Save, ArrowRight, Settings2 } from 'lucide-react';

/**
 * 广告结构配置已就绪后的确认应用条：
 *  - "保存结构，下次快速使用"（弹窗输入名称 → 保存并继续）
 *  - "仅本次使用"（不保存，直接进入下一步）
 */
const ConfirmActionBar = ({ onSaveAndContinue, onUseOnce }) => (
  <div className="bg-gradient-to-r from-primary-50/60 via-white to-violet-50/40 rounded-2xl border border-primary-500/10 p-5 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-sm shrink-0">
          <Settings2 size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">广告结构配置已就绪</p>
          <p className="text-xs text-gray-500 mt-0.5">是否将本次配置保存为模板，便于下次快速使用？</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSaveAndContinue}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-semibold text-primary-600 bg-white border-2 border-primary-500/30 rounded-base hover:border-primary-500 hover:bg-primary-50 transition-all"
        >
          <Save size={13} />
          保存结构，下次快速使用
        </button>
        <button
          type="button"
          onClick={onUseOnce}
          className="inline-flex items-center gap-1.5 h-10 px-5 text-xs font-semibold text-white bg-primary-500 rounded-base hover:bg-primary-600 transition-all shadow-md"
        >
          仅本次使用
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmActionBar;
