/**
 * Phase 2.O：命名模板的保存 / 列表 / 删除（localStorage 持久化）。
 *
 * NamingTemplate shape:
 *   { id, name, channel, level, template, savedAt }
 *   - name: 用户起的模板别名（展示在历史下拉）
 *   - channel: 'meta' | 'tiktok'
 *   - level: 'campaign' | 'adset' | 'ad'
 *   - template: 含 `{token}` 字面量的命名规则字符串
 */

const STORAGE_KEY = 'bulkLaunch_savedNamingTemplates';

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[savedNamingTemplates] read failed:', err);
    return [];
  }
}
function safeWrite(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch (err) {
    console.warn('[savedNamingTemplates] write failed:', err);
    return false;
  }
}

/** 列出指定 (channel, level) 下保存的命名模板；缺省过滤条件时返回全部。按 savedAt 倒序。 */
export function listNamingTemplates(channel, level) {
  return safeRead()
    .filter(it => (!channel || it.channel === channel) && (!level || it.level === level))
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

export function saveNamingTemplate({ name, channel, level, template }) {
  const id = `nt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item = {
    id,
    name: (name && name.trim()) || '未命名模板',
    channel,
    level,
    template: template || '',
    savedAt: new Date().toISOString(),
  };
  const list = safeRead();
  list.push(item);
  safeWrite(list);
  return item;
}

export function deleteNamingTemplate(id) {
  const list = safeRead().filter(it => it.id !== id);
  safeWrite(list);
  return list;
}
