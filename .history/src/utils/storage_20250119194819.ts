import { ParamPreset, StorageData } from '../types';

/**
 * 保存预设到存储
 * @param preset 要保存的预设
 */
export async function savePreset(preset: ParamPreset): Promise<void> {
  const data = await chrome.storage.sync.get('presets');
  const presets = data.presets || [];

  presets.push(preset);
  await chrome.storage.sync.set({ presets });
}

/**
 * 获取所有预设
 * @returns 预设数组
 */
export async function getPresets(): Promise<ParamPreset[]> {
  const data = await chrome.storage.sync.get('presets');
  return data.presets || [];
}

/**
 * 删除预设
 * @param presetId 要删除的预设 ID
 */
export async function deletePreset(presetId: string): Promise<void> {
  const data = await chrome.storage.sync.get('presets');
  const presets = data.presets || [];

  const newPresets = presets.filter((preset: ParamPreset) => preset.id !== presetId);
  await chrome.storage.sync.set({ presets: newPresets });
}
