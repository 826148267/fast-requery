import { URLParam, ParamPreset } from '../types';
import { parseURLParams, buildURL } from '../utils/url';
import { savePreset, getPresets, deletePreset } from '../utils/storage';

/**
 * 初始化弹出窗口
 */
async function initPopup(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) return;

  const params = parseURLParams(tab.url);
  renderParams(params);
  
  const presets = await getPresets();
  renderPresets(presets);
  
  setupEventListeners();
}

/**
 * 渲染参数列表
 */
function renderParams(params: URLParam[]): void {
  const container = document.getElementById('params-list');
  if (!container) return;
  
  container.innerHTML = params.map(param => `
    <div class="param-item">
      <input type="checkbox" ${param.enabled ? 'checked' : ''} />
      <input type="text" value="${param.key}" />
      <input type="text" value="${param.value}" />
      <button class="delete-param">删除</button>
    </div>
  `).join('');
}

/**
 * 渲染预设列表
 */
function renderPresets(presets: ParamPreset[]): void {
  const container = document.getElementById('presets-list');
  if (!container) return;
  
  container.innerHTML = presets.map(preset => `
    <div class="preset-item">
      <span>${preset.name}</span>
      <button class="apply-preset" data-id="${preset.id}">应用</button>
      <button class="delete-preset" data-id="${preset.id}">删除</button>
    </div>
  `).join('');
}

/**
 * 设置事件监听器
 */
function setupEventListeners(): void {
  // 添加参数按钮
  document.getElementById('add-param')?.addEventListener('click', () => {
    const container = document.getElementById('params-list');
    if (!container) return;
    
    const newParamHtml = `
      <div class="param-item">
        <input type="checkbox" checked />
        <input type="text" placeholder="参数名" />
        <input type="text" placeholder="参数值" />
        <button class="delete-param">删除</button>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newParamHtml);
  });
  
  // 应用修改按钮
  document.getElementById('apply-changes')?.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url || !tab.id) return;
    
    const params = getParamsFromUI();
    const newUrl = buildURL(tab.url, params);
    
    await chrome.tabs.update(tab.id, { url: newUrl });
  });
}

/**
 * 从 UI 获取当前参数
 */
function getParamsFromUI(): URLParam[] {
  const params: URLParam[] = [];
  const paramItems = document.querySelectorAll('.param-item');
  
  paramItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const keyInput = item.querySelectorAll('input[type="text"]')[0] as HTMLInputElement;
    const valueInput = item.querySelectorAll('input[type="text"]')[1] as HTMLInputElement;
    
    if (keyInput.value) {
      params.push({
        key: keyInput.value,
        value: valueInput.value,
        enabled: checkbox.checked
      });
    }
  });
  
  return params;
}

// 初始化
document.addEventListener('DOMContentLoaded', initPopup); 