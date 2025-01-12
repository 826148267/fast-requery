const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

// 设置 DOM 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// 模拟 chrome API
global.chrome = {
  tabs: {
    query: jest.fn()
  }
};

// 模拟 i18n
global.window.i18n = {
  t: jest.fn(key => key)
};

// 模拟 URL API
global.URL = URL;
global.URLSearchParams = URLSearchParams;
