/**
 * 获取当前语言
 */
export function getCurrentLanguage(): string {
  return chrome.i18n.getUILanguage();
}

/**
 * 获取翻译文本
 */
export function getMessage(messageName: string, substitutions?: string | string[]): string {
  return chrome.i18n.getMessage(messageName, substitutions);
}

/**
 * 初始化国际化
 */
export function initI18n(): void {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = getMessage(key);
    }
  });
}
