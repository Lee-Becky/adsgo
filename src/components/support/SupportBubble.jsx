import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Mail, BookOpen } from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'

export default function SupportBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const containerRef = useRef(null)

  const close = () => {
    if (!isOpen) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setIsOpen(false)
    }, 240)
  }

  const open = () => {
    setIsOpen(true)
    window.dispatchEvent(new CustomEvent('adsgo:floatpanel:open', { detail: { id: 'support' } }))
  }

  useEffect(() => {
    if (!isOpen) {
      window.dispatchEvent(new CustomEvent('adsgo:floatpanel:close', { detail: { id: 'support' } }))
    }
  }, [isOpen])

  useEffect(() => {
    const onOtherOpen = (e) => {
      const id = e.detail?.id
      if (!id || id === 'support') return
      if (isOpen) close()
    }
    window.addEventListener('adsgo:floatpanel:open', onOtherOpen)
    return () => window.removeEventListener('adsgo:floatpanel:open', onOtherOpen)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6" style={{ zIndex: Z_INDEX.FLOATING_ACTION }}>
      {(isOpen || isClosing) && (
        <div
          className={`absolute bottom-[72px] right-0 w-80 origin-bottom-right ${
            isClosing ? 'animate-bubble-collapse' : 'animate-bubble-expand'
          }`}
        >
          <div className="rounded-xl bg-white border border-[#F0F0F0] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F5F5F5] bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary-500" />
                <span className="text-base font-semibold text-neutral-900">需要帮助？</span>
              </div>
              <button
                onClick={close}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3">
              <p className="text-sm text-neutral-700 leading-relaxed">
                实时客服功能即将上线。你可以通过以下方式联系我们：
              </p>

              <div className="mt-3 space-y-2">
                <a
                  href="mailto:support@adsgo.ai"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50/40 transition-all"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">support@adsgo.ai</span>
                </a>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50/40 transition-all"
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">查看帮助文档</span>
                </a>
              </div>
            </div>

            <div className="px-4 py-2 border-t border-[#F5F5F5] bg-neutral-50/50">
              <p className="text-[11px] text-neutral-400 text-center">Powered by AdsGo Support</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => (isOpen ? close() : open())}
        className="relative w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 active:bg-primary-700 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-label="联系客服"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-success-500 ring-2 ring-white" />
      </button>
    </div>
  )
}
