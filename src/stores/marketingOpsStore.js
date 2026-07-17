import { create } from 'zustand'

const useMarketingOpsStore = create((set, get) => ({
  activeBrand: 'LumaFit',
  brandSnapshots: {},
  serviceScenario: {
    id: 'scenario-lumafit-us-fatigue',
    brandId: 'brand-luma',
    productId: 'product-core-legging',
    campaignId: 'cmp-us-prospecting',
    creativeId: 'ad-core-video-fatigue',
    viewId: 2,
    skillIds: ['industry-ecommerce-budget', 'industry-ecommerce-creative'],
    knowledgeIds: ['kb-l2-benchmark', 'kb-brand-kpi', 'kb-brand-history'],
    recommendationId: 'rec-lumafit-budget-01',
    title: '美国冷启动 ROAS 下滑与主视频疲劳',
    problem: 'US Prospecting Broad 的 7 日 ROAS 降至 1.82，Core Legging Video V12 频次达到 4.7、CTR 较峰值下降 28.4%。',
    conclusion: '冷启动预算下调并替换主视频；促销期再营销预算保持不变，进入 48 小时观察。',
    status: '待确认',
  },
  views: [
    { id: 1, name: '渠道经营总览', source: '归因数据集', dimensions: ['渠道', '市场'], metrics: ['花费', '收入', 'ROAS'], shared: true, conditionalFormat: true, subtotals: true },
    { id: 2, name: 'Campaign 效率拆解', source: '广告账户数据', dimensions: ['Campaign'], metrics: ['花费', 'CTR', 'CPA'], shared: true },
    { id: 3, name: '素材疲劳监控', source: '素材数据集', dimensions: ['素材', '素材类型'], metrics: ['曝光', 'CTR', '转化'], shared: false },
  ],
  tasks: [
    { id: 1, name: '每日账户健康检查', skill: '账户异常诊断', schedule: '每天 09:00', next: '明天 09:00', enabled: true, status: '成功' },
    { id: 2, name: '素材疲劳周检', skill: '素材疲劳识别', schedule: '每周一 10:00', next: '7月20日 10:00', enabled: true, status: '成功' },
    { id: 3, name: '月度报告生成', skill: '经营报告生成', schedule: '每月 1 日 08:30', next: '8月1日 08:30', enabled: false, status: '待运行' },
  ],
  alertRules: [
    { id: 1, title: 'ROAS 低于目标', level: '高', rule: 'ROAS < 1.8，持续 2 小时', scope: '全部广告账户', channel: '站内 + 邮件', enabled: true },
    { id: 2, title: '花费增长异常', level: '中', rule: '单日花费环比 > 35%', scope: 'Meta 广告账户', channel: '站内通知', enabled: true },
    { id: 3, title: '素材 CTR 连续下降', level: '低', rule: 'CTR 连续 3 日下降', scope: '全部在投素材', channel: '站内通知', enabled: false },
  ],
  reportTemplates: [
    { id: 1, name: '客户经营日报', type: '日报', source: '渠道经营总览', schedule: '每天 09:30', recipients: '3 人', enabled: true, updated: '今天 09:31' },
    { id: 2, name: '周度投放复盘', type: '周报', source: 'Campaign 效率拆解', schedule: '每周一 10:00', recipients: '5 人', enabled: true, updated: '7月13日' },
    { id: 3, name: '月度业务报告', type: '月报', source: '归因数据集', schedule: '每月 1 日', recipients: '管理层', enabled: false, updated: '7月1日' },
  ],
  notifications: [
    { id: 1, title: '美国市场 ROAS 低于目标', detail: 'ROAS 1.72，已持续低于 1.8 达 2 小时', time: '12 分钟前', level: 'high', category: 'alert', read: false, status: '待处理', assignee: '未指派' },
    { id: 2, title: 'Meta 花费增长异常', detail: '今日花费环比增长 38%，超过预警阈值', time: '1 小时前', level: 'medium', category: 'alert', read: false, status: '处理中', assignee: 'Mia Chen' },
    { id: 3, title: '素材 CTR 连续下降', detail: 'Core Legging V12 已连续 3 日下降', time: '昨天 16:40', level: 'low', category: 'alert', read: true },
  ],
  taskRuns: [
    { id: 101, taskId: 1, time: '今天 09:00', status: '成功', duration: '42 秒', input: 'Meta US · 近 24 小时', result: '发现 2 项异常，生成 3 条建议', steps: ['读取广告账户数据', '调用账户异常诊断 Skill', '比对品牌红线', '生成处理建议'] },
    { id: 102, taskId: 1, time: '昨天 09:00', status: '失败', duration: '18 秒', input: 'Meta US · 近 24 小时', result: '素材数据源超时', steps: ['读取广告账户数据', '素材数据源连接失败'] },
    { id: 103, taskId: 2, time: '7月13日 10:00', status: '成功', duration: '1分08秒', input: '全部在投素材 · 近 7 天', result: '标记 3 个疲劳素材', steps: ['读取素材表现', '计算频次与 CTR 衰减', '输出换新清单'] },
  ],
  effectTracks: [
    { id: 1, action: 'US Prospecting Broad 降预算', before: 'ROAS 1.54 · CPA $58.60', after: 'ROAS 1.91 · CPA $46.20', change: '+24.0%', status: '有效', window: '执行后 48 小时', owner: 'Luna + 优化师' },
    { id: 2, action: 'Core Legging V12 替换', before: 'CTR 0.94% · 频次 4.7', after: 'CTR 1.38% · 频次 1.6', change: '+46.8%', status: '有效', window: '执行后 72 小时', owner: 'Mia Chen' },
    { id: 3, action: 'TikTok 英国预算下调 15%', before: 'ROAS 1.73', after: 'ROAS 1.76', change: '+1.7%', status: '观察中', window: '执行后 24 小时', owner: 'Luna' },
  ],
  actions: [
    { id: 1, actionId: 'action-budget-01', recommendationId: 'rec-lumafit-budget-01', campaignId: 'cmp-us-prospecting', skillId: 'industry-ecommerce-budget', viewId: 2, knowledgeIds: ['kb-l2-benchmark', 'kb-brand-kpi'], type: '预算调整', source: 'Luna 建议', target: 'US Prospecting Broad', before: '日预算 $140 · ROAS 1.54', action: '日预算下调至 $95', status: '已验证', proposedBy: 'Luna', approvedBy: '优化师', decision: '修改后采纳', decisionReason: '保留足够学习量，未完全采用建议的 $80', createdAt: '今天 09:38', executedAt: '今天 09:42', verificationWindow: '48 小时', result: 'ROAS 提升至 1.91', effect: '有效' },
    { id: 2, actionId: 'action-creative-01', recommendationId: 'rec-lumafit-creative-01', campaignId: 'cmp-us-prospecting', creativeId: 'ad-core-video-fatigue', skillId: 'industry-ecommerce-creative', viewId: 3, knowledgeIds: ['kb-l2-benchmark', 'kb-brand-history'], type: '素材处理', source: '预警中心', target: 'Core Legging Video V12', before: 'CTR 0.94% · 连续 3 日下降', action: '替换冷启动疲劳素材，保留再营销证明型素材', status: '验证中', proposedBy: '预警规则', approvedBy: 'Mia Chen', decision: '采纳', createdAt: '昨天 15:20', executedAt: '昨天 16:05', verificationWindow: '72 小时' },
  ],
  reportHistory: [
    { id: 1, name: '客户经营日报 · 2026/07/16', template: '客户经营日报', status: '已发送', time: '今天 09:31', rating: 5, snapshot: '渠道经营总览 · 生成时快照' },
    { id: 2, name: '客户经营日报 · 2026/07/15', template: '客户经营日报', status: '已发送', time: '昨天 09:30', rating: 4, snapshot: '渠道经营总览 · 生成时快照' },
    { id: 3, name: '周度投放复盘 · W28', template: '周度投放复盘', status: '已生成', time: '7月13日 10:02', rating: 0, snapshot: 'Campaign 效率拆解 · 生成时快照' },
  ],
  deliverables: [
    { id: 1, name: '客户经营日报 · 2026/07/16.pdf', type: '报告', source: '客户经营日报', time: '今天 09:31', status: '可下载', generatedBy: '定时任务' },
    { id: 2, name: '渠道经营总览 · 2026/07/16.csv', type: '数据导出', source: '渠道经营总览', time: '今天 08:46', status: '可下载', generatedBy: '优化师' },
  ],
  products: [
    { id: 'product-core-legging', name: 'Core Compression Legging', category: '运动服饰', price: '$68', markets: ['美国', '加拿大'], audience: '25–40 岁健身女性', sellingPoints: ['高腰支撑', '四向弹力', '不透肤'], status: '主推', source: 'Shopify', updated: '今天 10:20' },
    { id: 2, name: 'Everyday Training Bra', category: '运动服饰', price: '$42', markets: ['美国'], audience: '日常训练用户', sellingPoints: ['中强度支撑', '速干', '无钢圈'], status: '在售', source: '手动添加', updated: '昨天 16:30' },
  ],
  competitors: [
    { id: 1, name: 'AeroFlex', website: 'aeroflex.example', positioning: '专业训练与高支撑', activity: '本周增加 UGC 实测素材', channels: ['Meta', 'TikTok'], status: '重点关注' },
    { id: 2, name: 'MoveDaily', website: 'movedaily.example', positioning: '日常舒适与轻运动', activity: '推出夏季浅色系列', channels: ['Meta', 'Google'], status: '常规关注' },
  ],
  learningRecords: [
    { id: 1, recommendationIds: ['rec-lumafit-budget-01'], actionIds: ['action-budget-01'], knowledgeId: 'kb-brand-history', type: '客户偏好', title: '促销周保护再营销预算', detail: '再营销预算不因短期 ROAS 低于 1.8 自动下调，优先进入 48 小时观察。', source: '3 次人工拒绝 · 2 次动作验证', status: '已生效', impacts: ['预算红线检查', '周度策略生成'], time: '今天 10:20' },
    { id: 2, type: '有效经验', title: 'UGC 真实试穿适合冷启动换新', detail: '主视频疲劳后，真实试穿 Hook 对冷启动 CTR 与 CVR 改善明显。', source: '素材换新效果验证', status: '候选', impacts: ['素材疲劳检查'], time: '昨天 17:40' },
  ],
  industryCandidates: [
    { id: 1, title: '冷启动素材与再营销素材应分开判断疲劳', summary: '来自 4 个运动服饰品牌的脱敏结果：冷启动主素材疲劳时，再营销证明型素材通常仍保持稳定。', evidence: '4 个品牌 · 11 次动作 · 8 次验证有效', target: 'L2 投放知识', status: '待审核' },
    { id: 2, title: '大促期间预算健康检查增加保护窗口', summary: '大促品牌频繁拒绝短期低 ROAS 降预算建议，应增加促销阶段和高意向流量保护条件。', evidence: '7 个品牌 · 23 次人工修正', target: '预算健康检查 Skill', status: '待审核' },
  ],
  reportPreferences: [
    { id: 1, label: '结论优先', detail: '报告开头先给出核心结论和下一步动作', source: '5 次报告反馈', enabled: true },
    { id: 2, label: '减少过程描述', detail: '压缩数据处理过程，保留关键依据', source: '3 次低分原因', enabled: true },
  ],
  knowledgeCandidates: [
    { id: 1, recommendationId: 'rec-lumafit-budget-01', actionId: 'action-budget-01', targetType: 'L4 品牌知识', title: '促销周保留再营销预算', source: '预算建议效果追踪', summary: '促销周期间再营销预算维持 $180 后，购买量稳定且 ROAS 回升，应作为品牌特殊约束。', evidence: '2 次有效验证 · 3 次人工修正', status: '待审核' },
    { id: 2, recommendationId: 'rec-lumafit-creative-01', actionId: 'action-creative-01', targetType: '品牌 Skill 规则', title: 'UGC 压缩贴合 Hook 对冷启动有效', source: '素材换新效果追踪', summary: '替换疲劳主视频后 CTR 提升 46.8%，可沉淀为品牌素材方法。', evidence: '执行后 72 小时 · CTR +46.8%', status: '待审核' },
  ],
  activityLog: [
    { id: 1, actor: 'Luna', action: '创建预警规则', object: '美国市场 ROAS 低于 1.8', time: '今天 10:18', module: '任务与预警' },
    { id: 2, actor: '优化师', action: '应用预算建议', object: 'US Prospecting Broad $140 → $95', time: '今天 09:42', module: '广告管理' },
    { id: 3, actor: 'Mia Chen', action: '编辑多维视图', object: '渠道经营总览', time: '昨天 16:20', module: '视图与数据集' },
  ],
  setActiveBrand: (brandName) => {
    const state = get()
    if (!brandName || brandName === state.activeBrand) return
    const fields = ['views', 'tasks', 'alertRules', 'reportTemplates', 'notifications', 'taskRuns', 'effectTracks', 'actions', 'reportHistory', 'deliverables', 'products', 'competitors', 'learningRecords', 'industryCandidates', 'reportPreferences', 'knowledgeCandidates', 'activityLog']
    const currentSnapshot = Object.fromEntries(fields.map(field => [field, structuredClone(state[field])]))
    const existing = state.brandSnapshots[brandName]
    const emptyBrand = {
      views: [],
      tasks: [],
      alertRules: [],
      reportTemplates: [],
      notifications: [],
      taskRuns: [],
      effectTracks: [],
      actions: [],
      reportHistory: [],
      deliverables: [],
      products: [],
      competitors: [],
      learningRecords: [],
      industryCandidates: [],
      reportPreferences: [],
      knowledgeCandidates: [],
      activityLog: [{ id: Date.now(), actor: '系统', action: '初始化品牌运营空间', object: brandName, time: '刚刚', module: '品牌工作区' }],
    }
    set({
      activeBrand: brandName,
      brandSnapshots: { ...state.brandSnapshots, [state.activeBrand]: currentSnapshot },
      ...(existing || emptyBrand),
    })
  },
  addView: (view) => set((state) => ({ views: [...state.views, { id: Date.now(), shared: false, ...view }] })),
  updateView: (id, updates) => set((state) => ({ views: state.views.map(item => item.id === id ? { ...item, ...updates } : item) })),
  duplicateView: (id) => set((state) => {
    const source = state.views.find(item => item.id === id)
    return source ? { views: [...state.views, { ...source, id: Date.now(), name: `${source.name} 副本`, shared: false }] } : state
  }),
  removeView: (id) => set((state) => ({ views: state.views.filter(item => item.id !== id) })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, { id: Date.now(), next: '按计划计算', enabled: true, status: '待运行', ...task }] })),
  updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map(item => item.id === id ? { ...item, ...updates } : item) })),
  addTaskRun: (run) => set((state) => ({ taskRuns: [{ id: Date.now(), time: '刚刚', ...run }, ...state.taskRuns] })),
  addAlertRule: (rule) => set((state) => ({ alertRules: [{ id: Date.now(), scope: '全部广告账户', channel: '站内 + 邮件', enabled: true, ...rule }, ...state.alertRules] })),
  updateAlertRule: (id, updates) => set((state) => ({ alertRules: state.alertRules.map(item => item.id === id ? { ...item, ...updates } : item) })),
  addReportTemplate: (template) => set((state) => ({ reportTemplates: [...state.reportTemplates, { id: Date.now(), enabled: true, updated: '刚刚', ...template }] })),
  updateReportTemplate: (id, updates) => set((state) => ({ reportTemplates: state.reportTemplates.map(item => item.id === id ? { ...item, ...updates } : item) })),
  addNotification: (notification) => set((state) => ({ notifications: [{ id: Date.now(), time: '刚刚', read: false, level: 'low', category: 'system', ...notification }, ...state.notifications] })),
  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map(item => item.id === id ? { ...item, read: true } : item) })),
  markAllNotificationsRead: () => set((state) => ({ notifications: state.notifications.map(item => ({ ...item, read: true })) })),
  deleteNotification: (id) => set((state) => ({ notifications: state.notifications.filter(item => item.id !== id) })),
  clearReadNotifications: () => set((state) => ({ notifications: state.notifications.filter(item => !item.read) })),
  updateNotification: (id, updates) => set((state) => ({ notifications: state.notifications.map(item => item.id === id ? { ...item, ...updates, read: true } : item) })),
  createAction: (action) => {
    const id = Date.now()
    set((state) => ({
      actions: [{ id, status: '待执行', proposedBy: 'Luna', approvedBy: '优化师', createdAt: '刚刚', verificationWindow: '48 小时', ...action }, ...state.actions],
      activityLog: [{ id: id + 1, actor: action.approvedBy || '优化师', action: '创建执行动作', object: `${action.target} · ${action.action}`, time: '刚刚', module: action.source || '运营动作' }, ...state.activityLog],
    }))
    return id
  },
  updateAction: (id, updates) => set((state) => ({ actions: state.actions.map(item => item.id === id ? { ...item, ...updates } : item) })),
  executeAction: (id) => set((state) => {
    const item = state.actions.find(action => action.id === id)
    if (!item) return state
    return {
      actions: state.actions.map(action => action.id === id ? { ...action, status: '验证中', executedAt: '刚刚' } : action),
      effectTracks: [{ id: Date.now(), action: item.action, before: item.before, after: '等待验证窗口数据', change: '—', status: '观察中', window: `执行后 ${item.verificationWindow}`, owner: item.approvedBy }, ...state.effectTracks],
      activityLog: [{ id: Date.now() + 1, actor: item.approvedBy, action: '执行运营动作', object: `${item.target} · ${item.action}`, time: '刚刚', module: item.source }, ...state.activityLog],
    }
  }),
  verifyAction: (id, effect, result) => set((state) => {
    const item = state.actions.find(action => action.id === id)
    const candidateId = `candidate-${Date.now()}`
    const candidate = item ? {
      id: candidateId,
      recommendationId: item.recommendationId,
      actionId: item.actionId || item.id,
      targetType: effect === '有效' ? 'L4 品牌知识' : '品牌 Skill 不适用条件',
      title: effect === '有效' ? `${item.target} 的有效处理经验` : `${item.target} 的无效处理经验`,
      source: '刚刚完成的动作效果验证',
      summary: `${item.action}；验证结果：${result}`,
      evidence: `${item.verificationWindow || '观察窗口'} · ${effect}`,
      status: '待审核',
    } : null
    return {
      actions: state.actions.map(action => action.id === id ? { ...action, status: '已验证', effect, result, generatedCandidateId: candidateId } : action),
      knowledgeCandidates: candidate ? [candidate, ...state.knowledgeCandidates] : state.knowledgeCandidates,
      effectTracks: state.effectTracks.map(track => track.action === item?.action ? { ...track, status: effect, after: result, change: effect === '有效' ? '已改善' : '未改善' } : track),
      activityLog: item ? [{ id: Date.now(), actor: '优化师', action: `验证动作${effect}`, object: `${item.target} · ${result}`, time: '刚刚', module: '效果与复盘' }, ...state.activityLog] : state.activityLog,
    }
  }),
  resolveAlertWithAction: (id, updates) => set((state) => {
    const alert = state.notifications.find(item => item.id === id)
    const shouldCreate = alert && updates.resolution && ['已解决', '处理中'].includes(updates.status)
    const actionId = Date.now()
    return {
      notifications: state.notifications.map(item => item.id === id ? { ...item, ...updates, read: true, actionId: shouldCreate ? actionId : item.actionId } : item),
      actions: shouldCreate ? [{ id: actionId, type: '预警处置', source: '预警中心', target: alert.title, before: alert.detail, action: updates.resolution, status: updates.status === '已解决' ? '验证中' : '待执行', proposedBy: '预警规则', approvedBy: updates.assignee, createdAt: '刚刚', executedAt: updates.status === '已解决' ? '刚刚' : null, verificationWindow: '48 小时' }, ...state.actions] : state.actions,
      activityLog: shouldCreate ? [{ id: actionId + 1, actor: updates.assignee, action: '提交预警处置动作', object: `${alert.title} · ${updates.resolution}`, time: '刚刚', module: '通知中心' }, ...state.activityLog] : state.activityLog,
    }
  }),
  addReportHistory: (report) => set((state) => ({ reportHistory: [{ id: Date.now(), status: '已生成', time: '刚刚', rating: 0, ...report }, ...state.reportHistory] })),
  rateReport: (id, rating) => set((state) => ({ reportHistory: state.reportHistory.map(item => item.id === id ? { ...item, rating } : item) })),
  createDeliverable: (deliverable) => set((state) => ({
    deliverables: [{ id: Date.now(), time: '刚刚', status: '可下载', generatedBy: '优化师', ...deliverable }, ...state.deliverables],
  })),
  addProduct: (product) => set((state) => ({ products: [{ id: Date.now(), status: '在售', source: '手动添加', updated: '刚刚', sellingPoints: [], markets: [], ...product }, ...state.products] })),
  updateProduct: (id, updates) => set((state) => ({ products: state.products.map(item => item.id === id ? { ...item, ...updates, updated: '刚刚' } : item) })),
  removeProduct: (id) => set((state) => ({ products: state.products.filter(item => item.id !== id) })),
  addCompetitor: (competitor) => set((state) => ({ competitors: [{ id: Date.now(), status: '常规关注', channels: ['Meta'], activity: '等待下次监测', ...competitor }, ...state.competitors] })),
  removeCompetitor: (id) => set((state) => ({ competitors: state.competitors.filter(item => item.id !== id) })),
  addViewSnapshotToReport: (viewId, reportId) => set((state) => {
    const view = state.views.find(item => item.id === viewId)
    const report = state.reportTemplates.find(item => item.id === reportId)
    if (!view || !report) return state
    const snapshot = { id: Date.now(), viewId, name: view.name, source: view.source, dimensions: [...view.dimensions], metrics: [...view.metrics], capturedAt: '刚刚' }
    return {
      reportTemplates: state.reportTemplates.map(item => item.id === reportId ? { ...item, viewSnapshots: [...(item.viewSnapshots || []), snapshot], updated: '刚刚' } : item),
      activityLog: [{ id: Date.now() + 1, actor: '优化师', action: '将视图加入报告', object: `${view.name} → ${report.name}`, time: '刚刚', module: '多维分析' }, ...state.activityLog],
    }
  }),
  addInsightToReport: (insight) => set((state) => {
    const report = state.reportTemplates[0]
    if (!report) return state
    const snapshot = { id: Date.now(), type: '外部洞察', capturedAt: '刚刚', ...insight }
    return {
      reportTemplates: state.reportTemplates.map(item => item.id === report.id ? { ...item, insightSnapshots: [...(item.insightSnapshots || []), snapshot], updated: '刚刚' } : item),
      activityLog: [{ id: Date.now() + 1, actor: '优化师', action: '将外部洞察加入报告', object: `${insight.title} → ${report.name}`, time: '刚刚', module: '市场与竞品' }, ...state.activityLog],
    }
  }),
  addLearningRecord: (record) => set((state) => ({ learningRecords: [{ id: Date.now(), time: '刚刚', status: '候选', ...record }, ...state.learningRecords] })),
  reviewIndustryCandidate: (id, status) => set((state) => ({
    industryCandidates: state.industryCandidates.map(item => item.id === id ? { ...item, status } : item),
    activityLog: [{ id: Date.now(), actor: '平台管理员', action: status === '已升级' ? '升级行业候选经验' : '忽略行业候选经验', object: state.industryCandidates.find(item=>item.id===id)?.title, time: '刚刚', module: '平台能力管理' }, ...state.activityLog],
  })),
  addReportPreference: (preference) => set((state) => ({ reportPreferences: [{ id: Date.now(), enabled: true, source: '报告反馈', ...preference }, ...state.reportPreferences] })),
  toggleReportPreference: (id) => set((state) => ({ reportPreferences: state.reportPreferences.map(item=>item.id===id?{...item,enabled:!item.enabled}:item) })),
  reviewKnowledgeCandidate: (id, status) => set((state) => ({
    knowledgeCandidates: state.knowledgeCandidates.map(item => item.id === id ? { ...item, status } : item),
    activityLog: [{ id: Date.now(), actor: '优化师', action: status === '已采纳' ? '采纳候选知识' : '忽略候选知识', object: state.knowledgeCandidates.find(item => item.id === id)?.title, time: '刚刚', module: '知识沉淀' }, ...state.activityLog],
  })),
  addActivity: (entry) => set((state) => ({ activityLog: [{ id: Date.now(), time: '刚刚', ...entry }, ...state.activityLog] })),
  executeLunaOperation: (operation) => {
    if (!operation?.kind) return null
    const state = get()
    if (operation.kind === 'task') state.addTask(operation.data)
    if (operation.kind === 'alert') state.addAlertRule(operation.data)
    if (operation.kind === 'report') state.addReportTemplate(operation.data)
    if (operation.kind === 'view') state.addView(operation.data)
    const labels = { task: '定时任务', alert: '预警规则', report: '报告模板', view: '多维视图' }
    state.addNotification({
      title: `Luna 已创建${labels[operation.kind]}`,
      detail: operation.data.name || operation.data.title,
      level: 'low',
    })
    return labels[operation.kind]
  },
}))

export default useMarketingOpsStore
