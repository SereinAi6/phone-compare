# SEO 优化说明

## 已完成的 SEO 优化

### 1. Meta 标签优化
- ✅ 动态页面标题和描述
- ✅ Open Graph 标签（Facebook 分享）
- ✅ Twitter Card 标签（Twitter 分享）
- ✅ Canonical URL（避免重复内容）
- ✅ Robots meta 标签
- ✅ Theme color 设置

### 2. 结构化数据（JSON-LD）
- ✅ 首页：WebApplication schema
- ✅ 对比页：ComparisonPage schema（动态生成）
- ✅ 包含评分信息

### 3. 语义化 HTML
- ✅ 正确使用 `<header>`, `<main>`, `<footer>`, `<section>` 标签
- ✅ ARIA 标签提升可访问性
- ✅ 语义化的 heading 层级（h1, h2）

### 4. 技术 SEO
- ✅ robots.txt 文件
- ✅ sitemap.xml 文件
- ✅ PWA manifest.json
- ✅ 响应式设计（viewport meta）
- ✅ 快速加载（静态生成）

### 5. 内容优化
- ✅ 描述性页面标题
- ✅ 独特的 meta 描述
- ✅ 关键词优化（phone compare, specs, comparison）
- ✅ 对比页面动态 SEO（基于选择的手机）

## 需要手动完成的任务

### 1. 替换 OG 图片
当前 `public/og-image.png` 是占位符，需要替换为：
- 尺寸：1200x630 像素
- 格式：PNG 或 JPG
- 内容：包含网站 logo 和简短说明

### 2. Google Search Console
1. 访问 https://search.google.com/search-console
2. 添加网站：`https://www.serein.ink/phone-compare/`
3. 验证所有权
4. 提交 sitemap：`https://www.serein.ink/phone-compare/sitemap.xml`

### 3. 其他搜索引擎
- Bing Webmaster Tools: https://www.bing.com/webmasters
- Yandex Webmaster: https://webmaster.yandex.com/

### 4. 性能优化建议
- 考虑添加图片懒加载（已有 `loading="lazy"`）
- 压缩手机图片
- 考虑使用 CDN 加速图片加载

### 5. 内容营销
- 创建博客文章（如"如何选择手机"）
- 添加常见问题（FAQ）页面
- 考虑添加手机评测内容

## 监控指标

定期检查以下指标：
- Google Search Console 中的索引状态
- 页面加载速度（PageSpeed Insights）
- 移动端友好性测试
- 结构化数据验证（Rich Results Test）

## 验证工具

使用以下工具验证 SEO 优化：
- https://search.google.com/test/rich-results - 结构化数据测试
- https://pagespeed.web.dev/ - 性能测试
- https://validator.w3.org/ - HTML 验证
- https://cards-dev.twitter.com/validator - Twitter Card 验证
