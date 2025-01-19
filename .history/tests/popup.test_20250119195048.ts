import { URLParam } from '../src/types';
import { parseURLParams, buildURL } from '../src/utils/url';

describe('URL Parameter Management', () => {
  it('should parse URL parameters correctly', () => {
    const url = 'https://example.com?foo=bar&test=123';
    const params = parseURLParams(url);

    expect(params).toEqual([
      { key: 'foo', value: 'bar', enabled: true },
      { key: 'test', value: '123', enabled: true }
    ]);
  });

  it('should build URL with enabled parameters', () => {
    const baseUrl = 'https://example.com';
    const params: URLParam[] = [
      { key: 'foo', value: 'bar', enabled: true },
      { key: 'test', value: '123', enabled: false },
      { key: 'debug', value: 'true', enabled: true }
    ];

    const result = buildURL(baseUrl, params);
    expect(result).toBe('https://example.com?foo=bar&debug=true');
  });

  it('should handle empty parameters', () => {
    const baseUrl = 'https://example.com';
    const params: URLParam[] = [];

    const result = buildURL(baseUrl, params);
    expect(result).toBe('https://example.com');
  });

  it('should handle URLs with existing parameters', () => {
    const baseUrl = 'https://example.com?existing=value';
    const params: URLParam[] = [
      { key: 'foo', value: 'bar', enabled: true }
    ];

    const result = buildURL(baseUrl, params);
    expect(result).toBe('https://example.com?foo=bar');
  });

  // ... 其他测试
});
