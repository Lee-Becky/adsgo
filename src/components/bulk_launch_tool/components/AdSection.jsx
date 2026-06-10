import React, { useMemo } from 'react';
import StructureSectionShell from './StructureSectionShell';
import LevelFieldsEditor from './LevelFieldsEditor';
import { getCoreFieldDefs, evaluateDependsOn } from '../fieldDefinitions';

const AdSection = ({ channel, rootFormData, onFieldChange }) => {
  const disabled = !channel;
  const channelLabel = channel === 'meta' ? 'Meta v21' : channel === 'tiktok' ? 'TikTok v1.3' : '—';
  const formData = rootFormData?.ad || {};

  const visibleCore = useMemo(() => {
    if (!channel) return [];
    return getCoreFieldDefs(channel, 'ad', rootFormData)
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
      stepNumber={3}
      iconType="ad"
      accentColor="emerald"
      title="Ad（广告）"
      subtitle="创意素材 / 文案标题 / 行动号召 / 落地页"
      badge={channelLabel}
      progress={progress}
      disabled={disabled}
    >
      <LevelFieldsEditor
        channel={channel}
        level="ad"
        formData={formData}
        rootFormData={rootFormData}
        onFieldChange={onFieldChange}
        showAdvanced
      />
    </StructureSectionShell>
  );
};

export default AdSection;
