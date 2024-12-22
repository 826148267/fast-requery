document.addEventListener('DOMContentLoaded', async () => {
  // 获取当前标签页的URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  
  // 显示当前URL
  document.getElementById('currentUrl').textContent = url.href;
  
  // 初始化参数列表
  const paramsContainer = document.getElementById('paramsContainer');
  const params = new URLSearchParams(url.search);
  
  // 渲染参数列表
  for (const [key, value] of params) {
    addParamRow(key, value);
  }
  
  // 添加参数按钮事件
  document.getElementById('addParam').addEventListener('click', () => {
    addParamRow('', '');
  });
  
  // 应用修改按钮事件
  document.getElementById('applyChanges').addEventListener('click', async () => {
    const newUrl = await buildUrlFromParams();
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
  keyInput.placeholder = '参数名';
  
  // 创建参数值输入框
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.className = 'param-value';
  valueInput.value = value;
  valueInput.placeholder = '参数值';
  
  // 创建删除按钮
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn';
  deleteBtn.textContent = '删除';
  deleteBtn.addEventListener('click', () => row.remove());
  
  // 添加所有元素到行容器
  row.appendChild(keyInput);
  row.appendChild(valueInput);
  row.appendChild(deleteBtn);
  
  container.appendChild(row);
}

async function buildUrlFromParams() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  
  // 清除现有参数
  url.search = '';
  const params = new URLSearchParams(url.search);
  
  // 获取所有参数输入框
  const rows = document.querySelectorAll('.param-item');
  rows.forEach(row => {
    const key = row.querySelector('.param-key').value.trim();
    const value = row.querySelector('.param-value').value.trim();
    if (key) {
      params.append(key, value);
    }
  });
  
  url.search = params.toString();
  return url.href;
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
  
  Object.entries(presets).forEach(([name, params]) => {
    const preset = document.createElement('div');
    preset.className = 'preset-item';
    
    // 创建预设名称 span
    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    
    // 创建应用按钮
    const applyBtn = document.createElement('button');
    applyBtn.className = 'btn';
    applyBtn.textContent = '应用';
    applyBtn.addEventListener('click', () => applyPreset(name));
    
    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn';
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', () => deletePreset(name));
    
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

    // 清空现有参数
    document.getElementById('paramsContainer').innerHTML = '';
    
    // 添加预设中的参数
    Object.entries(preset).forEach(([key, value]) => {
      addParamRow(key, value);
    });
  } catch (error) {
    console.error('应用预设时出错:', error);
  }
}

async function deletePreset(name) {
  try {
    if (!confirm(`确定要删除预设"${name}"吗？`)) return;
    
    const { presets = {} } = await chrome.storage.local.get('presets');
    delete presets[name];
    await chrome.storage.local.set({ presets });
    
    // 重新加载预设列表
    await loadPresets();
  } catch (error) {
    console.error('删除预设时出错:', error);
  }
} 