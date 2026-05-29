# SEO 部署后操作指南

## 1. Google Search Console - 提交 Sitemap

**步骤：**

1. 打开 [Google Search Console](https://search.google.com/search-console) 并登录您的 Google 账号
2. 选择您的网站（如果还没添加，点击"添加资源" → 输入 `https://global2china.zxqconsulting.com/`）
3. 验证网站所有权（如果首次添加，有 5 种验证方式，推荐 DNS 或 HTML 文件验证）
4. 左侧菜单点击 **"Sitemaps"**（网站地图）
5. 在"添加网站地图"输入框中输入：
   ```
   sitemap.xml
   ```
6. 点击"提交"

**预期结果：**
- Search Console 会在 1-2 天内开始抓取您的 sitemap
- 在"覆盖"（Coverage）报告中查看索引状态
- 在"站点地图"报告中查看哪些 URL 被成功发现

**额外建议：**
- 同时提交 HTML 网站地图：`sitemap-html.html`
- 在"链接"（Links）报告中查看外链情况
- 设置"国际定位"（International Targeting）报告中的 hreflang 验证

---

## 2. Bing Webmaster Tools - 提交 Sitemap

**步骤：**

1. 打开 [Bing Webmaster Tools](https://www.bing.com/webmasters) 并登录 Microsoft/Google/Apple 账号
2. 点击"添加网站" → 输入 `https://global2china.zxqconsulting.com/`
3. 选择验证方式（支持 HTML 文件、DNS、Meta 标签等）
4. 验证通过后，进入网站后台
5. 点击左侧 **"Sitemaps"** → 点击"提交sitemap"
6. 输入：
   ```
   sitemap.xml
   ```
7. 点击"提交"

**预期结果：**
- Bing 通常在 24-48 小时内抓取
- 在"报告"中查看索引覆盖率、爬虫统计

---

## 3. Google Business Profile 注册

**说明：** 虽然 Global2China 是 B2B 服务公司（非实体零售门店），Google Business Profile 仍有助于本地 SEO 和品牌信任度。

**步骤：**

1. 打开 [Google Business Profile](https://business.google.com) 并登录 Google 账号
2. 点击"立即管理" → "添加商家信息"
3. 输入商家名称：**上海张小强企业咨询事务所**
4. 选择商家类别：**商业服务 > 咨询服务**（或更精准的进出口服务类别）
5. 输入地址（如果实体办公室）：上海市（可填中国任意地址）
6. 添加联系电话：`+86-137-6487-2538`
7. 添加网址：`https://global2china.zxqconsulting.com/`
8. 验证：Google 会通过明信片或电话验证（明信片通常 5-7 个工作日）
9. 验证通过后，完善以下信息：
   - **服务区域**：中国（全国）/ Selected countries
   - **服务类别**：进出口咨询、市场准入服务、报关清关、跨境电商服务
   - **营业时间**：周一至周五 09:00-22:00
   - **业务描述**：在描述中包含关键词如"海外产品进口中国"、"日本进口"、"欧洲进口"等
   - **照片**：添加办公室环境、团队照片（提升信任度）

**B2B 注意事项：**
- 如果没有固定门店地址，可以选择"服务型企业"（Service-area Business）
- Google Business Profile 对本地 SEO 非常重要，即使 B2B 服务也能增加品牌曝光

---

## 4. Google Analytics 4 - 配置国际定位报告

**前提：** 需要已有一个 Google Analytics 4 属性

### 步骤：

#### A. 基础配置

1. 打开 [Google Analytics](https://analytics.google.com) 并登录
2. 选择您的 GA4 媒体资源
3. 确认网站已正确安装 GA4 跟踪代码（Vercel 部署的网站通常已内置）

#### B. 启用增强型衡量（推荐）

1. 进入 **"管理"** → **"数据显示"** → **"数据流"**
2. 选择您的网站数据流
3. 在"增强型衡量"中启用：
   - ✅ 网页滚动（Scroll）
   - ✅ 出站点击（Outbound clicks）
   - ✅ 网站搜索（Site search）
   - ✅ 视频参与度（Video engagement）
   - ✅ 文件下载（File downloads）

#### C. 配置国际定位报告

GA4 自动收集用户地理位置，但需要配置才能在报告中正确显示：

1. 进入 **"配置"** → **"数据设置"** → **"地理位置"**
2. 确认"地理位置报告"已开启
3. 在 **"报告"** → **"用户"** → **"地理"** 中查看：
   - **按国家/地区**：用户的地理分布
   - **按城市**：城市级别的访问分布
   - **按语言**：用户的浏览器语言设置

#### D. 创建国际定位自定义报告

1. 进入 **"探索"**（Exploration）→ 点击 **"空白"** 创建新报告
2. 维度选择：
   - 国家/地区（Country）
   - 城市（City）
   - 语言（Language）
   - 页面路径（Page path）
3. 指标选择：
   - 用户数（Users）
   - 会话数（Sessions）
   - 转化次数（Conversions）
   - 平均参与时长（Average engagement time）
4. 交叉分析：按"国家/地区"分组，查看各国用户的参与度

#### E. 设置语言维度的用户洞察

GA4 的语言设置来自浏览器 Accept-Language 头，可用于识别用户来源语言：

1. 创建"探索"报告
2. 维度：语言、会话来源/媒介、国家
3. 过滤：仅包含非中国地区用户
4. 这可以帮助识别哪些国家/语言的用户正在访问您的网站

#### F. 配置目标转化（重要）

1. 进入 **"配置"** → **"活动"** → **"目标"**
2. 创建以下目标：
   - **表单提交**：当用户完成询盘表单提交时触发
   - **AI分析使用**：当用户使用 AI 工具完成分析时触发
3. 在"探索"报告中按国家/地区查看转化率

#### G. 建议的自定义维度（需要修改跟踪代码）

在 GA4 Admin → Custom definitions 中添加：

| 自定义维度 | 来源 | 说明 |
|-----------|------|------|
| Analysis Mode | 事件参数 | sell-to-china / sourcing |
| Product Category | 事件参数 | L1 产品分类 |
| China Region | 事件参数 | 目标销售区域 |
| Visitor Language | 事件参数 | 用户使用的界面语言 |

---

## 快速检查清单

- [ ] Google Search Console 添加网站并验证所有权
- [ ] Search Console 提交 sitemap.xml
- [ ] Search Console 提交 sitemap-html.html
- [ ] Bing Webmaster Tools 添加网站并验证
- [ ] Bing 提交 sitemap.xml
- [ ] Google Business Profile 注册并通过验证
- [ ] GA4 查看地理位置报告
- [ ] GA4 创建国际定位自定义报告
- [ ] GA4 设置表单提交目标转化
- [ ] 确认 og-image.png 已部署（访问 https://global2china.zxqconsulting.com/og-image.png 验证）
