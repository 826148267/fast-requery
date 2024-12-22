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
  
  row.innerHTML = `
    <input type="text" class="param-key" value="${key}" placeholder="参数名">
    <input type="text" class="param-value" value="${value}" placeholder="参数值">
    <button class="btn" onclick="this.parentElement.remove()">删除</button>
  `;
  
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
  
  const presets = await chrome.storage.local.get('presets') || {};
  presets[name] = params;
  await chrome.storage.local.set({ presets });
  
  loadPresets();
}

async function loadPresets() {
  const { presets = {} } = await chrome.storage.local.get('presets');
  const presetsList = document.getElementById('presetsList');
  presetsList.innerHTML = '';
  
  Object.entries(presets).forEach(([name, params]) => {
    const preset = document.createElement('div');
    preset.className = 'preset-item';
    preset.innerHTML = `
      <span>${name}</span>
      <button class="btn" onclick="applyPreset('${name}')">应用</button>
      <button class="btn" onclick="deletePreset('${name}')">删除</button>
    `;
    presetsList.appendChild(preset);
  });
}

async function applyPreset(name) {
  const { presets = {} } = await chrome.storage.local.get('presets');
  const preset = presets[name];
  if (!preset) return;

  // 清空现有参数
  document.getElementById('paramsContainer').innerHTML = '';
  
  // 添加预设中的参数
  Object.entries(preset).forEach(([key, value]) => {
    addParamRow(key, value);
  });
}

async function deletePreset(name) {
  if (!confirm(`确定要删除预设"${name}"吗？`)) return;
  
  const { presets = {} } = await chrome.storage.local.get('presets');
  delete presets[name];
  await chrome.storage.local.set({ presets });
  
  loadPresets();
} 