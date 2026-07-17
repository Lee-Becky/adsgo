import { create } from 'zustand'

/* ═══════════════════════════════════════════════════════════
   Brand Store — brand selection, switching, CRUD
   Extracted from App.jsx useState declarations
   ═══════════════════════════════════════════════════════════ */

const useBrandStore = create((set, get) => ({
  /* ── State ──────────────────────────────────────────────── */
  brands: ['LumaFit', 'NorthPeak', 'Nova App'],
  selectedBrand: 'LumaFit',
  brandDetails: {
    LumaFit: { url: 'https://lumafit.example', isAnalyzed: true, industry: '电商' },
    NorthPeak: { url: 'https://northpeak.example', isAnalyzed: true, industry: '电商' },
    'Nova App': { url: 'https://nova-app.example', isAnalyzed: true, industry: '应用' },
  },
  isBrandSwitching: false,
  isCreateBrandModalOpen: false,
  editingBrand: null,
  currentUser: {
    id: 'user-owner',
    name: '优化师',
    email: 'operator@adsgo.ai',
    platformRole: 'platform_admin',
  },
  industrySkills: [
    { id: 'industry-ecommerce-budget', name: '电商预算健康检查', description: '按电商行业基准检查 ROAS、CPA 与预算消耗节奏，识别异常预算分配。', iconKey: 'budget', industry: '电商', status: 'published', enabled: true, version: 'v1.2' },
    { id: 'industry-ecommerce-creative', name: '电商素材疲劳预警', description: '结合行业频次与转化衰减基准，识别需要换新的广告素材。', iconKey: 'creative', industry: '电商', status: 'published', enabled: true, version: 'v1.0' },
    { id: 'industry-app-scale', name: '应用扩量机会识别', description: '在学习期稳定且获客成本优于行业基准时，生成扩量机会建议。', iconKey: 'audience', industry: '应用', status: 'draft', enabled: false, version: 'v0.8' },
  ],
  industryKnowledge: [
    { id: 'kb-l1-ecommerce', level: 'L1', title: '电商行业基础认知', summary: '行业分类、商业模式、用户画像与市场特征。', updateFrequency: '季度更新', maintainer: '行业管理员', industry: '电商', status: 'published' },
    { id: 'kb-l2-benchmark', level: 'L2', title: '广告投放基准与最佳实践', summary: '平台特征、行业基准数据、阶段策略与渠道最佳实践。', updateFrequency: '月度更新', maintainer: '行业管理员 + 优化师', industry: '全行业', status: 'published' },
    { id: 'kb-l3-competitor', level: 'L3', title: '竞品与市场动态', summary: '竞品素材、AI 曝光、市场变化与新品上线动态。', updateFrequency: '每周自动更新', maintainer: '定时任务 + 管理员审核', industry: '电商', status: 'published' },
  ],
  brandMembers: {
    LumaFit: [
      { id: 'user-owner', name: '优化师', email: 'operator@adsgo.ai', role: 'owner', status: 'active', joinedAt: '2026-06-18' },
      { id: 'user-admin', name: 'Mia Chen', email: 'mia@adsgo.ai', role: 'admin', status: 'active', joinedAt: '2026-06-22' },
      { id: 'user-member', name: 'Alex Wu', email: 'alex@adsgo.ai', role: 'member', status: 'active', joinedAt: '2026-07-02' },
    ],
  },
  brandSkills: {
    LumaFit: [
      { id: 'auto-budget', name: '预算红线检查', description: '每天 10:00 检查 ROAS、CPA 和预算上限，发现预算浪费后生成降预算建议。', iconKey: 'budget', enabled: true },
      { id: 'creative-refresh', name: '素材疲劳检查', description: '监控素材频次、CTR 和 CVR，频次超过品牌阈值后进入换新。', iconKey: 'creative', enabled: true },
      { id: 'audience-expansion', name: '受众扩量建议', description: '当 Lookalike 学习期稳定且 CPA 低于红线时，生成扩量建议。', iconKey: 'audience', enabled: false },
      { id: 'question-mode', name: '客户偏好追问', description: '当优化师的处理偏离建议时，主动追问原因并沉淀品牌偏好。', iconKey: 'message', enabled: true },
      { id: 'auto-report', name: '客户日报草稿', description: '每天 19:00 汇总异常、预算动作、素材换新和明日观察点。', iconKey: 'report', enabled: true },
      { id: 'anomaly-detection', name: '异常波动提醒', description: '监控花费、CPA、CVR 和频次异常，并同步到广告管理和策略。', iconKey: 'alert', enabled: true },
    ],
    NorthPeak: [],
    'Nova App': [],
  },
  brandKnowledge: {
    LumaFit: [
      { id: 'kb-brand-kpi', level: 'L4', title: '品牌 KPI 与预算红线', summary: '沉淀当前品牌的 ROAS、CPA 目标、预算边界与特殊约束。', updateFrequency: '实时更新', maintainer: 'Luna + 优化师', status: 'active' },
      { id: 'kb-brand-history', level: 'L4', title: '历史操作经验', summary: '记录品牌关键投放判断、已验证策略及需要持续遵循的偏好。', updateFrequency: '对话中积累', maintainer: 'Luna + 优化师', status: 'active' },
    ],
    NorthPeak: [],
    'Nova App': [],
  },
  brandIndustryKnowledge: {
    LumaFit: ['kb-l1-ecommerce', 'kb-l2-benchmark', 'kb-l3-competitor'],
    NorthPeak: [],
    'Nova App': [],
  },
  distributionRecords: [],
  brandPendingAssets: {
    LumaFit: [],
    NorthPeak: ['industry-ecommerce-budget', 'industry-ecommerce-creative'],
    'Nova App': [],
  },
  brandPendingKnowledge: { LumaFit: [], NorthPeak: [], 'Nova App': [] },
  capabilityInstallations: {
    LumaFit: { status: 'complete', packageName: '运动服饰电商运营包', installedAt: '2026-07-01', conflicts: 0 },
    NorthPeak: { status: 'pending', packageName: '电商基础运营包', conflicts: 1 },
    'Nova App': { status: 'not_started', packageName: '应用增长运营包', conflicts: 0 },
  },
  capabilitySetupOpen: false,
  skillUpgrades: [
    { id: 'upgrade-budget-v12', brand: 'LumaFit', skillId: 'industry-ecommerce-budget', skill: '电商预算健康检查', current: 'v1.1', latest: 'v1.2', conflict: '品牌覆盖「促销周保护窗口」需保留', impact: ['每日账户健康检查', 'ROAS 预警规则', 'Luna 预算建议'], status: '待确认' },
    { id: 'upgrade-creative-v11', brand: 'NorthPeak', skillId: 'industry-ecommerce-creative', skill: '电商素材疲劳预警', current: 'v1.0', latest: 'v1.1', conflict: '无冲突，可安全升级', impact: ['素材疲劳周检'], status: '待确认' },
  ],

  /* ── Actions ────────────────────────────────────────────── */
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  setDemoRole: (role) => set({ currentUser: role === 'platform_admin'
    ? { id: 'user-owner', name: '平台管理员', email: 'platform@adsgo.ai', platformRole: 'platform_admin' }
    : role === 'brand_admin'
      ? { id: 'user-admin', name: 'Mia Chen', email: 'mia@adsgo.ai', platformRole: 'user' }
      : { id: 'user-member', name: 'Alex Wu', email: 'alex@adsgo.ai', platformRole: 'user' } }),
  setCapabilitySetupOpen: (open) => set({ capabilitySetupOpen: open }),

  setBrands: (updater) => set((state) => ({
    brands: typeof updater === 'function' ? updater(state.brands) : updater,
  })),

  setBrandDetails: (updater) => set((state) => ({
    brandDetails: typeof updater === 'function' ? updater(state.brandDetails) : updater,
  })),

  setIsBrandSwitching: (val) => set({ isBrandSwitching: val }),
  setIsCreateBrandModalOpen: (val) => set({ isCreateBrandModalOpen: val }),
  setEditingBrand: (brand) => set({ editingBrand: brand }),
  clearEditingBrand: () => set({ editingBrand: null }),

  getCurrentRole: (brandName = get().selectedBrand) => {
    const state = get()
    return state.brandMembers[brandName]?.find((member) => member.id === state.currentUser.id)?.role || 'member'
  },

  canManageBrand: (brandName = get().selectedBrand) => ['owner', 'admin'].includes(get().getCurrentRole(brandName)),

  addBrandMember: (member, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    set((state) => ({
      brandMembers: {
        ...state.brandMembers,
        [brandName]: [...(state.brandMembers[brandName] || []), {
          id: `member-${Date.now()}`,
          status: 'active',
          joinedAt: new Date().toISOString().slice(0, 10),
          ...member,
        }],
      },
    }))
    return true
  },

  updateMemberRole: (memberId, role, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName) || role === 'owner') return false
    set((state) => ({
      brandMembers: {
        ...state.brandMembers,
        [brandName]: (state.brandMembers[brandName] || []).map((member) =>
          member.id === memberId && member.role !== 'owner' ? { ...member, role } : member),
      },
    }))
    return true
  },

  removeBrandMember: (memberId, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    const target = get().brandMembers[brandName]?.find((member) => member.id === memberId)
    if (!target || target.role === 'owner' || target.id === get().currentUser.id) return false
    set((state) => ({
      brandMembers: {
        ...state.brandMembers,
        [brandName]: (state.brandMembers[brandName] || []).filter((member) => member.id !== memberId),
      },
    }))
    return true
  },

  addBrandSkill: (skill, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    set((state) => ({
      brandSkills: {
        ...state.brandSkills,
        [brandName]: [...(state.brandSkills[brandName] || []), {
          ...skill,
          id: skill.id || `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        }],
      },
    }))
    return true
  },

  updateBrandSkill: (skillId, updates, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    set((state) => ({
      brandSkills: {
        ...state.brandSkills,
        [brandName]: (state.brandSkills[brandName] || []).map((skill) =>
          skill.id === skillId ? { ...skill, ...updates, id: skill.id } : skill),
      },
    }))
    return true
  },

  toggleBrandSkill: (skillId, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    set((state) => ({
      brandSkills: {
        ...state.brandSkills,
        [brandName]: (state.brandSkills[brandName] || []).map((skill) =>
          skill.id === skillId ? { ...skill, enabled: !skill.enabled } : skill),
      },
    }))
    return true
  },

  canManageIndustrySkills: () => get().currentUser.platformRole === 'platform_admin',

  reviewSkillUpgrade: (upgradeId, status) => set((state) => ({
    skillUpgrades: state.skillUpgrades.map((item) => item.id === upgradeId ? { ...item, status } : item),
  })),

  addSkillUpgrade: (upgrade) => set((state) => ({
    skillUpgrades: [{ id: `upgrade-${Date.now()}`, status: '待确认', ...upgrade }, ...state.skillUpgrades],
  })),

  distributeIndustryAssets: ({ targetMode, industry, brandNames = [], skillIds = [], knowledgeIds = [] }) => {
    if (!get().canManageIndustrySkills()) return { success: false, targets: [] }
    const state = get()
    const targets = targetMode === 'industry'
      ? state.brands.filter((brand) => state.brandDetails[brand]?.industry === industry)
      : brandNames
    if (!targets.length || (!skillIds.length && !knowledgeIds.length)) return { success: false, targets: [] }
    set((current) => {
      const pendingSkills = { ...current.brandPendingAssets }
      const pendingKnowledge = { ...current.brandPendingKnowledge }
      targets.forEach((brand) => { pendingSkills[brand] = [...new Set([...(pendingSkills[brand] || []), ...skillIds])]; pendingKnowledge[brand] = [...new Set([...(pendingKnowledge[brand] || []), ...knowledgeIds])] })
      return {
        brandPendingAssets: pendingSkills,
        brandPendingKnowledge: pendingKnowledge,
        capabilityInstallations: { ...current.capabilityInstallations, ...Object.fromEntries(targets.map(brand => [brand, { ...(current.capabilityInstallations[brand] || {}), status: 'pending', packageName: `${industry || current.brandDetails[brand]?.industry || '行业'}能力分发`, conflicts: current.capabilityInstallations[brand]?.conflicts || 0 }])) },
        distributionRecords: [{
          id: `distribution-${Date.now()}`,
          targetMode,
          industry,
          brands: targets,
          skillIds,
          knowledgeIds,
          createdAt: '刚刚',
          createdBy: '平台管理员',
        }, ...current.distributionRecords],
      }
    })
    return { success: true, targets }
  },

  installCapabilityPackage: ({ brandName = get().selectedBrand, skillIds = [], knowledgeIds = [], packageName = '行业运营能力包', overrides = {} }) => {
    if (!get().canManageBrand(brandName)) return false
    const state = get()
    const selected = state.industrySkills.filter(item => skillIds.includes(item.id) && item.status === 'published')
    set((current) => {
      const existing = current.brandSkills[brandName] || []
      const additions = selected.filter(item => !existing.some(x => x.sourceSkillId === item.id)).map(item => ({
        id: `installed-${brandName}-${item.id}`, name: item.name, description: item.description, iconKey: item.iconKey,
        enabled: true, sourceType: 'industry', sourceSkillId: item.id, version: item.version,
        installedAt: '刚刚', brandOverrides: overrides,
      }))
      return {
        brandSkills: { ...current.brandSkills, [brandName]: [...existing, ...additions] },
        brandIndustryKnowledge: { ...current.brandIndustryKnowledge, [brandName]: [...new Set([...(current.brandIndustryKnowledge[brandName] || []), ...knowledgeIds])] },
        brandPendingAssets: { ...current.brandPendingAssets, [brandName]: [] },
        brandPendingKnowledge: { ...current.brandPendingKnowledge, [brandName]: [] },
        capabilityInstallations: { ...current.capabilityInstallations, [brandName]: { status: 'complete', packageName, installedAt: '刚刚', conflicts: 0, overrides } },
        capabilitySetupOpen: false,
      }
    })
    return true
  },

  addIndustrySkill: (skill) => {
    if (!get().canManageIndustrySkills()) return false
    set((state) => ({ industrySkills: [...state.industrySkills, {
      ...skill,
      id: `industry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      version: skill.version || 'v1.0',
    }] }))
    return true
  },

  updateIndustrySkill: (skillId, updates) => {
    if (!get().canManageIndustrySkills()) return false
    set((state) => ({ industrySkills: state.industrySkills.map((skill) =>
      skill.id === skillId ? { ...skill, ...updates, id: skill.id } : skill) }))
    return true
  },

  publishIndustryCandidate: ({ title, summary, targetType = 'skill' }) => {
    if (!get().canManageIndustrySkills()) return null
    const state = get()
    if (targetType === 'knowledge') {
      const id = `knowledge-${Date.now()}`
      set((current) => ({ industryKnowledge: [...current.industryKnowledge, { id, level: 'L2', title, summary, updateFrequency: '效果验证后更新', maintainer: '平台管理员', industry: '电商', status: 'published' }] }))
      return { type: 'knowledge', version: 'L2' }
    }
    const target = state.industrySkills.find(item => item.id === 'industry-ecommerce-budget') || state.industrySkills[0]
    if (!target) return null
    const majorMinor = Number(String(target.version || 'v1.0').split('.')[1] || 0) + 1
    const version = `v1.${majorMinor}`
    const newRule = '促销或高意向场景先检查品牌保护窗口，再决定是否调整预算'
    set((current) => ({
      industrySkills: current.industrySkills.map(item => item.id === target.id ? { ...item, version, status: 'published', lastUpgradeSource: title, steps: [...(item.steps || []), newRule], verificationPolicy: item.verificationPolicy || '执行后 48–72 小时验证 ROAS、CPA 与购买量' } : item),
      skillUpgrades: [...current.skillUpgrades, ...current.brands.filter(brand => current.brandDetails[brand]?.industry === target.industry).map(brand => ({ id: `upgrade-${brand}-${Date.now()}`, brand, skillId: target.id, skill: target.name, current: target.version, latest: version, conflict: brand === 'LumaFit' ? '需保留品牌促销期保护规则' : '无冲突，可安全升级', impact: ['定时任务', '预警规则', 'Luna 判断'], status: '待确认' }))],
    }))
    return { type: 'skill', version, skillId: target.id }
  },

  addIndustryKnowledge: (item) => {
    if (!get().canManageIndustrySkills()) return false
    set((state) => ({ industryKnowledge: [...state.industryKnowledge, {
      ...item,
      id: `knowledge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }] }))
    return true
  },

  updateIndustryKnowledge: (itemId, updates) => {
    if (!get().canManageIndustrySkills()) return false
    set((state) => ({ industryKnowledge: state.industryKnowledge.map((item) =>
      item.id === itemId ? { ...item, ...updates, id: item.id } : item) }))
    return true
  },

  addBrandKnowledge: (item, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    set((state) => ({ brandKnowledge: {
      ...state.brandKnowledge,
      [brandName]: [...(state.brandKnowledge[brandName] || []), {
        ...item,
        id: `brand-knowledge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        level: 'L4',
      }],
    } }))
    return true
  },

  updateBrandKnowledge: (itemId, updates, brandName = get().selectedBrand) => {
    if (!get().canManageBrand(brandName)) return false
    set((state) => ({ brandKnowledge: {
      ...state.brandKnowledge,
      [brandName]: (state.brandKnowledge[brandName] || []).map((item) =>
        item.id === itemId ? { ...item, ...updates, id: item.id, level: 'L4' } : item),
    } }))
    return true
  },

  /* ── Compound actions ───────────────────────────────────── */
  switchBrand: (brand) => {
    set({ isBrandSwitching: true, selectedBrand: brand })
    // Simulate loading/syncing time
    setTimeout(() => {
      set({ isBrandSwitching: false })
    }, 1500)
  },

  createBrand: (newBrand) => {
    const brandName = newBrand.name
    set((state) => {
      const updatedBrands = state.brands.includes(brandName)
        ? state.brands
        : [...state.brands, brandName]
      return {
        brands: updatedBrands,
        brandDetails: {
          ...state.brandDetails,
          [brandName]: {
            url: newBrand.url || '',
            isAnalyzed: false,
            industry: newBrand.industry || '电商',
          },
        },
        brandMembers: {
          ...state.brandMembers,
          [brandName]: [{
            ...state.currentUser,
            role: 'owner',
            status: 'active',
            joinedAt: new Date().toISOString().slice(0, 10),
          }],
        },
        brandSkills: {
          ...state.brandSkills,
          [brandName]: state.brandSkills[brandName] || [],
        },
        brandKnowledge: {
          ...state.brandKnowledge,
          [brandName]: state.brandKnowledge[brandName] || [],
        },
        brandIndustryKnowledge: {
          ...state.brandIndustryKnowledge,
          [brandName]: state.brandIndustryKnowledge[brandName] || [],
        },
        brandPendingAssets: { ...state.brandPendingAssets, [brandName]: [] },
        brandPendingKnowledge: { ...state.brandPendingKnowledge, [brandName]: [] },
        capabilityInstallations: { ...state.capabilityInstallations, [brandName]: { status: 'not_started', packageName: '待推荐', conflicts: 0 } },
        capabilitySetupOpen: true,
      }
    })
    // Then switch to new brand
    get().switchBrand(brandName)
  },

  updateBrandDetail: (brandName, details) => {
    set((state) => ({
      brandDetails: {
        ...state.brandDetails,
        [brandName]: { ...state.brandDetails[brandName], ...details },
      },
    }))
  },
}))

export default useBrandStore
