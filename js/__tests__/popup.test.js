describe('URL Parameters Manager', () => {
  // 模拟 chrome API
  global.chrome = {
    tabs: {
      query: jest.fn().mockResolvedValue([{
        id: 1,
        url: 'https://example.com/page?old=param'
      }]),
      update: jest.fn()
    },
    storage: {
      local: {
        get: jest.fn().mockResolvedValue({ presets: {} }),
        set: jest.fn()
      }
    }
  };

  // 模拟 i18n
  global.window.i18n = {
    t: jest.fn(key => key)
  };

  beforeEach(() => {
    // 重置 DOM
    document.body.innerHTML = `
      <div id="currentUrl"></div>
      <div id="paramsContainer"></div>
      <div id="presetsList"></div>
    `;
    
    // 重置所有模拟函数
    jest.clearAllMocks();
  });

  describe('addParamRow', () => {
    it('should create a new parameter row with given key and value', () => {
      const { addParamRow } = require('../popup');
      addParamRow('test', 'value');

      const container = document.getElementById('paramsContainer');
      const row = container.querySelector('.param-item');
      
      expect(row).toBeTruthy();
      expect(row.querySelector('.param-key').value).toBe('test');
      expect(row.querySelector('.param-value').value).toBe('value');
    });

    it('should add delete button that removes the row', () => {
      const { addParamRow } = require('../popup');
      addParamRow('test', 'value');

      const deleteBtn = document.querySelector('.btn');
      deleteBtn.click();

      expect(document.querySelector('.param-item')).toBeNull();
    });
  });

  describe('buildUrlFromParams', () => {
    it('should build URL with current parameters', async () => {
      const { buildUrlFromParams } = require('../popup');
      
      // 模拟当前标签页
      chrome.tabs.query.mockResolvedValue([{
        url: 'https://example.com/page'
      }]);

      // 添加一些参数
      document.getElementById('paramsContainer').innerHTML = `
        <div class="param-item">
          <input class="param-key" value="test">
          <input class="param-value" value="123">
        </div>
      `;

      const result = await buildUrlFromParams();
      expect(result).toBe('https://example.com/page?test=123');
    });
  });

  describe('saveCurrentAsPreset', () => {
    it('should save current parameters as preset', async () => {
      const { saveCurrentAsPreset } = require('../popup');

      // 模拟用户输入预设名称
      global.prompt = jest.fn().mockReturnValue('testPreset');

      // 添加一些参数
      document.getElementById('paramsContainer').innerHTML = `
        <div class="param-item">
          <input class="param-key" value="test">
          <input class="param-value" value="123">
        </div>
      `;

      // 模拟存储
      chrome.storage.local.get.mockResolvedValue({ presets: {} });
      
      await saveCurrentAsPreset();

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        presets: {
          testPreset: { test: '123' }
        }
      });
    });
  });

  describe('loadPresets', () => {
    it('should load and display saved presets', async () => {
      const { loadPresets } = require('../popup');

      // 模拟已保存的预设
      chrome.storage.local.get.mockResolvedValue({
        presets: {
          testPreset: { test: '123' }
        }
      });

      await loadPresets();

      const presetsList = document.getElementById('presetsList');
      expect(presetsList.children.length).toBe(1);
      expect(presetsList.querySelector('span').textContent).toBe('testPreset');
    });
  });

  describe('deletePreset', () => {
    it('should delete preset after confirmation', async () => {
      const { deletePreset } = require('../popup');

      // 模拟用户确认
      global.confirm = jest.fn().mockReturnValue(true);

      // 模拟存储
      chrome.storage.local.get.mockResolvedValue({
        presets: {
          testPreset: { test: '123' }
        }
      });

      await deletePreset('testPreset');

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        presets: {}
      });
    });
  });
}); 