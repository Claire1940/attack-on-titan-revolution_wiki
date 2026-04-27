# SEO 检查报告

生成时间: 2026-04-27 12:05 UTC

## 检查摘要

- 通过: 16 项
- 失败: 0 项
- 警告: 0 项
- 总计: 16 项
- 得分: 100.0%

## 详细结果

### 阶段 1：代码结构检查

- 通过: App Router `src/app/robots.ts` 存在，并包含 sitemap 引用。
- 通过: App Router `src/app/sitemap.ts` 存在，并动态生成 sitemap。
- 通过: 首页 title 长度为 57 字符，符合 50-60 字符建议范围。
- 通过: 首页 description 长度为 153 字符，符合 150-160 字符建议范围。
- 通过: 首页 keywords 共 7 个，符合 5-10 个建议范围。
- 通过: Open Graph 和 Twitter Card 元数据完整。
- 通过: `public/images/hero.webp` 可作为 OG/hero image 使用。
- 通过: favicon 文件齐全。
- 通过: 路由配置包含 4 种语言，并存在 i18n routing 配置。
- 通过: 首页包含 WebSite、Organization、VideoGame、VideoObject 结构化数据。
- 通过: Hero、FAQ、工具卡片内容完整。
- 通过: `manifest.json` 存在。

### 阶段 2：链接一致性与旧品牌残留

- 已删除未在 `src/i18n/routing.ts` 启用的旧 locale 文件，避免旧主题文案进入 SEO 检查或误用。
- 已删除旧 `.bak` Terms 页面，避免旧站点名称残留。
- 已更新 `tools/keywords_zh.json`、transpage 辅助脚本保护词、内容 slug 示例和 sitemap 内容类型配置。
- `rg` 扫描 `src`、`content`、`public`、`tools/keywords_zh.json` 和本报告，未发现旧主题名、旧站点名、旧占位符或旧友情链接文件残留。

### 阶段 3：翻译文件检查

- `src/locales/en.json`: JSON 合法，3468 行。
- `src/locales/pt.json`: JSON 合法，3467 行。
- `src/locales/es.json`: JSON 合法，3468 行。
- `src/locales/id.json`: JSON 合法，3467 行。
- 路由语言尾部 `pages` 内容已翻译，无旧主题残留。

## 修复记录

- 更新 `scripts/check-seo.js`，使其识别当前 Next.js App Router 的动态 `robots.ts`、`sitemap.ts`、`hero.webp` 和首页 JSON-LD。
- 将首页 description 补充到 153 字符，并同步到 `en.json`、首页 metadata、locale layout metadata。
- 删除未启用语言的旧 locale 文件，保留 `en`、`pt`、`es`、`id` 四个路由语言。
- 修复翻译脚本对模型返回未转义控制字符的 JSON 容错。

## 剩余风险

- 翻译 API 多次出现超时，部分 chunk 按脚本机制使用英文原文兜底；该机制符合当前任务说明，但翻译质量可能需要后续人工抽检模块正文。
