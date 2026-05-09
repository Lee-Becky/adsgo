import React, { useMemo } from 'react';
import StructureSectionShell from './StructureSectionShell';
import LevelFieldsEditor from './LevelFieldsEditor';
import { getCoreFieldDefs, evaluateDependsOn } from '../fieldDefinitions';

const AdSetSection = ({ channel, rootFormData, onFieldChange }) => {
  const disabled = !channel;
  const channelLabel = channel === 'meta' ? 'Meta v21' : channel === 'tiktok' ? 'TikTok v1.3' : '—';
  const title = channel === 'tiktok' ? 'Ad Group（广告组）' : 'Ad Set（广告组）';
  const formData = rootFormData?.adset || {};

  const visibleCore = useMemo(() => {
    if (!channel) return [];
    return getCoreFieldDefs(channel, 'adset', rootFormData)
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
      stepNumber={2}
      iconType="adset"
      accentColor="violet"
      title={title}
      subtitle="定向 / 优化目标 / 出价 / 排期 / 版位"
      badge={channelLabel}
      progress={progress}
      disabled={disabled}
    >
      <LevelFieldsEditor
        channel={channel}
        level="adset"
        formData={formData}
        rootFormData={rootFormData}
        onFieldChange={onFieldChange}
        showAdvanced
      />
    </StructureSectionShell>
  );
};

export default AdSetSection;
