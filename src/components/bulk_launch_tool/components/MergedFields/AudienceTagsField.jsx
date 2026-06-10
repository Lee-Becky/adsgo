import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import MultiSelect from '../controls/MultiSelect';
import {
  META_INTERESTS, META_BEHAVIORS,
  TIKTOK_INTEREST_KEYWORDS, TIKTOK_INTEREST_CATEGORIES,
} from '../../services/platformResources';

/**
 * 受众标签合并：单一搜索 + chip，跨多个 SDK 字段（按维度自动分流）。
 *
 * Meta：合并 interests / behaviors / family_statuses / life_events /
 *       industries / education_statuses / income / relationship_statuses
 * TikTok：合并 interest_keyword_ids / interest_category_ids
 *
 * Props:
 *  - channel: 'meta' | 'tiktok'
 *  - levelFormData: 当前 level formData
 *  - setField: (name, value) => void
 */
const AudienceTagsField = ({ channel, levelFormData, setField, helpText }) => {
  // Meta：合成多个独立字段的所有选项
  if (channel === 'meta') {
    const META_FAMILY = [
      { value: 1, label: '父母（全部）' }, { value: 2, label: '父母（学龄前）' },
      { value: 3, label: '父母（小学）' }, { value: 4, label: '父母（中学）' },
      { value: 5, label: '已婚' },         { value: 6, label: '订婚' },
    ];
    const META_LIFE = [
      { value: 'le_1', label: '即将搬家' },     { value: 'le_2', label: '新工作' },
      { value: 'le_3', label: '新婚' },         { value: 'le_4', label: '即将生日（≤30 天）' },
      { value: 'le_5', label: '订婚（≤6 月）' }, { value: 'le_6', label: '远离家人' },
    ];
    const META_IND = [
      { value: 'ind_1', label: '科技 / IT' }, { value: 'ind_2', label: '金融 / 保险' },
      { value: 'ind_3', label: '医疗 / 制药' }, { value: 'ind_4', label: '教育' },
      { value: 'ind_5', label: '零售 / 电商' }, { value: 'ind_6', label: '媒体 / 广告' },
    ];
    const META_EDU = [
      { value: 1, label: '高中' }, { value: 2, label: '本科在读' }, { value: 3, label: '已毕业' },
      { value: 9, label: '硕士' }, { value: 11, label: '博士' },
    ];
    const META_INCOME = [
      { value: 'inc_top10', label: '前 10%' }, { value: 'inc_top25', label: '前 11-25%' },
      { value: 'inc_top50', label: '前 26-50%' },
    ];
    const META_REL = [
      { value: 1, label: '单身' }, { value: 2, label: '恋爱中' }, { value: 3, label: '已婚' },
      { value: 4, label: '订婚' }, { value: 11, label: '分居' }, { value: 12, label: '离婚' },
      { value: 13, label: '丧偶' },
    ];

    const allOptions = useMemo(() => [
      ...META_INTERESTS.map(o => ({ value: `int:${o.value}`,  label: `🎯 [兴趣] ${o.label}`, _dim: 'interests' })),
      ...META_BEHAVIORS.map(o => ({ value: `beh:${o.value}`,  label: `🛒 [行为] ${o.label}`, _dim: 'behaviors' })),
      ...META_FAMILY.map(o =>    ({ value: `fam:${o.value}`,  label: `👨‍👩‍👧 [家庭] ${o.label}`, _dim: 'family_statuses' })),
      ...META_LIFE.map(o =>      ({ value: `life:${o.value}`, label: `🎂 [人生事件] ${o.label}`, _dim: 'life_events' })),
      ...META_IND.map(o =>       ({ value: `ind:${o.value}`,  label: `🏢 [行业] ${o.label}`, _dim: 'industries' })),
      ...META_EDU.map(o =>       ({ value: `edu:${o.value}`,  label: `🎓 [学历] ${o.label}`, _dim: 'education_statuses' })),
      ...META_INCOME.map(o =>    ({ value: `inc:${o.value}`,  label: `💰 [收入] ${o.label}`, _dim: 'income' })),
      ...META_REL.map(o =>       ({ value: `rel:${o.value}`,  label: `💞 [感情] ${o.label}`, _dim: 'relationship_statuses' })),
    ], []);

    const selected = useMemo(() => {
      const out = [];
      (levelFormData?.interests          || []).forEach(v => out.push(`int:${v}`));
      (levelFormData?.behaviors          || []).forEach(v => out.push(`beh:${v}`));
      (levelFormData?.family_statuses    || []).forEach(v => out.push(`fam:${v}`));
      (levelFormData?.life_events        || []).forEach(v => out.push(`life:${v}`));
      (levelFormData?.industries         || []).forEach(v => out.push(`ind:${v}`));
      (levelFormData?.education_statuses || []).forEach(v => out.push(`edu:${v}`));
      (levelFormData?.income             || []).forEach(v => out.push(`inc:${v}`));
      (levelFormData?.relationship_statuses || []).forEach(v => out.push(`rel:${v}`));
      return out;
    }, [levelFormData]);

    const handleChange = (nextKeys) => {
      const buckets = {
        interests: [], behaviors: [], family_statuses: [], life_events: [],
        industries: [], education_statuses: [], income: [], relationship_statuses: [],
      };
      nextKeys.forEach(key => {
        const [prefix, ...rest] = String(key).split(':');
        const v = rest.join(':');
        const map = {
          int: 'interests', beh: 'behaviors', fam: 'family_statuses', life: 'life_events',
          ind: 'industries', edu: 'education_statuses', inc: 'income', rel: 'relationship_statuses',
        };
        const dim = map[prefix];
        if (dim) {
          // 保留原值类型（数字 vs 字符串）
          const orig = allOptions.find(o => o.value === key);
          // value 中数字保持数字
          const opts = orig?.label || '';
          // 简化：用类型推断
          const num = Number(v);
          buckets[dim].push(Number.isFinite(num) && String(num) === v ? num : v);
        }
      });
      Object.entries(buckets).forEach(([dim, vals]) => setField(dim, vals));
    };

    const dimColor = {
      interests: 'sky', behaviors: 'amber', family_statuses: 'pink',
      life_events: 'rose', industries: 'indigo', education_statuses: 'emerald',
      income: 'violet', relationship_statuses: 'primary',
    };
    const chipColorByOption = (opt) => dimColor[opt._dim] || 'primary';

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-gray-700">受众标签</label>
          <span title="跨兴趣 / 行为 / 家庭 / 人生事件 / 行业 / 学历 / 收入 / 感情，统一搜索选择。每条按维度分类自动写入对应字段。"
            className="text-gray-300 cursor-help"><Info size={11} /></span>
        </div>
        <MultiSelect
          value={selected}
          onChange={handleChange}
          options={allOptions}
          placeholder="搜索兴趣 / 行为 / 家庭 / 学历 / 收入 ..."
          chipColorByOption={chipColorByOption}
        />
        <span className="text-[10px] text-gray-300 font-mono truncate">
          interests · behaviors · family_statuses · life_events · industries · education_statuses · income · relationship_statuses
        </span>
      </div>
    );
  }

  // TikTok：合并 interest_keyword_ids + interest_category_ids
  const allOptions = useMemo(() => [
    ...TIKTOK_INTEREST_KEYWORDS.map(o => ({ value: `kw:${o.value}`, label: `🔑 [关键词] ${o.label}`, _dim: 'interest_keyword_ids' })),
    ...TIKTOK_INTEREST_CATEGORIES.map(o => ({ value: `cat:${o.value}`, label: `🗂️ [类别] ${o.label}`, _dim: 'interest_category_ids' })),
  ], []);

  const selected = useMemo(() => {
    const out = [];
    (levelFormData?.interest_keyword_ids  || []).forEach(v => out.push(`kw:${v}`));
    (levelFormData?.interest_category_ids || []).forEach(v => out.push(`cat:${v}`));
    return out;
  }, [levelFormData]);

  const handleChange = (nextKeys) => {
    const buckets = { interest_keyword_ids: [], interest_category_ids: [] };
    nextKeys.forEach(key => {
      const [prefix, ...rest] = String(key).split(':');
      const v = rest.join(':');
      if (prefix === 'kw')  buckets.interest_keyword_ids.push(v);
      if (prefix === 'cat') buckets.interest_category_ids.push(v);
    });
    setField('interest_keyword_ids',  buckets.interest_keyword_ids);
    setField('interest_category_ids', buckets.interest_category_ids);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-gray-700">兴趣定向</label>
        <span title="合并兴趣关键词与兴趣类别两个维度。" className="text-gray-300 cursor-help"><Info size={11} /></span>
      </div>
      <MultiSelect
        value={selected}
        onChange={handleChange}
        options={allOptions}
        placeholder="搜索兴趣关键词 / 类别 ..."
      />
      <span className="text-[10px] text-gray-300 font-mono truncate">interest_keyword_ids · interest_category_ids</span>
    </div>
  );
};

export default AudienceTagsField;
