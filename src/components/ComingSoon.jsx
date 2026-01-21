import React from 'react'
import { Rocket } from 'lucide-react'

const ComingSoon = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-primary/10 rounded-3xl animate-ping opacity-20" />
        <Rocket size={40} className="text-primary animate-bounce duration-[2000ms]" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
        {title || 'Coming Soon'}
      </h2>
      
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-lg">
        {subtitle || 'Our team is working hard to bring this feature to life. Stay tuned for something amazing!'}
      </p>
      
      <div className="mt-10 flex gap-3">
        <div className="h-1 w-8 bg-slate-200 rounded-full" />
        <div className="h-1 w-12 bg-primary rounded-full shadow-sm shadow-primary/30" />
        <div className="h-1 w-8 bg-slate-200 rounded-full" />
      </div>
      
      <div className="mt-12 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium text-slate-600">Currently in active development</span>
      </div>
    </div>
  )
}

export default ComingSoon
