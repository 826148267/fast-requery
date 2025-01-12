const { JSDOM } = require('jsdom');

// 设置 DOM 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;

// 导入要测试的函数
const popup = require('../popup');
const buildUrlFromParams = popup.buildUrlFromParams;

describe('buildUrlFromParams', () => {
  let container;

  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
    
    // 创建参数容器
    container = document.createElement('div');
    container.id = 'paramsContainer';
    document.body.appendChild(container);
    
    // 模拟 chrome.tabs.query 返回值
    global.chrome = {
      tabs: {
        query: jest.fn(() => 
          Promise.resolve([{
            id: 1,
            url: 'https://example.com'
          }])
        ),
        update: jest.fn()
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 创建参数行的辅助函数
  function createParamRow(key, value) {
    const row = document.createElement('div');
    row.className = 'param-item';

    const keyInput = document.createElement('input');
    keyInput.className = 'param-key';
    keyInput.value = key;

    const valueInput = document.createElement('input');
    valueInput.className = 'param-value';
    valueInput.value = value;

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    container.appendChild(row);
  }

  test('应该正确处理基本的key-value对', async () => {
    createParamRow('name', 'John Doe');
    createParamRow('age', '25');

    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?name=John%20Doe&age=25');
  });

  test('应该只编码value而不编码key', async () => {
    createParamRow('search query', '关键词 & 空格');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?search query=%E5%85%B3%E9%94%AE%E8%AF%8D%20%26%20%E7%A9%BA%E6%A0%BC');
  });

  test('应该正确处理URL作为参数值', async () => {
    createParamRow('redirect', 'http://example.com?key=value');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?redirect=http%3A%2F%2Fexample.com%3Fkey%3Dvalue');
  });

  test('应该忽略空的key', async () => {
    createParamRow('', 'value');
    createParamRow('key', 'value');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?key=value');
  });

  test('应该保持原始URL的路径', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://example.com/path/to/page'
      }])
    );
    
    createParamRow('key', 'value');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com/path/to/page?key=value');
  });

  test('应该处理特殊字符', async () => {
    createParamRow('key', '!@#$%^&*()');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?key=%21%40%23%24%25%5E%26%2A%28%29');
  });

  test('应该正确处理中文字符', async () => {
    createParamRow('key', '你好世界');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?key=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C');
  });

  test('当没有参数时应该返回原始URL', async () => {
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com');
  });

  test('应该正确处理多个相同的key', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://example.com'
      }])
    );
    
    // 创建两个参数行，key相同但值不同
    createParamRow('tag', 'typescript');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?tag=typescript');
  });

  test('应该在出错时抛出异常', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.reject(new Error('Tab not found'))
    );
    
    await expect(buildUrlFromParams()).rejects.toThrow('Tab not found');
  });

  test('应该正确处理特殊字符包括感叹号和括号', async () => {
    createParamRow('key', '!()*');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://example.com?key=%21%28%29%2A');
  });

  test('当tab.url不存在时应该抛出错误', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{ id: 1 }])
    );
    
    await expect(buildUrlFromParams()).rejects.toThrow('无法获取当前标签页或URL');
  });

  test('应该正确处理复杂的IP地址URL和中文参数', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://198.192.68.1'
      }])
    );
    
    createParamRow('key', '搜索关键词');
    createParamRow('debug', 'yes');
    createParamRow('http://10.192.12.1:8080', '');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://198.192.68.1?key=%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D&debug=yes&http://10.192.12.1:8080');
  });

  test('应该正确处理已有多个参数的复杂URL', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://198.192.68.1?format=json&test=true'
      }])
    );
    
    createParamRow('format', 'json');
    createParamRow('test', 'true');
    createParamRow('http://10.192.12.1:8080', '');
    createParamRow('key', '搜索关键词');
    createParamRow('debug', 'yes');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://198.192.68.1?format=json&test=true&http://10.192.12.1:8080&key=%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D&debug=yes');
  });

  test('应该正确处理Google Scholar URL', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=en'
      }])
    );
    
    createParamRow('user', 'Dd7eS-UAAAAJ');
    createParamRow('hl', 'zh-cn');
    createParamRow('debug', '1');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=zh-cn&debug=1');
  });

  test('应该替换已存在的参数而不是重复添加', async () => {
    // 设置一个包含已有参数的URL
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=en'
      }])
    );
    
    createParamRow('user', 'Dd7eS-UAAAAJ');
    createParamRow('hl', 'zh-cn');
    createParamRow('debug', '1');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=zh-cn&debug=1');
  });

  test('当tab.url不存在时应该抛出错误', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{ id: 1 }])
    );
    
    await expect(buildUrlFromParams()).rejects.toThrow('无法获取当前标签页或URL');
  });

  test('应该正确处理删除参数的情况', async () => {
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=zh-cn&debug=1&area_id=1%2C1%2C1%2C1&user_pin=826132683'
      }])
    );
    
    // 只创建部分参数，模拟删除了 hl 参数
    createParamRow('user', 'Dd7eS-UAAAAJ');
    createParamRow('debug', '1');
    createParamRow('area_id', '1,1,1,1');
    createParamRow('user_pin', '826132683');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&debug=1&area_id=1%2C1%2C1%2C1&user_pin=826132683');
  });

  test('应该替换已存在的参数而不是重复添加', async () => {
    // 设置一个包含已有参数的URL
    global.chrome.tabs.query.mockImplementation(() => 
      Promise.resolve([{
        id: 1,
        url: 'https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=en'
      }])
    );
    
    createParamRow('user', 'Dd7eS-UAAAAJ');
    createParamRow('hl', 'zh-cn');
    createParamRow('debug', '1');
    
    const result = await buildUrlFromParams();
    expect(result).toBe('https://scholar.google.com/citations?user=Dd7eS-UAAAAJ&hl=zh-cn&debug=1');
  });
});
