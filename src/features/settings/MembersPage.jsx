import { useDeferredValue, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Crown, Search, ShieldCheck, UserRound, UserPlus, X, Mail,
  MoreHorizontal, Trash2, Check, Users, LockKeyhole,
} from 'lucide-react'
import useBrandStore from '@stores/brandStore'

const ROLE_META = {
  owner: { label: '所有者', icon: Crown, badge: 'bg-warning-50 text-warning-700 border-warning-200' },
  admin: { label: '管理员', icon: ShieldCheck, badge: 'bg-primary-50 text-primary-700 border-primary-200' },
  member: { label: '普通成员', icon: UserRound, badge: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
}

const PermissionCard = ({ role, title, description }) => {
  const meta = ROLE_META[role]
  const Icon = meta.icon
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.badge}`}><Icon size={16} /></span>
        <h3 className="font-heading text-sm font-semibold text-neutral-900">{title}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">{description}</p>
    </div>
  )
}

const MembersPage = () => {
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const members = useBrandStore((s) => s.brandMembers[selectedBrand] || [])
  const currentUser = useBrandStore((s) => s.currentUser)
  const addBrandMember = useBrandStore((s) => s.addBrandMember)
  const updateMemberRole = useBrandStore((s) => s.updateMemberRole)
  const removeBrandMember = useBrandStore((s) => s.removeBrandMember)
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [showInvite, setShowInvite] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ name: '', email: '', role: 'member' })
  const [error, setError] = useState('')
  const activeMember = openMenu
    ? members.find((member) => member.id === openMenu.memberId)
    : null

  const visibleMembers = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return members
    return members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query))
  }, [members, deferredSearch])

  const submitInvite = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('请填写成员姓名和有效邮箱地址')
      return
    }
    if (members.some((member) => member.email.toLowerCase() === email)) {
      setError('该邮箱已经是当前品牌成员')
      return
    }
    addBrandMember({ name: form.name.trim(), email, role: form.role })
    setForm({ name: '', email: '', role: 'member' })
    setError('')
    setShowInvite(false)
    setNotice(`已添加 ${email}`)
  }

  const changeRole = (member, role) => {
    updateMemberRole(member.id, role)
    setOpenMenu(null)
    setNotice(`${member.name} 已设为${ROLE_META[role].label}`)
  }

  const removeMember = (member) => {
    removeBrandMember(member.id)
    setOpenMenu(null)
    setNotice(`已移除 ${member.name}`)
  }

  const toggleMemberMenu = (event, memberId) => {
    if (openMenu?.memberId === memberId) {
      setOpenMenu(null)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const menuWidth = 176
    const menuHeight = 160
    const viewportPadding = 12
    const opensUp = rect.bottom + 8 + menuHeight > window.innerHeight - viewportPadding

    setOpenMenu({
      memberId,
      top: opensUp ? Math.max(viewportPadding, rect.top - menuHeight - 8) : rect.bottom + 8,
      left: Math.max(viewportPadding, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - viewportPadding)),
    })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-neutral-200 bg-gradient-to-r from-white via-white to-primary-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md"><Users size={20} /></div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">{selectedBrand}</p>
              <h2 className="mt-1 font-heading text-lg font-semibold text-neutral-900">品牌协作成员</h2>
              <p className="mt-1 text-sm text-neutral-500">当前共 {members.length} 位成员，权限仅作用于此品牌。</p>
            </div>
          </div>
          <button onClick={() => setShowInvite(true)} className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
            <UserPlus size={17} /> 添加成员
          </button>
        </div>

        <div className="p-5">
          {notice && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-xs font-medium text-success-700" role="status">
              <span className="flex items-center gap-2"><Check size={14} />{notice}</span>
              <button onClick={() => setNotice('')} aria-label="关闭提示" className="focus-ring cursor-pointer rounded p-1 hover:bg-success-100"><X size={14} /></button>
            </div>
          )}
          <div className="relative mb-4 max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <label htmlFor="member-search" className="sr-only">搜索成员</label>
            <input id="member-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索姓名或邮箱" className="enhanced-input min-h-11 pl-9" />
          </div>

          <div className="overflow-visible rounded-xl border border-neutral-200">
            <div className="hidden grid-cols-[minmax(220px,1.6fr)_120px_1fr_48px] gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 md:grid">
              <span>成员</span><span>角色</span><span>加入日期</span><span />
            </div>
            {visibleMembers.map((member) => {
              const meta = ROLE_META[member.role]
              const RoleIcon = meta.icon
              const protectedMember = member.role === 'owner' || member.id === currentUser.id
              return (
                <div key={member.id} className="relative grid gap-3 border-b border-neutral-100 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(220px,1.6fr)_120px_1fr_48px] md:items-center md:gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-xs font-bold text-primary-700">{member.name.slice(0, 1).toUpperCase()}</div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-neutral-900">{member.name}{member.id === currentUser.id && <span className="ml-2 text-[10px] font-medium text-neutral-400">你</span>}</p><p className="truncate text-xs text-neutral-500">{member.email}</p></div>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${meta.badge}`}><RoleIcon size={12} />{meta.label}</span>
                  <span className="text-xs text-neutral-500"><span className="md:hidden">加入于 </span>{member.joinedAt}</span>
                  <div className="md:justify-self-end">
                    {!protectedMember && <button onClick={(event) => toggleMemberMenu(event, member.id)} aria-label={`管理 ${member.name}`} aria-haspopup="menu" aria-expanded={openMenu?.memberId === member.id} className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"><MoreHorizontal size={18} /></button>}
                  </div>
                </div>
              )
            })}
            {visibleMembers.length === 0 && <div className="px-4 py-12 text-center text-sm text-neutral-500">没有找到匹配的成员</div>}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2"><LockKeyhole size={16} className="text-neutral-500" /><h2 className="font-heading text-sm font-semibold text-neutral-900">角色权限</h2></div>
        <div className="grid gap-3 md:grid-cols-3">
          <PermissionCard role="owner" title="所有者" description="品牌创建人默认成为所有者，可管理品牌内全部配置、Skill 与成员。所有者不可被移除。" />
          <PermissionCard role="admin" title="管理员" description="可编辑当前品牌内全部功能与配置，也可添加、调整和移除普通成员。" />
          <PermissionCard role="member" title="普通成员" description="可操作品牌日常功能，但不可访问或修改品牌 Skill 与成员管理。" />
        </div>
      </section>

      {openMenu && activeMember && createPortal(
        <>
          <button
            type="button"
            aria-label="关闭成员操作菜单"
            className="fixed inset-0 z-[1490] cursor-default bg-transparent"
            onClick={() => setOpenMenu(null)}
            onWheel={() => setOpenMenu(null)}
          />
          <div
            role="menu"
            aria-label={`管理 ${activeMember.name}`}
            className="fixed z-[1500] w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl"
            style={{ top: openMenu.top, left: openMenu.left }}
          >
            {['admin', 'member'].map((role) => (
              <button key={role} role="menuitem" onClick={() => changeRole(activeMember, role)} className="focus-ring flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                {activeMember.role === role ? <Check size={14} className="text-primary-600" /> : <span className="w-3.5" />}
                {ROLE_META[role].label}
              </button>
            ))}
            <div className="my-1 h-px bg-neutral-200" />
            <button role="menuitem" onClick={() => removeMember(activeMember)} className="focus-ring flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-xs font-medium text-danger-600 transition-colors hover:bg-danger-50"><Trash2 size={14} />移除成员</button>
          </div>
        </>,
        document.body,
      )}

      {showInvite && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setShowInvite(false)}>
          <form onSubmit={submitInvite} className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-2xl" aria-label="添加品牌成员">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4"><div><h2 className="font-heading text-base font-semibold text-neutral-900">添加品牌成员</h2><p className="mt-1 text-xs text-neutral-500">添加到 {selectedBrand}</p></div><button type="button" onClick={() => setShowInvite(false)} aria-label="关闭" className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"><X size={18} /></button></div>
            <div className="space-y-4 p-5">
              <div><label htmlFor="invite-name" className="mb-1.5 block text-xs font-semibold text-neutral-700">成员姓名</label><input id="invite-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="enhanced-input min-h-11" placeholder="例如：陈晨" autoFocus /></div>
              <div><label htmlFor="invite-email" className="mb-1.5 block text-xs font-semibold text-neutral-700">邮箱地址</label><div className="relative"><Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input id="invite-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="enhanced-input min-h-11 pl-9" placeholder="name@company.com" /></div></div>
              <div><label htmlFor="invite-role" className="mb-1.5 block text-xs font-semibold text-neutral-700">角色</label><select id="invite-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="enhanced-select min-h-11"><option value="member">普通成员</option><option value="admin">管理员</option></select><p className="mt-1.5 text-[11px] text-neutral-500">所有者由品牌创建人自动获得，不能通过添加成员授予。</p></div>
              {error && <p className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-xs font-medium text-danger-700" role="alert">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-4"><button type="button" onClick={() => setShowInvite(false)} className="focus-ring min-h-11 cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">取消</button><button type="submit" className="focus-ring min-h-11 cursor-pointer rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700">确认添加</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MembersPage
