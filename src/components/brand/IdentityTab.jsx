import { Palette } from 'lucide-react'

const IdentityTab = ({ data, onChange }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-neutral-300 gap-4 animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 shadow-inner">
        <Palette size={32} />
      </div>
      <p className="text-sm font-bold">Identity Assets Module</p>
      <p className="text-xs font-medium text-neutral-400 max-w-xs text-center leading-relaxed">
        Visual identity, colors, typography and tonal guidelines are being migrated to the new architecture.
      </p>
    </div>
  )
}

export default IdentityTab
