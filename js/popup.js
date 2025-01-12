document.addEventListener('DOMContentLoaded', async function() {
  // 获取当前标签页的URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  
  // 显示当前URL
  document.getElementById('currentUrl').textContent = url.href;
  
  // 直接使用 params 渲染参数列表
  const params = new URLSearchParams(url.search);
  for (const [key, value] of params) {
    addParamRow(key, value);
  }
  
  // 添加参数按钮事件
  document.getElementById('addParam').addEventListener('click', function() {
    addParamRow('', '');
  });
  
  // 应用修改按钮事件
  document.getElementById('applyChanges').addEventListener('click', async function() {
    // 直接使用预览框中的URL
    const newUrl = document.getElementById('currentUrl').textContent;
    await chrome.tabs.update(tab.id, { url: newUrl });
    window.close();
  });
  
  // 保存预设按钮事件
  document.getElementById('savePreset').addEventListener('click', saveCurrentAsPreset);
  
  // 加载预设列表
  loadPresets();
});

function addParamRow(key, value) {
  const container = document.getElementById('paramsContainer');
  const row = document.createElement('div');
  row.className = 'param-item';
  
  // 创建参数名输入框
  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.className = 'param-key';
  keyInput.value = key;
  keyInput.placeholder = window.i18n.t('paramName');
  
  // 添加实时预览
  keyInput.addEventListener('input', updateUrlPreview);
  
  // 创建参数值输入框
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.className = 'param-value';
  valueInput.value = value;
  valueInput.placeholder = window.i18n.t('paramValue');
  
  // 添加实时预览
  valueInput.addEventListener('input', updateUrlPreview);
  
  // 创建删除按钮
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn';
  deleteBtn.setAttribute('data-i18n', 'delete');
  deleteBtn.textContent = window.i18n.t('delete');
  deleteBtn.addEventListener('click', function() {
    row.remove();
    updateUrlPreview();
  });
  
  // 添加所有元素到行容器
  row.appendChild(keyInput);
  row.appendChild(valueInput);
  row.appendChild(deleteBtn);
  
  container.appendChild(row);
}

async function buildUrlFromParams() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      throw new Error('无法获取当前标签页或URL');
    }

    const url = new URL(tab.url);
    // 移除末尾斜杠并保留完整的路径
    const baseUrl = (url.origin + url.pathname).replace(/\/$/, '');
    
    // 使用Map存储参数，值是数组以支持多个相同key
    const paramMap = new Map();
    const newParamKeys = new Set();
    const paramOrder = [];
    
    // 先获取原始URL中的参数，并保持其原始形式
    const searchParams = url.search.substring(1).split('&').filter(Boolean);
    for (const param of searchParams) {
      const [key, value] = param.split('=');
      if (key) {
        paramMap.set(key, value === undefined ? '' : value);
        if (!paramOrder.includes(key)) {
          paramOrder.push(key);
        }
      }
    }
    
    // 获取所有参数输入框中的参数
    const rows = document.querySelectorAll('.param-item');
    rows.forEach(function(row) {
      const keyInput = row.querySelector('.param-key');
      const valueInput = row.querySelector('.param-value');
      
      if (!keyInput || !valueInput) {
        console.warn('参数输入框不完整');
        return;
      }

      const key = keyInput.value.trim();
      const value = valueInput.value.trim();
      
      if (key) {
        // 使用encodeURIComponent确保所有特殊字符都被正确编码
        const encodedValue = encodeURIComponent(value)
          .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
        
        // 如果是新key，添加到顺序列表
        if (!paramOrder.includes(key)) {
          paramOrder.push(key);
        }
        
        paramMap.set(key, encodedValue);
        newParamKeys.add(key);
      }
    });
    
    // 按原始顺序构建参数字符串
    const paramPairs = paramOrder.map(key => {
      const value = paramMap.get(key);
      return value === '' ? key : `${key}=${value}`;
    });
    
    // 如果有参数，添加到URL
    return paramPairs.length > 0 ? `${baseUrl}?${paramPairs.join('&')}` : baseUrl;
  } catch (error) {
    console.error('构建URL时出错:', error);
    throw error;
  }
}

async function saveCurrentAsPreset() {
  try {
    const name = prompt('请输入预设名称：');
    if (!name) return;
    
    const params = {};
    document.querySelectorAll('.param-item').forEach(row => {
      const key = row.querySelector('.param-key').value.trim();
      const value = row.querySelector('.param-value').value.trim();
      if (key) {
        params[key] = value;
      }
    });
    
    const { presets = {} } = await chrome.storage.local.get('presets');
    presets[name] = params;
    await chrome.storage.local.set({ presets });
    
    // 重新加载预设列表
    await loadPresets();
  } catch (error) {
    console.error('保存预设时出错:', error);
  }
}

async function loadPresets() {
  const { presets = {} } = await chrome.storage.local.get('presets');
  const presetsList = document.getElementById('presetsList');
  presetsList.innerHTML = '';
  
  Object.entries(presets).forEach(function([name, params]) {
    const preset = document.createElement('div');
    preset.className = 'preset-item';
    
    // 创建预设名称 span
    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    
    // 创建应用按钮
    const applyBtn = document.createElement('button');
    applyBtn.className = 'btn';
    applyBtn.setAttribute('data-i18n', 'apply');
    applyBtn.textContent = window.i18n.t('apply');
    applyBtn.addEventListener('click', function() {
      applyPreset(name);
    });
    
    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn';
    deleteBtn.setAttribute('data-i18n', 'delete');
    deleteBtn.textContent = window.i18n.t('delete');
    deleteBtn.addEventListener('click', function() {
      deletePreset(name);
    });
    
    // 添加所有元素到预设容器
    preset.appendChild(nameSpan);
    preset.appendChild(applyBtn);
    preset.appendChild(deleteBtn);
    
    presetsList.appendChild(preset);
  });
}

async function applyPreset(name) {
  try {
    const { presets = {} } = await chrome.storage.local.get('presets');
    const preset = presets[name];
    if (!preset) {
      console.error('预设不存在:', name);
      return;
    }

    // 获取现有的参数键值对
    const existingParams = new Map();
    document.querySelectorAll('.param-item').forEach(function(row) {
      const keyInput = row.querySelector('.param-key');
      const valueInput = row.querySelector('.param-value');
      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (key) {
          existingParams.set(key, value);
        }
      }
    });

    // 更新或添加预设中的参数
    Object.entries(preset).forEach(function([key, value]) {
      existingParams.set(key, value);
    });

    // 清空参数容器
    document.getElementById('paramsContainer').innerHTML = '';
    
    // 重新添加所有参数
    existingParams.forEach(function(value, key) {
      addParamRow(key, value);
    });

    // 立即更新当前显示的URL
    const newUrl = await buildUrlFromParams();
    document.getElementById('currentUrl').textContent = newUrl;
  } catch (error) {
    console.error('应用预设时出错:', error);
  }
}

async function deletePreset(name) {
  try {
    if (!confirm(window.i18n.t('confirmDelete').replace('{name}', name))) return;
    
    const { presets = {} } = await chrome.storage.local.get('presets');
    delete presets[name];
    await chrome.storage.local.set({ presets });
    
    // 重新加载预设列表
    await loadPresets();
  } catch (error) {
    console.error(window.i18n.t('errorDeletingPreset'), error);
  }
}

// 添加实时预览更新函数
async function updateUrlPreview() {
  try {
    const newUrl = await buildUrlFromParams();
    document.getElementById('currentUrl').textContent = newUrl;
  } catch (error) {
    console.error('更新URL预览时出错:', error);
  }
}

// 在文件末尾添加导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addParamRow,
    buildUrlFromParams,
    saveCurrentAsPreset,
    loadPresets,
    deletePreset,
    updateUrlPreview
  };
} 