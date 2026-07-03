export const Z_INDEX = {
  BASE: 0,
  CONTENT: 1,
  DROPDOWN_LEGACY: 100,    // 旧 inline dropdown 层级（保留用于向后兼容）
  STICKY: 200,
  HEADER: 500,
  SIDEBAR: 600,
  FLOATING_ACTION: 700,    // 右下角悬浮按钮（探索 / 聊天）
  GLOBAL_LUNA_BAR: 550,    // 全局 Luna 建议条（高于 Header 500）
  OVERLAY: 1000,
  POPOVER: 1500,           // 用户实时交互的 dropdown / popover / menu，永远高于 FLOATING_ACTION
  MODAL_BASE: 2000,
  NOTIFICATION: 9999
};
// 别名：保留旧 DROPDOWN 名称以避免破坏现有引用
Z_INDEX.DROPDOWN = Z_INDEX.DROPDOWN_LEGACY;

// 全局弹窗层级管理
let currentMaxZIndex = Z_INDEX.MODAL_BASE;

/**
 * 获取下一个最高层级
 * 自动累加，确保新弹窗总是在最上方
 */
export const getNextModalZIndex = () => {
  currentMaxZIndex += 10;
  return currentMaxZIndex;
};

/**
 * 获取当前的最高层级
 */
export const getCurrentMaxZIndex = () => {
  return currentMaxZIndex;
};

/**
 * 重置层级（通常在页面跳转或大组件卸载时使用）
 */
export const resetModalCounter = () => {
  currentMaxZIndex = Z_INDEX.MODAL_BASE;
};

/**
 * 手动更新最大层级（当外部（如第三方组件）出现了更高层级时使用）
 */
export const updateMaxZIndex = (value) => {
  if (value > currentMaxZIndex) {
    currentMaxZIndex = value;
  }
};
