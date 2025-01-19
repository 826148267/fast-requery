import { parseURLParams, buildURL } from '../src/utils/url';
import { URLParam } from '../src/types';

describe('URL Parameter Management', () => {
  it('should parse URL parameters correctly', () => {
    const url = 'https://example.com?foo=bar&test=123';
    const params = parseURLParams(url);
    
    expect(params).toEqual([
      { key: 'foo', value: 'bar', enabled: true },
      { key: 'test', value: '123', enabled: true }
    ]);
  });
  
  // ... 其他测试
}); 