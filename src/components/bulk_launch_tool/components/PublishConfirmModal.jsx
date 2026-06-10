import React, { useState, useEffect } from 'react';
import { X, Rocket, Pause, Play, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * Phase 2.N：发布二次确认 modal。
 *
 * Props
 *  - open: boolean
 *  - onClose: () => void
 *  - onConfirm: (statusUi: 'PAUSED' | 'ACTIVE') => void
 *  - channel: 'meta' | 'tiktok'
 *  - channelName: string         显示给用户看的渠道名（如 'Meta' / 'TikTok'）
 *  - counts: { campaigns, adsets, ads }
 *  - errorCount?: number         必填校验未通过数量；>0 时禁用「确认发布」
 */
const PublishConfirmModal = ({
  open, onClose, onConfirm,
  channel = 'meta', channelName = 'Meta',
  counts = { campaigns: 0, adsets: 0, ads: 0 },
  errorCount = 0,
}) => {
  const [statusUi, setStatusUi] = useState('PAUSED');

  useEffect(() => {
    if (open) setStatusUi('PAUSED');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sdkStatusLabel = channel === 'tiktok'
    ? (statusUi === 'ACTIVE' ? 'ENABLE' : 'DISABLE')
    : statusUi;

  const canConfirm = errorCount === 0;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[92vw] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <Rocket size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">确认发布</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">发布前请确认结构与初始状态</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-base hover:bg-gray-50">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          {/* 结构摘要 */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary-50/60 via-white to-violet-50/40 border border-primary-500/10">
            <div className="w-10 h-10 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-sm shrink-0">
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">即将发布到 {channelName}</p>
              <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                {counts.campaigns} Campaign · {counts.adsets} AdSet · {counts.ads} Ad
              </p>
            </div>
          </div>

          {/* 状态选择 */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">发布后初始状态</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatusUi('PAUSED')}
                className={`relative flex flex-col items-start gap-1 p-3 rounded-base border-2 transition-all text-left ${
                  statusUi === 'PAUSED'
                    ? 'border-primary-500 bg-primary-50/40 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Pause size={13} className={statusUi === 'PAUSED' ? 'text-primary-600' : 'text-gray-500'} strokeWidth={2.4} />
                  <span className={`text-xs font-semibold ${statusUi === 'PAUSED' ? 'text-primary-700' : 'text-gray-800'}`}>已暂停 PAUSED</span>
                  <span className="ml-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-tag">推荐</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">发布后人工 review，确认无误再启动</p>
              </button>
              <button
                type="button"
                onClick={() => setStatusUi('ACTIVE')}
                className={`relative flex flex-col items-start gap-1 p-3 rounded-base border-2 transition-all text-left ${
                  statusUi === 'ACTIVE'
                    ? 'border-primary-500 bg-primary-50/40 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Play size={13} className={statusUi === 'ACTIVE' ? 'text-primary-600' : 'text-gray-500'} strokeWidth={2.4} />
                  <span className={`text-xs font-semibold ${statusUi === 'ACTIVE' ? 'text-primary-700' : 'text-gray-800'}`}>已激活 ACTIVE</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">发布即开始投放，预算开始消耗</p>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              SDK 字段：{channel === 'tiktok' ? 'operation_status' : 'status'} = <span className="font-mono">{sdkStatusLabel}</span>
            </p>
          </div>

          {/* 校验警告 */}
          {errorCount > 0 && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/70">
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2.4} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber-800">{errorCount} 项必填配置未完成</p>
                <p className="text-[11px] text-amber-700/80 mt-0.5">请关闭此窗口、补齐后再发布</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button onClick={onClose}
            className="px-4 h-9 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-base transition-colors">
            取消
          </button>
          <button
            onClick={() => canConfirm && onConfirm?.(statusUi)}
            disabled={!canConfirm}
            className="px-4 h-9 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-base transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
          >
            <Rocket size={12} /> 确认发布
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;
