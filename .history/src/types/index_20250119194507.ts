export interface URLParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ParamPreset {
  id: string;
  name: string;
  params: URLParam[];
}

export interface StorageData {
  presets: ParamPreset[];
} 