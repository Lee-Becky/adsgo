export const Z_INDEX = {
  BASE: 0,
  CONTENT: 1,
  DROPDOWN: 100,
  STICKY: 200,
  HEADER: 500,
  SIDEBAR: 600,
  OVERLAY: 1000,
  MODAL_BASE: 2000,
  NOTIFICATION: 9999
};

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
