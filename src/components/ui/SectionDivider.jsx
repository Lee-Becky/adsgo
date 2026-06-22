const SectionDivider = ({ label, className = '' }) => {
  if (!label) {
    return <hr className={`border-t border-neutral-200 my-12 ${className}`} />
  }

  return (
    <div className={`flex items-center gap-4 my-12 ${className}`}>
      <div className="h-px flex-1 bg-neutral-200" />
      <span className="text-[10px] font-bold tracking-[0.08em] text-neutral-400 select-none">
        {label}
      </span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  )
}

export default SectionDivider
