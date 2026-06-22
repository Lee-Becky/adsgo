import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Send, Trash2, Sparkles, ChevronDown,
  BarChart3, DollarSign, Zap, FileBarChart, Palette, Users, Target, Settings,
  Database, Check,
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
      Hi, I'm Luna
    </h3>
    <p className="text-caption text-neutral-500 mb-6 max-w-[280px]">
      Your AI advertising assistant. I can analyze data, optimize campaigns, and generate reports.
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
  } = useLunaChat()

  const [inputText, setInputText] = useState('')
  const [showSources, setShowSources] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isThinking])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleSubmit = useCallback((e) => {
    e?.preventDefault()
    if (!inputText.trim() || isThinking) return
    sendMessage(inputText)
    setInputText('')
  }, [inputText, isThinking, sendMessage])

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
    <>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 bg-gradient-to-r from-white to-luna-bg/30">
        <LunaAvatar size="md" showRing />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base font-semibold text-neutral-900">Luna</h2>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success-50 text-success-600 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-caption text-neutral-500 truncate">AI Advertising Assistant</p>
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
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--neutral-200) transparent' }}>
        {chatHistory.length === 0 && !isThinking && (
          <WelcomeState onQuickPrompt={handleQuickPrompt} />
        )}

        {chatHistory.map((msg) => (
          <div key={msg.id} className="group">
            {msg.role === 'user' ? (
              <UserMessage text={msg.text} timestamp={msg.timestamp} />
            ) : (
              <LunaMessage text={msg.text} timestamp={msg.timestamp}>
                {msg.dataCard && (
                  <LunaDataCard title={msg.dataCard.title}>
                    <table className="w-full text-caption">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th className="text-left py-1.5 font-semibold text-neutral-600">Campaign</th>
                          <th className="text-right py-1.5 font-semibold text-neutral-600">Spend</th>
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
                {msg.actionCard && (
                  <LunaActionCard
                    title={msg.actionCard.title}
                    description={msg.actionCard.description}
                    primaryAction={{ label: 'Apply to Module', onClick: () => msg.syncTarget && applySyncToModule(msg.syncTarget) }}
                    secondaryAction={{ label: 'Save as Draft', onClick: () => {} }}
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
          <span>Data Sources ({activeDataSources.length})</span>
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
      <div className="px-5 pb-5 pt-2">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Luna anything about your ads..."
            rows={1}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 pl-4 pr-12 py-3 text-body text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = '48px'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="absolute right-2 bottom-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: inputText.trim() ? 'var(--luna-gradient)' : 'var(--neutral-100)' }}
          >
            <Send size={16} className={inputText.trim() ? 'text-white' : 'text-neutral-400'} />
          </button>
        </form>
        <p className="text-[10px] text-neutral-400 mt-1.5 text-center">Luna uses mock data for demo purposes</p>
      </div>
    </>
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
    <div className="fixed inset-0 z-[500] flex justify-end" role="dialog" aria-label="Luna Chat">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/30 backdrop-blur-[2px] animate-fade-in" onClick={closeChat} />

      {/* Panel */}
      <div className="relative flex flex-col w-full max-w-[460px] bg-white shadow-2xl h-full animate-slide-in-right">
        <ChatContent onClose={closeChat} />
      </div>
    </div>,
    document.body
  )
}

export default LunaChatPanel
