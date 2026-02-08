# 自定义域名 SEO 检查清单

## 域名：https://www.serein.ink/phone-compare

### ✅ 已完成的配置

1. **Astro 配置**
   - ✅ `site: 'https://www.serein.ink'`
   - ✅ `base: '/phone-compare'`

2. **SEO 文件**
   - ✅ sitemap.xml 更新为新域名
   - ✅ robots.txt 更新为新域名
   - ✅ manifest.json 配置

3. **结构化数据**
   - ✅ WebApplication schema
   - ✅ Organization schema
   - ✅ BreadcrumbList schema
   - ✅ ComparisonPage schema（对比页）

4. **Meta 标签**
   - ✅ Open Graph 标签
   - ✅ Twitter Card 标签
   - ✅ Canonical URL
   - ✅ Keywords meta 标签
   - ✅ Author 信息

5. **安全头部**
   - ✅ _headers 文件（如果服务器支持）
   - ✅ X-Frame-Options
   - ✅ X-Content-Type-Options
   - ✅ Referrer-Policy

---

## 🔧 需要手动完成的任务

### 1. DNS 配置验证
确保域名正确指向服务器：
```bash
# 检查 DNS 解析
nslookup www.serein.ink

# 检查 HTTPS 证书
curl -I https://www.serein.ink/phone-compare/
```

### 2. Google Search Console 设置

#### 步骤 1：添加网站
1. 访问 https://search.google.com/search-console
2. 点击"添加资源"
3. 选择"网址前缀"
4. 输入：`https://www.serein.ink/phone-compare/`

#### 步骤 2：验证所有权
选择以下任一方式：
- **HTML 文件验证**：下载文件上传到 `public/` 目录
- **HTML 标签验证**：添加 meta 标签到 BaseLayout.astro
- **DNS 验证**：添加 TXT 记录到域名 DNS

#### 步骤 3：提交 Sitemap
1. 在 Search Console 左侧菜单选择"站点地图"
2. 输入：`https://www.serein.ink/phone-compare/sitemap.xml`
3. 点击"提交"

#### 步骤 4：请求索引
1. 使用"网址检查"工具
2. 输入首页 URL
3. 点击"请求编入索引"

### 3. Bing Webmaster Tools

1. 访问 https://www.bing.com/webmasters
2. 添加网站：`https://www.serein.ink/phone-compare/`
3. 验证所有权（可以从 Google Search Console 导入）
4. 提交 sitemap

### 4. 其他搜索引擎

**Yandex（如果目标俄罗斯市场）**
- https://webmaster.yandex.com/

**Baidu（如果目标中国市场）**
- https://ziyuan.baidu.com/

### 5. 社交媒体验证

**Twitter Card 验证**
1. 访问 https://cards-dev.twitter.com/validator
2. 输入：`https://www.serein.ink/phone-compare/`
3. 检查预览效果

**Facebook 分享调试**
1. 访问 https://developers.facebook.com/tools/debug/
2. 输入：`https://www.serein.ink/phone-compare/`
3. 点击"抓取新信息"

**LinkedIn Post Inspector**
1. 访问 https://www.linkedin.com/post-inspector/
2. 输入 URL 检查预览

### 6. 性能优化

**PageSpeed Insights**
```
https://pagespeed.web.dev/
测试 URL: https://www.serein.ink/phone-compare/
```

目标分数：
- 移动端：> 90
- 桌面端：> 95

**Core Web Vitals 目标**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 7. 结构化数据验证

**Rich Results Test**
1. 访问 https://search.google.com/test/rich-results
2. 输入：`https://www.serein.ink/phone-compare/`
3. 确认所有结构化数据正确

**Schema Markup Validator**
- https://validator.schema.org/

### 8. 移动端友好性

**Mobile-Friendly Test**
1. 访问 https://search.google.com/test/mobile-friendly
2. 输入 URL 测试
3. 确保通过所有检查

### 9. 安全性检查

**SSL 证书**
```bash
# 检查 SSL 证书有效性
openssl s_client -connect www.serein.ink:443 -servername www.serein.ink
```

**Security Headers**
- 访问 https://securityheaders.com/
- 输入域名检查安全头部

### 10. 分析工具设置

**Google Analytics 4**
1. 创建 GA4 属性
2. 获取测量 ID (G-XXXXXXXXXX)
3. 添加到网站（可选）

**Google Tag Manager**（可选）
- 统一管理所有追踪代码

---

## 📊 监控指标

### 每周检查
- [ ] Google Search Console 索引状态
- [ ] 搜索展示次数和点击率
- [ ] 页面加载速度
- [ ] 错误和警告

### 每月检查
- [ ] 关键词排名
- [ ] 反向链接数量
- [ ] 页面权重（Domain Authority）
- [ ] 竞争对手分析

### 关键 KPI
- 自然搜索流量
- 平均页面停留时间
- 跳出率
- 转化率（对比次数）

---

## 🎯 SEO 优化建议

### 内容优化
1. **创建博客内容**
   - "2025 年最佳手机对比"
   - "如何选择适合你的手机"
   - "旗舰手机 vs 中端手机"

2. **添加 FAQ 页面**
   - 常见问题解答
   - 使用 FAQ schema

3. **手机评测内容**
   - 详细的手机评测文章
   - 视频内容（如果可能）

### 技术优化
1. **图片优化**
   - 使用 WebP 格式
   - 添加 alt 文本
   - 实现懒加载

2. **代码优化**
   - 压缩 CSS/JS
   - 使用 CDN
   - 启用 Brotli 压缩

3. **缓存策略**
   - 设置合理的 Cache-Control
   - 使用 Service Worker（PWA）

### 链接建设
1. **内部链接**
   - 相关手机推荐
   - 热门对比链接

2. **外部链接**
   - 社交媒体分享
   - 科技博客投稿
   - 论坛参与

---

## 🔍 验证命令

```bash
# 1. 检查 robots.txt
curl https://www.serein.ink/phone-compare/robots.txt

# 2. 检查 sitemap.xml
curl https://www.serein.ink/phone-compare/sitemap.xml

# 3. 检查 manifest.json
curl https://www.serein.ink/phone-compare/manifest.json

# 4. 检查响应头
curl -I https://www.serein.ink/phone-compare/

# 5. 检查 SSL
curl -vI https://www.serein.ink/phone-compare/ 2>&1 | grep -i ssl
```

---

## 📝 注意事项

1. **301 重定向**
   - 如果从旧域名迁移，设置 301 重定向
   - 在 Google Search Console 中更新地址

2. **Canonical URL**
   - 确保所有页面都有正确的 canonical 标签
   - 避免重复内容问题

3. **国际化**（如果需要）
   - 添加 hreflang 标签
   - 支持多语言版本

4. **持续优化**
   - 定期更新内容
   - 监控搜索趋势
   - 根据数据调整策略

---

## ✅ 完成后的验证清单

- [ ] 网站可以通过新域名访问
- [ ] HTTPS 证书正常
- [ ] robots.txt 可访问
- [ ] sitemap.xml 可访问
- [ ] Google Search Console 已验证
- [ ] Sitemap 已提交
- [ ] 首页已请求索引
- [ ] Open Graph 预览正常
- [ ] Twitter Card 预览正常
- [ ] 结构化数据验证通过
- [ ] 移动端友好性测试通过
- [ ] PageSpeed 分数 > 90
- [ ] 所有链接正常工作
- [ ] 图片正常加载
- [ ] 对比功能正常

---

**最后更新：** 2025-02-08
**域名：** https://www.serein.ink/phone-compare
