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

  params
    .filter((param) => param.enabled)
    .forEach((param) => {
      url.searchParams.append(param.key, param.value);
    });

  return url.toString();
}
