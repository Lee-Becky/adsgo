import React from 'react';
import { Database, X } from 'lucide-react';

/**
 * Phase 2.S：右上角「导入存量系列」小按钮，与 SavedStructuresPicker 并排。
 *
 * Props:
 *  - onClick: () => void           打开 CampaignSearchModal
 *  - selectedCampaign: object|null 已选系列（有则显示紫色 chip + 切换/清除按钮）
 *  - onClear: () => void           清除当前选择
 */
const ImportExistingButton = ({ onClick, selectedCampaign, onClear }) => {
  if (selectedCampaign) {
    return (
      <div
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-xs font-medium"
        title={`已导入系列：${selectedCampaign.name}\n已预填 3 层结构字段，可继续编辑。`}
      >
        <Database size={12} />
        <span className="truncate max-w-[140px]">{selectedCampaign.name}</span>
        <button
          type="button"
          onClick={onClick}
          className="text-[10px] text-violet-600 hover:text-violet-800 underline underline-offset-2 font-medium"
        >
          换
        </button>
        <button
          type="button"
          onClick={onClear}
          className="text-gray-400 hover:text-rose-500 transition-colors"
          title="清除已导入系列"
        >
          <X size={11} />
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border border-gray-200 text-gray-700 bg-white hover:border-primary-500/40 hover:text-primary-600 hover:bg-primary-50/30 transition-all"
      title="选择已存在的广告系列预填 3 层结构字段"
    >
      <Database size={12} />
      导入存量系列
    </button>
  );
};

export default ImportExistingButton;
