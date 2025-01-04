const i18n = {
  en: {
    title: 'URL Parameters Manager',
    currentLang: 'EN',
    addParam: 'Add Parameter',
    savePreset: 'Save Preset',
    applyChanges: 'Apply Changes',
    presetsTitle: 'Saved Presets',
    paramName: 'Parameter Name',
    paramValue: 'Parameter Value',
    delete: 'Delete',
    apply: 'Apply',
    confirmDelete: 'Are you sure you want to delete preset "{name}"?',
    enterPresetName: 'Enter preset name:',
    incompleteParams: 'Incomplete parameters',
    errorBuildingUrl: 'Error building URL:',
    errorSavingPreset: 'Error saving preset:',
    errorApplyingPreset: 'Error applying preset:',
    errorDeletingPreset: 'Error deleting preset:',
    errorUpdatingPreview: 'Error updating URL preview:',
  },
  zh: {
    title: 'URL参数管理器',
    currentLang: '中',
    addParam: '添加参数',
    savePreset: '保存预设',
    applyChanges: '应用修改',
    presetsTitle: '已保存的预设',
    paramName: '参数名',
    paramValue: '参数值',
    delete: '删除',
    apply: '应用',
    confirmDelete: '确定要删除预设"{name}"吗？',
    enterPresetName: '请输入预设名称：',
    incompleteParams: '参数输入框不完整',
    errorBuildingUrl: '构建URL时出错:',
    errorSavingPreset: '保存预设时出错:',
    errorApplyingPreset: '应用预设时出错:',
    errorDeletingPreset: '删除预设时出错:',
    errorUpdatingPreview: '更新URL预览时出错:',
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.init();
  }

  init() {
    this.updateTexts();
    document.getElementById('toggleLang').addEventListener('click', () => {
      this.toggleLanguage();
    });
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('language', this.currentLang);
    this.updateTexts();
  }

  updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });
  }

  t(key) {
    return i18n[this.currentLang][key] || key;
  }
}

// 创建全局实例
window.i18n = new I18nManager(); 