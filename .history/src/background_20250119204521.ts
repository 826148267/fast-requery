// Service Worker for Chrome Extension
chrome.runtime.onInstalled.addListener((): void => {
  // 初始化扩展
  process.stdout.write('Extension installed\n');
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener(
  (
    _tabId: number,
    _changeInfo: chrome.tabs.TabChangeInfo,
    _tab: chrome.tabs.Tab
  ): void => {
    // 处理标签页更新
  }
);

// 监听扩展消息
chrome.runtime.onMessage.addListener(
  (
    _message: unknown,
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: unknown) => void
  ): void => {
    // 处理扩展消息
  }
); 