const MODULE_CONTENT = {
  mediaPlan: {
    eyebrow: '媒体计划',
    title: '6 月美国市场预算修复计划',
    summary: '美国市场 ROAS 已降至 1.82，月度计划需要先收缩冷启动浪费，再用新素材恢复 Prospecting 转化。',
    metrics: [
      ['月度目标 ROAS', '2.40', '当前 1.82'],
      ['美国预算占比', '60%', '本周先降 $45/day'],
      ['待换新素材', '1', 'Core Legging Video V12'],
      ['观察窗口', '48h', 'US Retargeting'],
    ],
    primary: '本周先保护再营销曝光，冷启动预算从 $140 降到 $95；素材换新完成后再评估是否恢复放量。',
    rows: [
      ['US Prospecting Broad', '降预算', '$140 → $95', '等待 UGC Hook 学习'],
      ['US Retargeting Purchase', '保持预算', '$180', '促销周保留曝光'],
      ['CA Expansion Test', '保持预算', '$80', 'ROAS 2.71，稳定贡献'],
    ],
  },
  performance: {
    eyebrow: '表现数据',
    title: '美国市场今日表现',
    summary: '点击兴趣没有明显下滑，主要问题集中在冷启动转化效率和素材疲劳。',
    metrics: [
      ['美国 ROAS', '1.82', '目标 2.40'],
      ['美国 CPA', '$42.80', '高于红线'],
      ['CTR', '1.74%', '基本稳定'],
      ['购买', '26', '近 7 天'],
    ],
    primary: '如果 CTR 稳定但 ROAS 下滑，优先检查素材疲劳、落地页转化和冷启动预算，而不是直接暂停所有 Campaign。',
    rows: [
      ['US Prospecting Broad', 'ROAS 1.54', 'CPA $58.60', '今日降预算'],
      ['US Retargeting Purchase', 'ROAS 1.82', 'CPA $42.80', '48 小时观察'],
      ['US 3 Percent Lookalike', 'ROAS 2.18', 'CPA $34.20', '学习期保留'],
    ],
  },
  bulkLaunch: {
    eyebrow: '批量发布',
    title: '美国冷启动换新发布审核',
    summary: '两条 UGC Hook 已进入待发布结构，发布前还需确认 UGC Hook 02 的首句卖点。',
    metrics: [
      ['待发布广告', '3', '2 个 AdSet'],
      ['日预算合计', '$95', '低于红线'],
      ['文案待确认', '1', 'UGC Hook 02'],
      ['保留素材', '1', '客户证言轮播'],
    ],
    primary: '发布前只保留必要动作：确认预算、确认文案、确认疲劳素材不再进入冷启动。',
    rows: [
      ['UGC Hook 01 - Compression Fit', '待发布', '$55 AdSet', '首屏展示压缩贴合测试'],
      ['UGC Hook 02 - Morning Routine', '文案待确认', '$55 AdSet', '首句卖点待客户确认'],
      ['Customer Proof Carousel Holdout', '待发布', '$40 AdSet', '再营销保留'],
    ],
  },
  aiCreative: {
    eyebrow: '素材生成',
    title: 'UGC Hook 换新方向',
    summary: '冷启动主视频已疲劳，新素材首屏需要更快展示产品使用场景和真实评价。',
    metrics: [
      ['疲劳频次', '4.7', 'V12 主视频'],
      ['CTR 下滑', '-28.4%', '较峰值'],
      ['新 Hook', '2', '待发布'],
      ['保留素材', '1', '证言轮播'],
    ],
    primary: '生成方向聚焦两类开头：压缩贴合测试、晨间训练场景。避免继续复用旧产品静态角度。',
    rows: [
      ['Compression Fit', '前 3 秒展示贴合测试', '冷启动', '优先发布'],
      ['Morning Routine', '晨间训练场景切入', '冷启动', '文案确认'],
      ['Proof Carousel', '真实客户证言', '再营销', '继续保留'],
    ],
  },
  audience: {
    eyebrow: '受众',
    title: '美国受众效率拆解',
    summary: '广泛冷启动人群转化变弱，再营销和 Lookalike 仍有保留价值。',
    metrics: [
      ['Broad ROAS', '1.54', '待降预算'],
      ['Retargeting ROAS', '1.82', '促销周保留'],
      ['Lookalike ROAS', '2.18', '学习期'],
      ['CA Test ROAS', '2.71', '稳定'],
    ],
    primary: '预算不应从所有美国受众平均抽走，而是先削减 Broad，保留高意向再营销和学习期 Lookalike。',
    rows: [
      ['Broad Fitness Buyers', '冷启动', 'CPA $58.60', '降预算'],
      ['Visitors 7D Purchase Intent', '再营销', 'CPA $44.10', '观察'],
      ['US 3 Percent Lookalike', '相似人群', 'CPC -11.8%', '保留'],
    ],
  },
  landingPage: {
    eyebrow: '落地页',
    title: '美国流量转化检查',
    summary: 'CTR 基本稳定但 CVR 下滑，落地页需要与新 UGC Hook 保持同一卖点顺序。',
    metrics: [
      ['CVR 下降', '-18.6%', '近 7 天'],
      ['CTR', '1.74%', '稳定'],
      ['核心卖点', '贴合测试', '首屏强化'],
      ['客户证言', '保留', '再营销页'],
    ],
    primary: '新广告首屏讲压缩贴合，落地页首屏也应同步呈现相同证据，否则点击后的购买意图会断层。',
    rows: [
      ['首屏卖点', '压缩贴合测试', '需同步 UGC Hook 01', '高优先级'],
      ['评价模块', '客户证言', '再营销继续使用', '保留'],
      ['尺码说明', '降低购买犹豫', '补充在首屏下方', '中优先级'],
    ],
  },
  creativeInsight: {
    eyebrow: '素材洞察',
    title: '素材对 ROAS 的影响',
    summary: 'Core Legging Video V12 的疲劳正在拖累 Prospecting，证言轮播仍支撑再营销。',
    metrics: [
      ['V12 频次', '4.7', '疲劳'],
      ['V12 CTR', '0.94%', '下滑'],
      ['证言轮播 ROAS', '2.04', '保留'],
      ['待生成 Hook', '2', '冷启动'],
    ],
    primary: '素材动作不是全量替换，而是冷启动换新、再营销保留、静态图继续观察。',
    rows: [
      ['Core Legging Video V12', '疲劳', '下线冷启动', '今日处理'],
      ['Customer Proof Carousel', '稳定', '保留再营销', '本周继续'],
      ['Studio Static Set A', '观察', 'CPA 上升', '48 小时观察'],
    ],
  },
  brandInfo: {
    eyebrow: '品牌信息',
    title: 'LumaFit 投放约束',
    summary: '品牌当前处于促销周，客户明确要求保留再营销曝光，预算优化不能只按 ROAS 自动下调。',
    metrics: [
      ['核心市场', '美国', '预算占比 60%'],
      ['目标 ROAS', '2.40', 'Purchase'],
      ['日预算红线', '$300', '美国市场'],
      ['客户偏好', '保留再营销', '促销周'],
    ],
    primary: '促销周规则：再营销预算可高于系统建议，但必须进入 48 小时观察并写入客户日报。',
    rows: [
      ['预算红线', '美国 $300/day', '当前 $303.1', '需要调整'],
      ['再营销偏好', '促销周保留曝光', 'US Retargeting', '已记录'],
      ['素材规则', '频次 > 4.5 进入换新', 'V12 已触发', '执行中'],
    ],
  },
  accounts: {
    eyebrow: '广告账号',
    title: '投放账号状态',
    summary: '美国市场异常来自 Meta 账号内的 3 个 Campaign，加拿大 TikTok 测试仍稳定。',
    metrics: [
      ['Meta US', '异常', '3 个 Campaign'],
      ['TikTok CA', '稳定', 'ROAS 2.71'],
      ['同步时间', '10:08', '今日'],
      ['待处理动作', '3', '预算/素材'],
    ],
    primary: '当前无需处理账号连接，重点是 Meta US 的预算动作和素材换新。',
    rows: [
      ['Meta · LumaFit US', '已连接', 'ROAS 1.82', '待处理'],
      ['TikTok · CA Expansion', '已连接', 'ROAS 2.71', '稳定'],
      ['Google · Search', '已连接', '非本次异常源', '观察'],
    ],
  },
  goals: {
    eyebrow: '目标与阶段',
    title: 'LumaFit 优化目标',
    summary: '目标红线用于判断今天哪些预算动作必须执行，哪些客户偏好可以覆盖系统建议。',
    metrics: [
      ['Purchase ROAS', '2.40', '目标'],
      ['CPA 红线', '$42', '美国市场'],
      ['频次红线', '4.5', '冷启动素材'],
      ['日预算红线', '$300', '美国市场'],
    ],
    primary: 'US Prospecting 已同时触发 ROAS、CPA、素材频次风险，应优先降预算并换新素材。',
    rows: [
      ['ROAS 目标', '2.40', '当前 1.82', '未达标'],
      ['CPA 红线', '$42', '当前 $42.80', '触发'],
      ['频次红线', '4.5', 'V12 当前 4.7', '触发'],
    ],
  },
  datasets: {
    eyebrow: '数据集',
    title: '今日判断所用数据',
    summary: '预算、素材和客户偏好共同决定本次动作，避免只用单一 ROAS 指标做自动暂停。',
    metrics: [
      ['广告表现', '已更新', '10:08'],
      ['素材表现', '已更新', '10:18'],
      ['订单转化', '已更新', '10:30'],
      ['客户偏好', '已记录', '促销周'],
    ],
    primary: '本次判断依赖 4 类数据：Campaign 表现、素材疲劳、订单转化、客户促销周偏好。',
    rows: [
      ['Campaign 表现', 'ROAS / CPA / Spend', '广告管理', '已使用'],
      ['素材表现', 'CTR / Frequency', '创意库', '已使用'],
      ['客户偏好', '保留再营销曝光', '品牌信息', '已使用'],
    ],
  },
  skills: {
    eyebrow: 'Luna 配置',
    title: '本周自动检查规则',
    summary: 'Luna 只负责提前发现异常和生成建议，预算生效仍需要优化师确认。',
    metrics: [
      ['预算检查', '每天 10:00', '开启'],
      ['ROAS 扫描', '每天 18:00', '开启'],
      ['素材疲劳', '周三 10:00', '开启'],
      ['客户日报', '每天 19:00', '开启'],
    ],
    primary: '当前规则已覆盖本次异常：ROAS 下滑、预算浪费、素材疲劳和客户日报。',
    rows: [
      ['预算红线检查', '开启', '发现 Prospecting 浪费', '今日已触发'],
      ['素材疲劳检查', '开启', '发现 V12 疲劳', '今日已触发'],
      ['客户偏好记忆', '开启', '促销周保留再营销', '已记录'],
    ],
  },
}

const BusinessModulePage = ({ type }) => {
  const content = MODULE_CONTENT[type] || MODULE_CONTENT.performance

  return (
    <div className="min-h-[100dvh] bg-slate-100 px-4 py-5 text-slate-900 lg:px-6">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.22)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{content.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{content.summary}</p>
          </section>
          <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">当前判断</p>
            <h2 className="mt-2 text-xl font-semibold leading-snug">{content.primary}</h2>
          </section>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {content.metrics.map(([label, value, note]) => (
            <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-slate-950">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.22)]">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-950">业务动作</h2>
            <p className="mt-1 text-sm text-slate-500">围绕美国 ROAS 下滑、预算调整和素材换新推进。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-3">对象</th>
                  <th className="px-5 py-3">状态</th>
                  <th className="px-5 py-3">依据</th>
                  <th className="px-5 py-3">下一步</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {content.rows.map(([name, status, evidence, next]) => (
                  <tr key={`${name}-${status}`} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-medium text-slate-950">{name}</td>
                    <td className="px-5 py-4 text-slate-700">{status}</td>
                    <td className="px-5 py-4 text-slate-600">{evidence}</td>
                    <td className="px-5 py-4 text-slate-600">{next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default BusinessModulePage
