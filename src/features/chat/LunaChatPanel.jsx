import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Send, Trash2, Sparkles, ChevronDown,
  BarChart3, DollarSign, Zap, FileBarChart, Palette, Users, Target, Settings,
  Database, Check, Paperclip, Image as ImageIcon,
} from 'lucide-react'
import { LunaAvatar } from '@components/luna'
import { UserMessage, LunaMessage, LunaDataCard, LunaActionCard } from '@components/luna/LunaMessageCard'
import useLunaStore from '@stores/lunaStore'
import useLunaChat from './useLunaChat'
import { DATA_SOURCES, QUICK_PROMPTS } from './mockLunaService'

/* ═══════════════════════════════════════════════════════════
   LunaChatPanel — Right-side sliding chat panel
   Portal-rendered to document.body. Reads isOpen from lunaStore.
   ═══════════════════════════════════════════════════════════ */

/* ── Icon map for quick prompts ──────────────────────────── */
const ICON_MAP = {
  BarChart3, DollarSign, Zap, FileBarChart, Palette, Users, Target, Settings,
  Database, Building2: Database, Eye: Target, TrendingUp: BarChart3,
}

/* ── Category colors for prompt chips ────────────────────── */
const CATEGORY_COLORS = {
  analysis: 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100',
  optimize: 'bg-success-50 text-success-700 border-success-200 hover:bg-success-100',
  create:   'bg-luna-bg text-luna-violet border-luna-border hover:bg-luna-bg/80',
  report:   'bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100',
  strategy: 'bg-info-50 text-info-700 border-info-200 hover:bg-info-100',
}

/* ── Welcome state (empty chat) ──────────────────────────── */
const WelcomeState = ({ onQuickPrompt }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="mb-4">
      <LunaAvatar size="lg" showRing />
    </div>
    <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-1">
      今日美国 ROAS 低于目标
    </h3>
    <p className="text-caption text-neutral-500 mb-6 max-w-[280px]">
      先处理预算、素材和客户日报。
    </p>

    <div className="w-full grid grid-cols-2 gap-2 px-2">
      {QUICK_PROMPTS.map((prompt) => {
        const Icon = ICON_MAP[prompt.icon] || Sparkles
        const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.analysis
        return (
          <button
            key={prompt.id}
            onClick={() => onQuickPrompt(prompt.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-caption font-medium transition-all active:scale-[0.98] ${colors}`}
          >
            <Icon size={14} className="shrink-0" />
            <span className="truncate">{prompt.label}</span>
          </button>
        )
      })}
    </div>
  </div>
)

/* ── Chat content (rendered inside the panel) ────────────── */
const ChatContent = ({ onClose }) => {
  const {
    chatHistory,
    isThinking,
    activeDataSources,
    sendMessage,
    handleQuickPrompt,
    clearHistory,
    setActiveDataSources,
    applySyncToModule,
    clearSyncData,
    confirmOperation,
  } = useLunaChat()

  const [inputText, setInputText] = useState('')
  const [showSources, setShowSources] = useState(false)
  const [attachments, setAttachments] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isThinking])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleSubmit = useCallback((e) => {
    e?.preventDefault()
    if ((!inputText.trim() && !attachments.length) || isThinking) return
    sendMessage(inputText, attachments)
    setInputText('')
    setAttachments((prev) => {
      prev.forEach((file) => { if (file.previewUrl) URL.revokeObjectURL(file.previewUrl) })
      return []
    })
    if (inputRef.current) inputRef.current.style.height = '48px'
  }, [inputText, attachments, isThinking, sendMessage])

  const handlePickFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const next = files.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }))
    setAttachments((prev) => [...prev, ...next].slice(0, 5))
    e.target.value = ''
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((f) => f.id !== id)
    })
  }

  const canSend = (inputText.trim() || attachments.length > 0) && !isThinking

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const toggleSource = (sourceId) => {
    const next = activeDataSources.includes(sourceId)
      ? activeDataSources.filter((id) => id !== sourceId)
      : [...activeDataSources, sourceId]
    setActiveDataSources(next)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 bg-gradient-to-r from-white to-luna-bg/30">
        <LunaAvatar size="md" showRing />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base font-semibold text-neutral-900">Luna</h2>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success-50 text-success-600 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              在线
            </span>
          </div>
          <p className="text-caption text-neutral-500 truncate">美国市场异常处理中</p>
        </div>
        <div className="flex items-center gap-1">
          {chatHistory.length > 0 && (
            <button onClick={clearHistory} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors" title="Clear chat">
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--neutral-200) transparent' }}>
        {chatHistory.length === 0 && !isThinking && (
          <WelcomeState onQuickPrompt={handleQuickPrompt} />
        )}

        {chatHistory.map((msg) => (
          <div key={msg.id} className="group">
            {msg.role === 'user' ? (
              <UserMessage text={msg.text} timestamp={msg.timestamp} attachments={msg.attachments || []} />
            ) : (
              <LunaMessage text={msg.text} timestamp={msg.timestamp}>
                {msg.dataCard && (
                  <LunaDataCard title={msg.dataCard.title}>
                    <table className="w-full text-caption">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th className="text-left py-1.5 font-semibold text-neutral-600">投放对象</th>
                          <th className="text-right py-1.5 font-semibold text-neutral-600">花费</th>
                          <th className="text-right py-1.5 font-semibold text-neutral-600">ROAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msg.dataCard.rows.map((row, i) => (
                          <tr key={i} className="border-b border-neutral-50 last:border-0">
                            <td className="py-1.5 text-neutral-700">{row.name}</td>
                            <td className="py-1.5 text-right text-neutral-600">{row.spend}</td>
                            <td className="py-1.5 text-right">
                              <span className={`font-semibold ${parseFloat(row.roas) >= 3.5 ? 'text-success-600' : parseFloat(row.roas) >= 2.5 ? 'text-warning-600' : 'text-danger-600'}`}>
                                {row.roas}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </LunaDataCard>
                )}
                {msg.synced && (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-success-50 px-2 py-1 text-[10px] font-semibold text-success-700">
                    ↗ 已同步到对应功能页，可在页面内「应用到页面」
                  </p>
                )}
                {msg.actionCard && (
                  <LunaActionCard
                    title={msg.actionCard.title}
                    description={msg.actionCard.description}
                    primaryAction={{
                      label: msg.actionCard.confirmLabel || '打开并查看',
                      onClick: () => msg.operation
                        ? confirmOperation(msg.operation, msg.syncTarget)
                        : msg.syncTarget && applySyncToModule(msg.syncTarget),
                    }}
                    secondaryAction={{
                      label: '稍后处理',
                      onClick: () => {},
                    }}
                  />
                )}
              </LunaMessage>
            )}
          </div>
        ))}

        {isThinking && <LunaMessage thinking />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {chatHistory.length > 0 && chatHistory.length <= 4 && !isThinking && (
        <div className="px-5 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.slice(0, 4).map((prompt) => {
              const Icon = ICON_MAP[prompt.icon] || Sparkles
              const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.analysis
              return (
                <button key={prompt.id} onClick={() => handleQuickPrompt(prompt.id)} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${colors}`}>
                  <Icon size={12} />
                  {prompt.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Data sources */}
      <div className="px-5 py-2 border-t border-neutral-100">
        <button onClick={() => setShowSources(!showSources)} className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
          <Database size={12} />
          <span>参考数据 ({activeDataSources.length})</span>
          <ChevronDown size={12} className={`transition-transform ${showSources ? 'rotate-180' : ''}`} />
        </button>
        {showSources && (
          <div className="mt-2 flex flex-wrap gap-1.5 pb-1">
            {DATA_SOURCES.map((source) => {
              const active = activeDataSources.includes(source.id)
              return (
                <button key={source.id} onClick={() => toggleSource(source.id)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${active ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'}`}>
                  {active && <Check size={10} />}
                  {source.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-neutral-100 px-5 pb-5 pt-2">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div key={file.id} className="relative flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-xs">
                {file.previewUrl ? (
                  <img src={file.previewUrl} alt={file.name} className="h-8 w-8 rounded object-cover" />
                ) : (
                  <ImageIcon size={14} className="text-neutral-400" />
                )}
                <span className="max-w-[100px] truncate text-neutral-700">{file.name}</span>
                <button type="button" onClick={() => removeAttachment(file.id)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.csv,.xlsx,.xls"
            className="hidden"
            onChange={handlePickFiles}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-2 bottom-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            title="上传图片或文件"
          >
            <Paperclip size={16} />
          </button>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问 Luna：为什么美国 ROAS 下滑？"
            rows={1}
            disabled={isThinking}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 pl-11 pr-12 py-3 text-body text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all disabled:opacity-60"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = '48px'
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
            }}
          />
          <button
            type="submit"
            disabled={!canSend}
            className="absolute right-2 bottom-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-30"
            style={{ background: canSend ? 'var(--luna-gradient)' : 'var(--neutral-100)' }}
          >
            <Send size={16} className={canSend ? 'text-white' : 'text-neutral-400'} />
          </button>
        </form>
        <p className="text-[10px] text-neutral-400 mt-1.5 text-center">支持图片、PDF、CSV · 预算变更需确认后生效</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LunaChatPanel — Portal wrapper
   ═══════════════════════════════════════════════════════════ */
const LunaChatPanel = () => {
  const isOpen = useLunaStore((s) => s.isOpen)
  const closeChat = useLunaStore((s) => s.closeChat)

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, closeChat])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[600] flex justify-end" role="dialog" aria-label="Luna Chat">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/30 backdrop-blur-[2px] animate-fade-in" onClick={closeChat} />

      {/* Panel */}
      <div
        className="relative flex h-[100dvh] min-h-0 w-full max-w-[460px] flex-col bg-white shadow-2xl animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatContent onClose={closeChat} />
      </div>
    </div>,
    document.body
  )
}

export default LunaChatPanel
