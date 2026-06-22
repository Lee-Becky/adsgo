/**
 * Phase 2.K：字段分组的中央元数据。
 * 由 GroupedFieldsRenderer 消费，决定每个 group 的渲染顺序、图标、颜色、默认折叠态。
 *
 * 旧的 'targeting' 别名兼容：getFieldDefs 派生时会把 group='targeting' 映射为 'audience'。
 */
import {
  Layers, Users, MapPin, DollarSign, Calendar, Activity, Image as ImageIcon,
  Settings2, MousePointerClick, Target, Handshake,
} from 'lucide-react';

// 静态 accent 配色字典（避免 Tailwind purge 时 dynamic class 丢失）
export const ACCENT = {
  primary: { bg: 'bg-primary-50',  text: 'text-primary-600', dot: 'bg-primary-500' },
  violet:  { bg: 'bg-violet-50',   text: 'text-violet-600',  dot: 'bg-violet-500'  },
  sky:     { bg: 'bg-sky-50',      text: 'text-sky-600',     dot: 'bg-sky-500'     },
  amber:   { bg: 'bg-amber-50',    text: 'text-amber-600',   dot: 'bg-amber-500'   },
  emerald: { bg: 'bg-success-50',  text: 'text-success-600', dot: 'bg-success-500' },
  rose:    { bg: 'bg-rose-50',     text: 'text-rose-600',    dot: 'bg-rose-500'    },
  orange:  { bg: 'bg-orange-50',   text: 'text-orange-600',  dot: 'bg-orange-500'  },
  fuchsia: { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-600', dot: 'bg-fuchsia-500' },
  cyan:    { bg: 'bg-cyan-50',     text: 'text-cyan-600',    dot: 'bg-cyan-500'    },
  slate:   { bg: 'bg-neutral-50',    text: 'text-neutral-600',   dot: 'bg-neutral-500'   },
};

/**
 * GROUP_META: { [groupName]: { label, icon, accent, defaultOpen, desc, order } }
 * order：渲染顺序；缺省 = 99
 */
export const GROUP_META = {
  basic:     { label: '基础信息',   icon: Layers,            accent: 'primary',  defaultOpen: true,  desc: '名称 / 推广目标 / 转化场景',                       order: 1  },
  audience:  { label: '受众定向',   icon: Users,             accent: 'violet',   defaultOpen: false, desc: '地区 / 年龄 / 兴趣 / 自定义受众',                  order: 2  },
  placement: { label: '版位投放',   icon: MapPin,            accent: 'sky',      defaultOpen: false, desc: 'Facebook / Instagram / Audience Network',         order: 3  },
  bidding:   { label: '出价竞价',   icon: Target,            accent: 'amber',    defaultOpen: false, desc: '出价策略 / 出价金额 / 计费事件',                   order: 4  },
  budget:    { label: '预算',       icon: DollarSign,        accent: 'emerald',  defaultOpen: false, desc: '日预算 / 总预算 / 累计上限',                       order: 5  },
  schedule:  { label: '排期',       icon: Calendar,          accent: 'rose',     defaultOpen: false, desc: '开始 / 结束时间 / 分时段投放',                     order: 6  },
  cta:       { label: '行动号召',   icon: MousePointerClick, accent: 'orange',   defaultOpen: false, desc: '按钮文案 / 跳转链接 / 联系方式',                   order: 7  },
  creative:  { label: '创意素材',   icon: ImageIcon,         accent: 'fuchsia',  defaultOpen: false, desc: '图片 / 视频 / 标题 / 正文 / 创意规格',             order: 8  },
  branded_content: { label: '合创广告', icon: Handshake,       accent: 'orange',   defaultOpen: false, desc: 'Branded Content / Collab Ads — 与创作者合作授权', order: 9  },
  tracking:  { label: '跟踪与归因', icon: Activity,          accent: 'cyan',     defaultOpen: false, desc: '转化域名 / UTM / 像素事件',                        order: 10 },
  advanced:  { label: '高级设置',   icon: Settings2,         accent: 'slate',    defaultOpen: false, desc: '不常用 / 实验性参数',                              order: 11 },
};

/** 取得某 group 的元数据，未定义时给个合理 fallback */
export function getGroupMeta(name) {
  return GROUP_META[name] || {
    label: name || '其它',
    icon: Layers,
    accent: 'slate',
    defaultOpen: false,
    desc: '',
    order: 99,
  };
}
