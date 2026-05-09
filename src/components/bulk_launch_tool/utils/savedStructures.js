/**
 * Phase 2.H 任务 1：广告结构模板的保存 / 列表 / 应用 / 删除（localStorage 持久化）。
 *
 * SavedStructure shape:
 *   { id, name, savedAt, channel, campaignType, formData, catalogCombos }
 */

const STORAGE_KEY = 'bulkLaunch_savedStructures';

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[savedStructures] read failed:', err);
    return [];
  }
}
function safeWrite(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch (err) {
    console.warn('[savedStructures] write failed:', err);
    return false;
  }
}

export function listSavedStructures() {
  // 按 savedAt 倒序
  return safeRead().sort((a, b) =>
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

export function saveStructure({ name, channel, campaignType, formData, catalogCombos }) {
  const id = `ss_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item = {
    id,
    name: name?.trim() || '未命名模板',
    savedAt: new Date().toISOString(),
    channel,
    campaignType,
    formData: structuredClone(formData || {}),
    catalogCombos: structuredClone(catalogCombos || []),
  };
  const list = safeRead();
  list.push(item);
  safeWrite(list);
  return item;
}

export function deleteSavedStructure(id) {
  const list = safeRead().filter(it => it.id !== id);
  safeWrite(list);
  return list;
}

/** 应用某个保存的结构，调用各种 setter 一次性回填。 */
export function applySavedStructure(item, { setPlatform, setCampaignType, setFormData, setCatalogCombos, platforms }) {
  if (!item) return;
  // platform 通过 channel 反查
  const platformObj = (platforms || []).find(p => p.id === item.channel);
  if (platformObj && setPlatform) setPlatform(platformObj);
  if (item.campaignType && setCampaignType) setCampaignType(item.campaignType);
  if (item.formData && setFormData) setFormData(item.formData);
  if (item.catalogCombos && setCatalogCombos) setCatalogCombos(item.catalogCombos);
}

/** 相对时间格式（去依赖项目内 date-fns） */
export function formatRelative(iso) {
  const ts = new Date(iso).getTime();
  const diffMs = Date.now() - ts;
  if (diffMs < 60_000) return '刚刚';
  if (diffMs < 3600_000) return `${Math.floor(diffMs / 60_000)} 分钟前`;
  if (diffMs < 86400_000) return `${Math.floor(diffMs / 3600_000)} 小时前`;
  if (diffMs < 7 * 86400_000) return `${Math.floor(diffMs / 86400_000)} 天前`;
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
