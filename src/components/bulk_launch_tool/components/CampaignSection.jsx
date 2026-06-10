import React, { useMemo } from 'react';
import StructureSectionShell from './StructureSectionShell';
import LevelFieldsEditor from './LevelFieldsEditor';
import { getCoreFieldDefs, evaluateDependsOn } from '../fieldDefinitions';

const CampaignSection = ({ channel, rootFormData, onFieldChange }) => {
  const disabled = !channel;
  const channelLabel = channel === 'meta' ? 'Meta v21' : channel === 'tiktok' ? 'TikTok v1.3' : '—';
  const formData = rootFormData?.campaign || {};

  // 进度计算：核心字段已填多少
  const visibleCore = useMemo(() => {
    if (!channel) return [];
    return getCoreFieldDefs(channel, 'campaign', rootFormData)
      .filter(d => !d.hideInUi)
      .filter(d => evaluateDependsOn(d, formData, rootFormData));
  }, [channel, rootFormData, formData]);
  const filledCount = useMemo(() => visibleCore.filter(d => {
    const v = formData[d.name];
    return !(v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0));
  }).length, [visibleCore, formData]);
  const progress = visibleCore.length > 0 ? `已填 ${filledCount}/${visibleCore.length} 核心` : null;

  return (
    <StructureSectionShell
      stepNumber={1}
      iconType="campaign"
      accentColor="primary"
      title="Campaign（系列）"
      subtitle="推广目标 / 系列预算 / 出价策略"
      badge={channelLabel}
      progress={progress}
      disabled={disabled}
    >
      <LevelFieldsEditor
        channel={channel}
        level="campaign"
        formData={formData}
        rootFormData={rootFormData}
        onFieldChange={onFieldChange}
        showAdvanced
      />
    </StructureSectionShell>
  );
};

export default CampaignSection;
