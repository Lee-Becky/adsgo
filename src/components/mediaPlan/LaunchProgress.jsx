import React from 'react'
import { CheckCircle, Clock, Eye, RefreshCw, Zap } from 'lucide-react'

const ICON_MAP = { CheckCircle, Clock, Eye, RefreshCw, Zap }

const LAUNCH_STEPS = [
  {
    id: 'submitted',
    label: 'Campaigns created & submitted to platforms',
    description: 'Your ads have been sent to Meta / Google for review.',
    status: 'completed',
    icon: 'CheckCircle',
  },
  {
    id: 'review',
    label: 'Platform review in progress',
    description: 'Ad platforms typically approve ads within 1-24 hours.',
    status: 'in_progress',
    estimatedTime: '1-24 hours',
    icon: 'Clock',
  },
  {
    id: 'impressions',
    label: 'First impressions & clicks',
    description: 'Once approved, your ads start showing to target audiences.',
    status: 'upcoming',
    estimatedTime: '2-6 hours after approval',
    icon: 'Eye',
  },
  {
    id: 'data_sync',
    label: 'First data sync & analysis',
    description: 'AdsGo pulls performance data and begins analysis.',
    status: 'upcoming',
    estimatedTime: '~1 hour after first spend',
    icon: 'RefreshCw',
  },
  {
    id: 'first_optimization',
    label: 'First AI optimization cycle',
    description: 'Budget reallocation, underperformer identification, and campaign recommendations.',
    status: 'upcoming',
    estimatedTime: '24 hours after launch',
    icon: 'Zap',
  },
]

export default function LaunchProgress() {
  return (
    <div className="space-y-0">
      {LAUNCH_STEPS.map((step, index) => {
        const Icon = ICON_MAP[step.icon]
        const isLast = index === LAUNCH_STEPS.length - 1

        return (
          <div key={step.id} className="flex gap-3">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              {/* Dot / Icon */}
              {step.status === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              ) : step.status === 'in_progress' ? (
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-neutral-200 bg-white flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-neutral-300" />
                </div>
              )}

              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`w-px flex-1 min-h-[24px] ${
                    step.status === 'completed'
                      ? 'bg-emerald-300'
                      : step.status === 'in_progress'
                        ? 'bg-primary-200'
                        : 'border-l border-dashed border-neutral-200'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${
                    step.status === 'completed'
                      ? 'text-neutral-800'
                      : step.status === 'in_progress'
                        ? 'text-neutral-800'
                        : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </span>
                {step.estimatedTime && step.status !== 'completed' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      step.status === 'in_progress'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {step.estimatedTime}
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-0.5 leading-relaxed ${
                  step.status === 'upcoming' ? 'text-neutral-300' : 'text-neutral-500'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
