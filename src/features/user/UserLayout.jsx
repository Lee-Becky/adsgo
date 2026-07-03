import { Outlet, NavLink } from 'react-router-dom'
import { Users, BarChart3, ChevronLeft } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   UserLayout — Independent layout for user management area
   Simplified sidebar (not the full workspace sidebar)
   ═══════════════════════════════════════════════════════════ */

const USER_NAV = [
  { path: 'clients', label: '客户账户', icon: Users },
  { path: 'stats', label: '客户报告', icon: BarChart3 },
]

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Simplified sidebar */}
      <aside className="w-60 bg-ink-800 flex flex-col shrink-0">
        {/* Header */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-ink-700">
          <NavLink
            to="/workspace/default/plan/media-plan"
            className="flex items-center gap-2 text-ink-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="text-caption font-semibold">返回工作台</span>
          </NavLink>
        </div>

        {/* Title */}
        <div className="px-5 py-4">
          <h2 className="font-heading text-sm font-semibold text-white">客户账户</h2>
          <p className="text-[11px] text-ink-300 mt-0.5">查看客户投放状态和报告</p>
        </div>

        {/* Nav items */}
        <nav className="px-3 space-y-1">
          {USER_NAV.map(item => (
            <NavLink
              key={item.path}
              to={`/user/${item.path}`}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-[13px] transition-all
                ${isActive
                  ? 'bg-ink-700 text-white'
                  : 'text-ink-300 hover:text-white hover:bg-ink-700'
                }
              `}
            >
              <item.icon size={18} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* User info */}
        <div className="p-4 border-t border-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-100">优化师</p>
              <p className="text-[10px] text-ink-300">LumaFit 今日值班</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default UserLayout
