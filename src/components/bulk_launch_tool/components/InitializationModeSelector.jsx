import React from 'react';
import { Wand2, Database, ArrowRight, Check } from 'lucide-react';

/**
 * 广告结构初始化模式选择：
 *  - 'manual'：从零创建（走三级表单）
 *  - 'import'：导入已有系列（直接进架构图）
 *
 * Props:
 *  - value: 'manual' | 'import' | null
 *  - onChange: (next) => void
 */
const OPTIONS = [
  {
    id: 'manual',
    title: 'Manual initialization',
    titleZh: '手动创建',
    desc: '从零开始按 SDK 三级填写 Campaign / Ad Set / Ad，所有字段约束实时校验。',
    icon: Wand2,
    accent: 'primary',
  },
  {
    id: 'import',
    title: 'Import existing campaign',
    titleZh: '导入存量系列',
    desc: '复用已有的系列结构，跳过表单直接生成架构图 → 进入发布流程。',
    icon: Database,
    accent: 'violet',
  },
];

const ACCENT = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', ring: 'border-primary-500/40 shadow-primary-focus' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'border-violet-500/40' },
};

const InitializationModeSelector = ({ value, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {OPTIONS.map(opt => {
      const Icon = opt.icon;
      const sel = value === opt.id;
      const accent = ACCENT[opt.accent] || ACCENT.primary;
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange?.(opt.id)}
          className={[
            'relative text-left bg-white p-5 rounded-2xl border-2 transition-all overflow-hidden',
            sel ? `border-primary-500 shadow-md ${accent.ring}` : 'border-neutral-100 hover:border-neutral-200 hover:shadow-sm',
          ].join(' ')}
        >
          {sel && (
            <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md">
              <Check size={14} strokeWidth={3} />
            </span>
          )}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center shrink-0`}>
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-neutral-900 leading-tight">{opt.titleZh}</p>
              <p className="text-[11px] tracking-wider text-neutral-400 mt-0.5">{opt.title}</p>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{opt.desc}</p>
              <div className={`inline-flex items-center gap-1 text-xs font-medium mt-3 ${sel ? accent.text : 'text-neutral-400'}`}>
                {sel ? '已选择' : '选择'}
                <ArrowRight size={12} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

export default InitializationModeSelector;
