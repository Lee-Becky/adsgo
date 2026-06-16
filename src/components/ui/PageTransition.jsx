import { useRef, useEffect } from 'react'

const PageTransition = ({ children, className = '' }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.filter = 'blur(4px)'

    requestAnimationFrame(() => {
      el.style.transition = 'opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1), filter 500ms cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      el.style.filter = 'blur(0)'
    })

    // Stagger children with data-stagger attribute
    const staggerItems = el.querySelectorAll('[data-stagger]')
    staggerItems.forEach((child, i) => {
      child.style.opacity = '0'
      child.style.transform = 'translateY(12px)'
      requestAnimationFrame(() => {
        child.style.transition = `opacity 400ms cubic-bezier(0, 0, 0.2, 1) ${i * 60}ms, transform 400ms cubic-bezier(0, 0, 0.2, 1) ${i * 60}ms`
        child.style.opacity = '1'
        child.style.transform = 'translateY(0)'
      })
    })
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default PageTransition
