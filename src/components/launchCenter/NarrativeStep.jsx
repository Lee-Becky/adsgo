const NarrativeStep = ({ step, title, subtitle, showLine = false, action, children }) => (
  <div className="relative pb-6">
    {/* Step Header */}
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3">
        {/* Step Node + Connecting Line */}
        <div className="relative shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary-50 border-2 border-primary-200 flex items-center justify-center text-xs font-bold text-primary-600 relative z-10">
            {step}
          </div>
          {showLine && (
            <div className="absolute left-1/2 top-7 -translate-x-1/2 w-px bg-primary-100" style={{ bottom: '-24px' }} />
          )}
        </div>

        {/* Title + Subtitle */}
        <div className="pt-0.5">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </div>

    {/* Content — indented to align with title text */}
    <div className="ml-10">
      {children}
    </div>
  </div>
)

export default NarrativeStep
