# AIYM-启梦

> 为开发者打造的现代化 Halo 2.x 博客主题

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Halo](https://img.shields.io/badge/Halo-2.25.0%2B-green)
![License](https://img.shields.io/badge/license-MIT-orange)

![AIYM-启梦](screenshot.png)

## ✨ 特性

- 🎨 **浅色 / 深色模式** — 一键切换，支持跟随系统
- 📱 **完美移动端适配** — 底部导航 + 侧滑菜单，移动端体验对齐小程序
- 🔍 **全局搜索弹窗** — `⌘/Ctrl + K` 唤起，支持搜索历史 + 热门关键词
- 📦 **资源库中心** — 独立资源页 + 资源文章模板，支持下载链接、版本、平台等扩展字段
- 🧰 **在线工具箱** — 内置 16 个开发者常用工具（JSON 格式化、正则测试、JWT 解码等），后台可配置
- 🛠 **自定义 HTML 页面** — 工具以 HTML 块形式粘贴到页面，无需额外模板
- 📝 **文章详情页** — TOC 侧边栏 / 悬浮面板、代码复制、图片预览、正文引用追加
- 🎯 **分类筛选** — 首页分类标签切换，支持无限滚动加载
- ⚡ **纯 CSS/JS** — 无构建依赖，部署即用
- 🔒 **SEO 优化** — Open Graph、结构化数据、备案信息自动展示
- ♿ **无障碍支持** — 语义化 HTML、键盘导航、屏幕阅读器兼容

## 📦 安装

1. 下载主题包（`.zip` 格式）
2. 登录 Halo 后台 → **外观** → **主题** → **安装主题**
3. 上传主题包文件，等待安装完成
4. 启用主题，配置各项设置

## ⚙️ 配置说明

### 基础设置

| 选项 | 说明 |
|------|------|
| 网站 Logo | 上传 Logo 图片，推荐 36×36px 方形 |
| 默认封面 | 文章无封面时使用的默认图片 |
| 主导航菜单 | 选择 Halo 主菜单（支持 Iconify 图标注解） |

### 内容设置

| 选项 | 说明 |
|------|------|
| 博客根分类 | 首页只显示此分类及其子分类下的文章 |
| 资源根分类 | 资源中心只显示此分类及其子分类下的资源 |
| 每页文章数 | 列表页每页文章数（默认 10） |
| 热门文章数 | 首页热门文章数量（默认 5） |

### 外观设置

| 选项 | 说明 |
|------|------|
| 默认模式 | 跟随系统 / 浅色 / 深色 |
| 主题色 | 自定义品牌色（按钮、链接、激活状态等自动跟随） |
| 主题色（深色） | 悬停态使用的深色版本 |
| 主题色（浅色背景） | 标签背景、高亮等使用的浅色版本 |
| 随机封面图库 | 文章无封面时从这些图片中随机选取 |

### 资源设置

| 选项 | 说明 |
|------|------|
| 补充说明（Markdown） | 资源文章末尾显示的使用说明/免责声明，支持 Markdown 格式 |

### SEO 与备案

| 选项 | 说明 |
|------|------|
| 站点描述 | 留空时使用 Halo 系统设置中的站点描述 |
| OG 默认图片 | 文章无封面时用于社交分享卡片 |
| ICP 备案号 / 链接 | 配置后显示在页脚 |
| 公安备案号 / 链接 | 配置后显示在页脚（带图标） |

### 工具箱设置

| 选项 | 说明 |
|------|------|
| 工具分类 | 用标签形式管理工具分类，支持增删 |
| 工具列表 | 通过 repeater 配置工具名称、描述、图标、链接、分类等 |

## 📋 内置页面模板

### 资源中心（`resources`）

独立资源页面，包含：
- Hero 区域 + 推荐资源横滑卡片
- 全部资源列表（无限滚动）
- 分类筛选
- 后台创建单页面时选择 `resources` 模板

### 工具箱（`toolbox`）

开发者工具聚合页面，包含：
- 搜索 + 分类筛选
- 工具卡片网格（响应式 2→3→4→5 列）
- 外部链接自动新窗口打开
- 后台创建单页面时选择 `toolbox` 模板

### 关于页面（`about`）

简约风格个人介绍页面，支持：
- 自动读取站点信息
- 页面编辑器内容
- 联系方式（pipe 格式配置，后台可管理）
- 后台创建单页面时选择 `about` 模板

### 搜索页面（`search`）

全局搜索弹窗（`⌘/Ctrl + K` 唤起）：
- 品牌色图标 + 搜索框
- 热门关键词 + 搜索历史
- 桌面端双列网格 / 移动端全屏
- 150ms 防抖

## 🧰 内置工具列表

| 工具 | 说明 |
|------|------|
| JSON 格式化 | 树形视图 + 格式化 / 压缩 / 转义 |
| Base64 编解码 | 文本 ↔ Base64 互转 |
| URL 编解码 | URL 编码 / 解码 |
| 时间戳转换 | Unix 时间戳 ↔ 可读日期 |
| 正则测试 | 正则表达式测试 + 匹配高亮 |
| 颜色转换 | HEX / RGB / HSL 互转 |
| 二维码生成 | 输入内容生成二维码 |
| ID 生成器 | UUID / Nano ID / 短 ID |
| Hash 计算 | MD5 / SHA（Web Crypto API） |
| 密码生成 | 自定义长度 + 字符类型 |
| 文本对比 | 两段文本差异对比 |
| Markdown 预览 | 实时 Markdown 渲染 |
| Cron 解析 | Cron 表达式 → 可读描述 |
| JWT 解码 | JWT Token 解码 |
| 大小写转换 | 各种大小写格式转换 |
| 进制转换 | 二/八/十/十六进制互转 |

工具以自包含 HTML 片段形式提供（`templates/tools/*.html`），粘贴到 Halo 页面内容中即可使用，无需额外安装。

## 🔧 资源文章字段

资源类文章通过文章注解（Annotation）扩展字段：

| 注解 Key | 说明 |
|----------|------|
| `theme.aiym.fun/download-url` | 下载地址 |
| `theme.aiym.fun/icon-url` | 图标地址 |
| `theme.aiym.fun/version` | 版本号 |
| `theme.aiym.fun/platform` | 平台（如 Windows, macOS） |

兼容旧 Key：`downloadUrl`、`iconUrl`、`version`、`platform`

## 📐 菜单图标

导航菜单支持 Iconify 图标注解，在 Halo 后台编辑菜单项 → **自定义属性**中设置：

- `icon`: Iconify 图标名，如 `ri-home-line`、`ri-article-line`
- `animation`: 设为任意值启用悬停动画

图标列表：[Iconify 图标搜索](https://icon-sets.iconify.design/)

## 🎨 目录结构

```
theme-aiym/
├── theme.yaml              # 主题元数据
├── settings.yaml           # 主题设置定义
├── annotation-setting.yaml # 文章注解设置
├── screenshot.png          # 主题截图
├── README.md
└── templates/
    ├── index.html              # 首页（文章列表 + 分类筛选）
    ├── post.html               # 文章详情（资源/普通共用）
    ├── page.html               # 独立页面（工具 HTML 块容器）
    ├── page_resources.html     # 资源中心独立页
    ├── page_toolbox.html       # 工具箱聚合页
    ├── page_about.html         # 关于页面
    ├── category.html           # 分类页
    ├── archives.html           # 归档页
    ├── tags.html               # 标签页
    ├── tools/                  # 自包含工具 HTML 块
    │   ├── json.html           # JSON 格式化
    │   ├── base64.html         # Base64 编解码
    │   ├── url.html            # URL 编解码
    │   ├── timestamp.html      # 时间戳转换
    │   ├── regex.html          # 正则测试
    │   ├── color.html          # 颜色转换
    │   ├── qrcode.html         # 二维码生成
    │   ├── uuid.html           # ID 生成器
    │   ├── hash.html           # Hash 计算
    │   ├── password.html       # 密码生成
    │   ├── diff.html           # 文本对比
    │   ├── markdown.html       # Markdown 预览
    │   ├── cron.html           # Cron 解析
    │   ├── jwt.html            # JWT 解码
    │   ├── case.html           # 大小写转换
    │   └── base.html           # 进制转换
    ├── error/                  # 错误页
    │   ├── 404.html
    │   └── 500.html
    ├── modules/
    │   ├── layout.html         # 全局布局 + CSS + 搜索弹窗
    │   ├── head.html           # head 标签（SEO）
    │   ├── header.html         # 页头（三栏：Logo + tabbar + 用户）
    │   ├── footer.html         # 页脚（备案 + 版权）
    │   └── mobile-nav.html     # 移动端导航
    └── assets/
        ├── css/style.css       # 主样式
        └── js/main.js          # 主题管理 / 搜索 / TOC / 代码复制
```

## 🚀 快速开始

### 创建工具箱页面

1. Halo 后台 → 内容 → 单篇页面 → 新建
2. 标题填 `工具箱`，路径填 `toolbox`
3. 模板选择 `toolbox`
4. 保存 → 发布

### 创建资源中心页面

1. Halo 后台 → 内容 → 单篇页面 → 新建
2. 标题填 `资源中心`，路径填 `resources`
3. 模板选择 `resources`
4. 保存 → 发布

### 创建工具页面

1. Halo 后台 → 内容 → 单篇页面 → 新建
2. 标题填工具名，路径填 `tools/json`（示例）
3. 模板选择 `page`
4. 内容切换到 **HTML 模式**，粘贴 `templates/tools/json.html` 全部内容
5. 保存 → 发布

## 🔨 开发

### 技术栈

- **模板引擎**: Thymeleaf（Halo 2.x）
- **样式**: 纯 CSS + CSS 变量主题系统
- **脚本**: 纯 Vanilla JS，无构建依赖
- **图标**: Iconify（CSS-based 渲染）

### 调试

```bash
# Docker 环境
docker exec halo-halo-1 curl -s http://127.0.0.1:8090/

# 禁用模板缓存（开发环境）
# docker-compose.yml 中设置:
# SPRING_THYMELEAF_CACHE=false

# 修改后生效
# - HTML 模板变更 → 后台「清理模板缓存」
# - settings.yaml 变更 → 后台「重载主题配置」
# - CSS/JS 变更 → 浏览器刷新即可
```

## 🌐 环境要求

- **Halo**: >= 2.25.0
- **搜索组件插件**: 需在 Halo 后台启用（全局搜索依赖）

## 📄 许可证

[MIT License](https://github.com/aiym/theme-aiym/blob/main/LICENSE)

---

**AIYM-启梦** — 让开发者博客更优雅 ✨
