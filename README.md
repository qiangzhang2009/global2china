# Global2China - 海外优品·中国上市

一站式海外产品进口服务网站，为海外企业提供进入中国市场的全流程解决方案。

## 功能特点

- **首页**：展示核心价值主张、服务优势和AI工具入口
- **服务项目**：六大核心服务模块（选品、采购、准入、渠道、物流、品牌）
- **进口市场**：日本、欧洲、东南亚、澳大利亚、美国五大市场
- **智能工具**：
  - 进口成本计算器
  - 项目时间规划
  - ROI模拟器
- **成功案例**：展示进口项目案例
- **关于我们**：公司介绍和团队优势
- **联系我们**：在线询盘表单

## 技术栈

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Radix UI
- GSAP 动画
- i18next 国际化
- Lucide React 图标
- Sonner 通知

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/      # 可复用组件
├── sections/       # 页面区块组件
├── lib/            # 工具函数
├── i18n.ts         # 国际化配置
├── index.css       # 全局样式
└── App.tsx         # 主应用组件
```

## 集成主站

网站完成后可通过以下方式与主站 [www.zxqconsulting.com](www.zxqconsulting.com) 集成：

1. **子域名方式**：配置 `import.zxqconsulting.com` 指向此项目
2. **导航链接**：在主站导航栏添加"进入中国"入口，跳转至此站
3. **iframe嵌入**：在主站页面嵌入此站点

## 许可证

MIT
