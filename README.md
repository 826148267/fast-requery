# URL参数管理器 (URL Parameters Manager)

[English](README_EN.md) | [中文](README.md)

一个简单而强大的 Chrome 扩展，用于快速修改和管理 URL 查询参数。

## 功能特点

- 🔍 实时查看和编辑当前页面的 URL 参数
- ✏️ 快速添加、修改和删除参数
- 💾 保存常用参数组合为预设
- 🔄 支持多个预设叠加使用
- 👀 实时预览修改后的 URL
- 🚀 一键应用修改并刷新页面

## 安装

1. 从 Chrome 网上应用店安装（即将上线）
2. 手动安装（开发者模式）：
   - 下载此仓库的代码
   - 打开 Chrome 浏览器，访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择下载的代码目录

## 使用方法

1. 点击浏览器工具栏中的扩展图标
2. 查看当前页面的 URL 和参数
3. 添加、修改或删除参数
4. 点击"应用修改"以更新页面
5. 可以将常用的参数组合保存为预设
6. 随时应用保存的预设，支持多个预设叠加

## 适用场景

- Web 开发调试
- 接口测试
- 页面功能测试
- 快速切换页面状态

## 技术栈

- HTML5
- CSS3
- JavaScript
- Chrome Extension API

## 隐私政策

本扩展不收集任何个人信息，所有数据都存储在用户本地。详细信息请查看[隐私政策](public/privacy.html)。

## 开发

### 项目结构
```
url-params-manager/
├── src/
│   ├── popup/
│   │   ├── index.ts
│   │   └── style.css
│   ├── background/
│   ├── content/
│   └── utils/
├── public/
│   ├── icons/
│   └── _locales/
│   └── privacy.html
├── dist/           # 构建输出目录
├── scripts/        # 构建脚本
├── tests/          # 测试文件
├── vite.config.js  # Vite 配置
└── package.json
```

### 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建扩展：
```bash
npm run build
```

4. 打包发布：
```bash
npm run zip
```

### 开发流程

1. 本地开发
   - 使用 `npm run dev` 启动开发服务器
   - 修改代码会自动热重载
   - 在 Chrome 扩展管理页面加载 `dist` 目录

2. 代码检查
   - 运行 `npm run lint` 进行代码检查
   - 确保所有 TypeScript 类型正确

3. 测试
   - 运行 `npm run test` 执行单元测试
   - 在不同场景下测试扩展功能

4. 构建和发布
   - 运行 `npm run build` 生成生产版本
   - 使用 `npm run zip` 打包扩展
   - 生成的 `dist.zip` 可直接上传至 Chrome Web Store

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE)

## 作者

zeavan

## 联系方式

- Email: zeavango@gmail.com
- GitHub: [@zeavan](https://github.com/826148267)
