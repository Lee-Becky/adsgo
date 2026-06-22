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
    name: 'Auto Budget Optimization',
    description: 'Luna automatically reallocates budget across campaigns based on real-time ROAS signals.',
    icon: DollarSign,
    enabled: true,
  },
  {
    id: 'creative-refresh',
    name: 'Auto Creative Refresh',
    description: 'Detects creative fatigue and triggers new variant generation before performance degrades.',
    icon: Palette,
    enabled: true,
  },
  {
    id: 'audience-expansion',
    name: 'Auto Audience Expansion',
    description: 'Discovers new high-intent audience segments by analyzing conversion patterns.',
    icon: Users,
    enabled: false,
  },
  {
    id: 'question-mode',
    name: 'Luna Question Mode',
    description: 'When you change settings manually, Luna asks why — building context for smarter future suggestions.',
    icon: MessageSquare,
    enabled: true,
  },
  {
    id: 'auto-report',
    name: 'Auto Report Generation',
    description: 'Generates daily and weekly performance briefs without manual setup.',
    icon: FileBarChart,
    enabled: true,
  },
  {
    id: 'anomaly-detection',
    name: 'Anomaly Detection',
    description: 'Monitors spend, CPA, and impression spikes in real time and alerts you immediately.',
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
          {activeCount}/{skills.length} skills active
        </span>
        <span className="text-caption text-neutral-400">
          — Luna operates within enabled skills only
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
