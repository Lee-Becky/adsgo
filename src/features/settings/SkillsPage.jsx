import { useState } from 'react'
import {
  DollarSign, Palette, Users, MessageSquare, FileBarChart,
  ShieldAlert,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   SkillsPage — AI Skills configuration (Luna capabilities)
   ═══════════════════════════════════════════════════════════ */

const INITIAL_SKILLS = [
  {
    id: 'auto-budget',
    name: '预算红线检查',
    description: '每天 10:00 检查 ROAS、CPA 和预算上限，发现 US Prospecting 浪费后生成降预算建议。',
    icon: DollarSign,
    enabled: true,
  },
  {
    id: 'creative-refresh',
    name: '素材疲劳检查',
    description: '监控素材频次、CTR 和 CVR，Core Legging Video V12 频次超过 4.5 后进入换新。',
    icon: Palette,
    enabled: true,
  },
  {
    id: 'audience-expansion',
    name: '受众扩量建议',
    description: '当 Lookalike 学习期稳定且 CPA 低于红线时，生成扩量建议；当前保持关闭。',
    icon: Users,
    enabled: false,
  },
  {
    id: 'question-mode',
    name: '客户偏好追问',
    description: '当优化师保留再营销预算高于建议值时，追问是否因为促销周需要保留曝光。',
    icon: MessageSquare,
    enabled: true,
  },
  {
    id: 'auto-report',
    name: '客户日报草稿',
    description: '每天 19:00 汇总异常、预算动作、素材换新和明日观察点，发送前仍需人工确认。',
    icon: FileBarChart,
    enabled: true,
  },
  {
    id: 'anomaly-detection',
    name: '异常波动提醒',
    description: '监控花费、CPA、CVR 和频次异常，触发后同步到广告管理和策略。',
    icon: ShieldAlert,
    enabled: true,
  },
]

const SkillsPage = () => {
  const [skills, setSkills] = useState(INITIAL_SKILLS)

  const toggleSkill = (id) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    )
  }

  const activeCount = skills.filter((s) => s.enabled).length

  return (
    <div className="space-y-6">
      {/* ── Summary bar ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-luna-bg/50 border border-luna-border">
        <span className="text-caption font-semibold text-luna-violet tabular-nums">
          {activeCount}/{skills.length} 条规则开启
        </span>
        <span className="text-caption text-neutral-400">
          — 预算生效仍需要优化师确认
        </span>
      </div>

      {/* ── Skill cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon
          return (
            <div
              key={skill.id}
              className={`rounded-xl border p-5 transition-all ${
                skill.enabled
                  ? 'bg-white border-neutral-200 shadow-sm'
                  : 'bg-neutral-50 border-neutral-100 opacity-70'
              }`}
            >
              {/* Icon + toggle row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    skill.enabled
                      ? 'bg-luna-bg text-luna-violet'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  <Icon size={20} />
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleSkill(skill.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    skill.enabled ? 'bg-luna-violet' : 'bg-neutral-300'
                  }`}
                  aria-label={`Toggle ${skill.name}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      skill.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Text */}
              <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-1">
                {skill.name}
              </h3>
              <p className="text-caption text-neutral-500 leading-relaxed mb-3">
                {skill.description}
              </p>

              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  skill.enabled
                    ? 'bg-success-50 text-success-600 border border-success-200'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    skill.enabled ? 'bg-success-500 animate-pulse' : 'bg-neutral-300'
                  }`}
                />
                {skill.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SkillsPage
