import Button from './Button'

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* Geometric background shapes */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-primary-50 animate-float" />
        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary-100/60 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-2 -left-4 w-10 h-10 rounded-full bg-primary-50/80 animate-float" style={{ animationDelay: '1s' }} />
        {Icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={28} className="text-primary-400" />
          </div>
        )}
      </div>

      <div className="max-w-[400px] text-center">
        {title && (
          <h3 className="font-display text-xl font-bold text-gray-800">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
        )}
        {actionLabel && onAction && (
          <div className="mt-6">
            <Button onClick={onAction}>{actionLabel}</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyState
