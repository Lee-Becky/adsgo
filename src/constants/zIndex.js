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

// 全局弹窗层级计数器
let modalCounter = 0;

export const getNextModalZIndex = () => {
  modalCounter += 1;
  return Z_INDEX.MODAL_BASE + modalCounter * 10;
};

export const resetModalCounter = () => {
  modalCounter = 0;
};
