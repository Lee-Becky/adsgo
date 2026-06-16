import { Check } from 'lucide-react'

const DatasetWizard = ({ steps, currentStep, onStepClick, onNext, onPrev, onFinish, canProceed, children }) => {
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-0 px-10 py-6">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isCurrent = idx === currentStep
          const isFuture = idx > currentStep
          return (
            <div key={idx} className="flex items-center">
              <button
                onClick={() => idx < currentStep && onStepClick?.(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  isCompleted ? 'cursor-pointer' : isCurrent ? '' : 'cursor-default'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  isCompleted ? 'text-emerald-600' : isCurrent ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {step}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${isCompleted ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="min-h-[320px]">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Back
        </button>
        {isLastStep ? (
          <button
            onClick={onFinish}
            disabled={!canProceed}
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
          >
            Create Dataset
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default DatasetWizard
