import React from 'react';
import GroupedFieldsRenderer from './GroupedFieldsRenderer';
import BudgetField from './MergedFields/BudgetField';
import GeoLocationField from './MergedFields/GeoLocationField';
import AgeRangeField from './MergedFields/AgeRangeField';
import AudienceTagsField from './MergedFields/AudienceTagsField';
import AppListField from './MergedFields/AppListField';
import { getFieldDefs, validateField } from '../fieldDefinitions';

/**
 * Phase 2.K：层字段编辑器 — 改为分组卡片渲染（GroupedFieldsRenderer）。
 * 每个 group 独立卡片：基础 / 受众 / 版位 / 出价 / 预算 / 排期 / CTA / 创意 / 跟踪 / 高级。
 * 合并控件按 group 分配 slot（BudgetField → budget；地区/年龄/受众标签/App → audience）。
 *
 * Props 不变：channel / level / formData / rootFormData / onFieldChange / inheritanceMap / onResetField
 */
const LevelFieldsEditor = ({
  channel, level, formData, rootFormData,
  onFieldChange,
  inheritanceMap, onResetField,
  // showAdvanced 已无作用（advanced 现在是普通 group，由 GroupedFieldsRenderer 折叠控制）
  // 保留 prop 以兼容旧调用方
  showAdvanced,  // eslint-disable-line no-unused-vars
  // 窄面板模式（架构树右侧详情面板）：单列 + 标签头换行 + 隐藏 SDK path
  compact = false,
  // 架构图 ad 详情面板：把 excludeFromCreate（文案 / CTA / 落地页 / image_hash / video_id 等）也展示
  showAllFields = false,
}) => {
  if (!channel) {
    return <p className="text-xs text-gray-400 py-4">请先在页面顶部选择投放渠道。</p>;
  }

  // 字段集 = 全部 schema 字段（含 advanced），过滤 hideInUi
  const allDefs = getFieldDefs(channel, level, { showExcluded: showAllFields }).filter(d => !d.hideInUi);

  // 合并控件 slot 分配
  const mergedSlots = {};

  // BudgetField → budget group（仅 campaign / adset；ad 层无预算概念）
  if (level === 'campaign' || level === 'adset') {
    mergedSlots.budget = (
      <BudgetField
        channel={channel}
        level={level}
        value={formData}
        onSetField={(name, v) => onFieldChange?.(name, v)}
        required={false}
      />
    );
  }

  // AdSet 专属合并控件 → audience group
  if (level === 'adset') {
    const showAgeRange = channel === 'meta';
    const ageMinErr = showAgeRange ? validateField(
      { name: 'age_min', label: '最小年龄', validation: { min: 13, max: 65 } },
      formData?.age_min, formData, rootFormData) : null;
    const ageMaxErr = showAgeRange ? validateField(
      { name: 'age_max', label: '最大年龄', validation: { min: 13, max: 65, custom: (v, root) => {
        const min = root?.adset?.age_min;
        if (typeof v === 'number' && typeof min === 'number' && v < min) return '最大年龄不能小于最小年龄';
        return null;
      } } }, formData?.age_max, formData, rootFormData) : null;

    const destType = formData?.destination_type;
    const objectiveType = rootFormData?.campaign?.objective_type;
    const showAppList = (channel === 'meta' && destType === 'APP')
      || (channel === 'tiktok' && objectiveType === 'APP_PROMOTION');

    mergedSlots.audience = [
      <GeoLocationField
        key="location"
        channel={channel}
        includeValue={channel === 'meta' ? formData?.geo_locations : formData?.location_ids}
        excludeValue={channel === 'meta' ? formData?.excluded_geo_locations : null}
        onChangeInclude={(v) => onFieldChange?.(channel === 'meta' ? 'geo_locations' : 'location_ids', v)}
        onChangeExclude={(v) => channel === 'meta' && onFieldChange?.('excluded_geo_locations', v)}
        required
      />,
      showAgeRange && (
        <AgeRangeField
          key="age"
          ageMin={formData?.age_min}
          ageMax={formData?.age_max}
          onChangeMin={(v) => onFieldChange?.('age_min', v)}
          onChangeMax={(v) => onFieldChange?.('age_max', v)}
          errorMin={ageMinErr}
          errorMax={ageMaxErr}
        />
      ),
      <AudienceTagsField
        key="tags"
        channel={channel}
        levelFormData={formData}
        setField={(name, value) => onFieldChange?.(name, value)}
      />,
      showAppList && (
        <AppListField
          key="apps"
          channel={channel}
          value={formData?._app_list}
          onChange={(v) => onFieldChange?.('_app_list', v)}
          required
        />
      ),
    ].filter(Boolean);
  }

  return (
    <GroupedFieldsRenderer
      channel={channel}
      level={level}
      defs={allDefs}
      formData={formData}
      rootFormData={rootFormData}
      onFieldChange={onFieldChange}
      inheritanceMap={inheritanceMap}
      onResetField={onResetField}
      mergedSlots={mergedSlots}
      compact={compact}
    />
  );
};

export default LevelFieldsEditor;
