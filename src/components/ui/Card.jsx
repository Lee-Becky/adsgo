import { forwardRef } from 'react'

const Card = forwardRef(({
  interactive = false,
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-xl shadow-ring p-6
        ${interactive
          ? 'transition-all duration-250 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : ''
        }
        ${className}
      `.trim()}
      style={interactive ? { transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' } : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
export default Card
