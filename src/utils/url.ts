import type { URLParam } from '../types';

/**
 * 解析 URL 参数
 * @param url URL 字符串
 * @returns URLParam 数组
 */
export function parseURLParams(url: string): URLParam[] {
  const searchParams = new URL(url).searchParams;
  const params: URLParam[] = [];

  searchParams.forEach((value, key) => {
    params.push({
      key,
      value,
      enabled: true
    });
  });

  return params;
}

/**
 * 构建新的 URL
 * @param baseUrl 基础 URL
 * @param params 参数数组
 * @returns 完整的 URL 字符串
 */
export function buildURL(baseUrl: string, params: URLParam[]): string {
  const url = new URL(baseUrl);
  url.search = '';

  // 获取启用的参数
  const enabledParams = params.filter((param) => param.enabled);

  // 如果没有参数，返回不带斜杠的基础 URL
  if (enabledParams.length === 0) {
    return url.origin + url.pathname.replace(/\/$/, '');
  }

  // 添加参数
  enabledParams.forEach((param) => {
    url.searchParams.append(param.key, param.value);
  });

  // 返回格式化的 URL，移除多余的斜杠
  return url
    .toString()
    .replace(/\/?(\?|$)/, '$1') // 移除问号前的斜杠
    .replace(/\/$/, ''); // 移除末尾的斜杠
}
