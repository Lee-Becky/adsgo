import React from 'react';
import { Lock, Layers, Target, Image as ImageIcon } from 'lucide-react';

/**
 * Step Card 视觉外壳（Phase 2.E 重设计）：
 * - 左侧大圆形 step 编号 (① ② ③) — primary 渐变背景
 * - 中央：图标徽章 + 标题 + 副标题
 * - 右侧：渠道版本 chip + 进度提示
 * - 主体：children 直接渲染（不折叠；高级设置已移到外层 UnifiedAdvancedSettings）
 *
 * Props:
 *  - stepNumber: 1 | 2 | 3
 *  - title / subtitle
 *  - badge: 渠道版本（"Meta v21"）
 *  - progress: "已填 4/5 核心" 文案
 *  - iconType: 'campaign' | 'adset' | 'ad'
 *  - accentColor: 'primary' | 'violet' | 'emerald'  仅控制图标徽章配色
 *  - disabled: 渠道未选时
 */
const ICON_MAP = {
  campaign: Layers,
  adset:    Target,
  ad:       ImageIcon,
};

// 静态预设（避免 Tailwind purge）
const ACCENT = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600'  },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

const StructureSectionShell = ({
  stepNumber,
  title,
  subtitle,
  badge,
  progress,
  iconType = 'campaign',
  accentColor = 'primary',
  disabled = false,
  children,
}) => {
  const IconCmp = ICON_MAP[iconType] || Layers;
  const accent = ACCENT[accentColor] || ACCENT.primary;

  return (
    <div
      className={[
        'bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all',
        disabled ? 'opacity-60' : 'shadow-sm hover:shadow-md',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
        {stepNumber !== undefined && (
          <>
            <div className={[
              'w-10 h-10 rounded-full text-white text-base font-bold flex items-center justify-center shrink-0 shadow-md',
              disabled ? 'bg-gray-300' : 'bg-gradient-to-br from-primary-500 to-primary-600',
            ].join(' ')}>
              {stepNumber}
            </div>
            <div className="w-px h-9 bg-gray-200 shrink-0" />
          </>
        )}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center shrink-0`}>
            <IconCmp size={18} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 leading-tight truncate">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {disabled && <Lock size={12} className="text-gray-400" />}
          {badge && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-gray-50 text-gray-500 font-semibold border border-gray-100">
              {badge}
            </span>
          )}
          {progress && !disabled && (
            <span className="text-[11px] text-gray-500 font-medium px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 whitespace-nowrap">
              {progress}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 bg-gray-50/30">
        {children}
      </div>
    </div>
  );
};

export default StructureSectionShell;
