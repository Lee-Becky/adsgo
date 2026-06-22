import { Check } from 'lucide-react'

/* ── Size tokens ──────────────────────────────────────── */
const linearSizes = {
  sm: { bar: 'h-1', text: 'text-xs' },
  md: { bar: 'h-2', text: 'text-sm' },
  lg: { bar: 'h-3', text: 'text-sm' },
}

const circularSizes = {
  sm: { size: 48, stroke: 4, textClass: 'text-xs' },
  md: { size: 64, stroke: 5, textClass: 'text-sm font-semibold' },
  lg: { size: 96, stroke: 6, textClass: 'text-h3 font-bold' },
}

/* ── Color mapping ────────────────────────────────────── */
const colorMap = {
  primary: { fill: 'bg-primary-500', stroke: 'stroke-primary-500', text: 'text-primary-600', stepDone: 'bg-primary-500', stepLine: 'bg-primary-500' },
  success: { fill: 'bg-success-500', stroke: 'stroke-success-500', text: 'text-success-600', stepDone: 'bg-success-500', stepLine: 'bg-success-500' },
  warning: { fill: 'bg-warning-500', stroke: 'stroke-warning-500', text: 'text-warning-600', stepDone: 'bg-warning-500', stepLine: 'bg-warning-500' },
  danger:  { fill: 'bg-danger-500',  stroke: 'stroke-danger-500',  text: 'text-danger-600',  stepDone: 'bg-danger-500',  stepLine: 'bg-danger-500' },
  luna:    { fill: '', stroke: '', text: 'text-luna-violet', stepDone: '', stepLine: '' },
}

/* ────────────────────────────────────────────────────────
   Linear — horizontal bar
   ──────────────────────────────────────────────────────── */
const LinearProgress = ({ value, size = 'md', color = 'primary', showLabel, className }) => {
  const dim = linearSizes[size] || linearSizes.md
  const clr = colorMap[color] || colorMap.primary
  const clamped = Math.max(0, Math.min(100, value))
  const isLuna = color === 'luna'

  return (
    <div className={`w-full ${className || ''}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={`${dim.text} font-medium text-neutral-700`}>Progress</span>
          <span className={`${dim.text} font-semibold ${clr.text}`}>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full ${dim.bar} bg-neutral-100 rounded-full overflow-hidden`}>
        <div
          className={`
            ${dim.bar} rounded-full
            transition-all duration-slow
            ${isLuna ? '' : clr.fill}
          `.trim()}
          style={{
            width: `${clamped}%`,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            ...(isLuna
              ? { background: 'linear-gradient(90deg, #8B5CF6 0%, #6366F1 50%, #F59E0B 100%)' }
              : {}
            ),
          }}
        />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Circular — SVG ring
   ──────────────────────────────────────────────────────── */
const CircularProgress = ({ value, size = 'md', color = 'primary', showLabel, className }) => {
  const dim = circularSizes[size] || circularSizes.md
  const clr = colorMap[color] || colorMap.primary
  const clamped = Math.max(0, Math.min(100, value))
  const isLuna = color === 'luna'

  const radius = (dim.size - dim.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (clamped / 100) * circumference

  const lunaId = `luna-gradient-${dim.size}`

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className || ''}`}
      style={{ width: dim.size, height: dim.size }}
    >
      <svg
        width={dim.size}
        height={dim.size}
        className="-rotate-90"
      >
        {isLuna && (
          <defs>
            <linearGradient id={lunaId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        )}

        {/* Track */}
        <circle
          cx={dim.size / 2}
          cy={dim.size / 2}
          r={radius}
          fill="none"
          className="stroke-neutral-100"
          strokeWidth={dim.stroke}
        />

        {/* Fill */}
        <circle
          cx={dim.size / 2}
          cy={dim.size / 2}
          r={radius}
          fill="none"
          className={isLuna ? '' : clr.stroke}
          stroke={isLuna ? `url(#${lunaId})` : undefined}
          strokeWidth={dim.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <span className={`absolute ${dim.textClass} ${clr.text}`}>
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Steps — numbered circles connected by lines
   ──────────────────────────────────────────────────────── */
const StepsProgress = ({ steps = [], currentStep = 0, color = 'primary', size = 'md', className }) => {
  const clr = colorMap[color] || colorMap.primary
  const isLuna = color === 'luna'

  const circleSizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' }
  const circleSize = circleSizes[size] || circleSizes.md

  return (
    <div className={`flex items-center w-full ${className || ''}`}>
      {steps.map((step, idx) => {
        const isDone = idx < currentStep
        const isCurrent = idx === currentStep
        const isLast = idx === steps.length - 1

        return (
          <div
            key={step.key || idx}
            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
          >
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  ${circleSize} rounded-full flex items-center justify-center font-semibold
                  transition-all duration-normal shrink-0
                  ${isDone
                    ? isLuna
                      ? 'text-white'
                      : `${clr.stepDone} text-white`
                    : isCurrent
                      ? isLuna
                        ? 'border-2 text-luna-violet'
                        : `border-2 border-primary-500 text-primary-600 bg-primary-50`
                      : 'border-2 border-neutral-200 text-neutral-400 bg-white'
                  }
                `.trim()}
                style={
                  isDone && isLuna
                    ? { background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)' }
                    : isCurrent && isLuna
                      ? { borderImage: 'linear-gradient(135deg, #8B5CF6, #F59E0B) 1' }
                      : undefined
                }
              >
                {isDone ? <Check size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} /> : idx + 1}
              </div>

              {/* Step label */}
              {step.label && (
                <span
                  className={`
                    mt-1.5 text-xs font-medium text-center whitespace-nowrap
                    ${isDone || isCurrent ? 'text-neutral-700' : 'text-neutral-400'}
                  `.trim()}
                >
                  {step.label}
                </span>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 rounded-full
                  transition-colors duration-normal
                  ${isDone
                    ? isLuna ? '' : clr.stepLine
                    : 'bg-neutral-200'
                  }
                `.trim()}
                style={
                  isDone && isLuna
                    ? { background: 'linear-gradient(90deg, #8B5CF6, #F59E0B)' }
                    : undefined
                }
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Main Progress export
   ──────────────────────────────────────────────────────── */
const Progress = ({
  variant = 'linear',
  value = 0,
  steps,
  currentStep = 0,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className = '',
}) => {
  switch (variant) {
    case 'circular':
      return (
        <CircularProgress
          value={value}
          size={size}
          color={color}
          showLabel={showLabel}
          className={className}
        />
      )
    case 'steps':
      return (
        <StepsProgress
          steps={steps || []}
          currentStep={currentStep}
          color={color}
          size={size}
          className={className}
        />
      )
    case 'linear':
    default:
      return (
        <LinearProgress
          value={value}
          size={size}
          color={color}
          showLabel={showLabel}
          className={className}
        />
      )
  }
}

Progress.displayName = 'Progress'
export default Progress
