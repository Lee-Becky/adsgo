import { useEffect, useRef, useState } from 'react'
import { X, Code2 } from 'lucide-react'
import { getNextModalZIndex } from '../../constants/zIndex'
import ImplementationGuide from './ImplementationGuide'

const DrawerShell = ({ isOpen, onClose, title, subtitle, guideModule, children }) => {
  const overlayRef = useRef(null)
  const [zIndex, setZIndex] = useState(1000)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setZIndex(getNextModalZIndex())
      setShowGuide(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0"
      style={{ zIndex }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 transition-opacity" />

      {/* Drawer Panel */}
      <div className="absolute top-0 right-0 h-full w-[560px] max-w-[90vw] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-[#F5F5F5] flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {guideModule && (
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  showGuide
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Dev Guide
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {showGuide ? (
            <ImplementationGuide module={guideModule} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}

export default DrawerShell
