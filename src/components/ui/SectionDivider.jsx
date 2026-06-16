const SectionDivider = ({ label, className = '' }) => {
  if (!label) {
    return <hr className={`border-t border-gray-200 my-12 ${className}`} />
  }

  return (
    <div className={`flex items-center gap-4 my-12 ${className}`}>
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 select-none">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  )
}

export default SectionDivider
