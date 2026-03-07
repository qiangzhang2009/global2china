// AI 分析 API 配置
// 使用方式: import { analyzeWithAI } from '@/lib/aiAnalysis';

const DEEPSEEK_API_KEY = 'sk-0b2fc8add98b482b893a6812a440abe5';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

// 支持的语言代码映射
export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ar'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// 语言名称映射（用于显示）
export const LANGUAGE_NAMES: Record<string, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
};

// 多语言翻译函数 - 用于生成联系我们的多语言内容
export function getContactUsContent(lang: string = 'zh'): { title: string; description: string; cta: string; 事务所名称: string } {
  const isZh = lang === 'zh';
  
  const content: Record<string, { title: string; description: string; cta: string; 事务所名称: string }> = {
    zh: {
      title: '需要更专业的支持？',
      description: '我们的专业团队拥有多年跨境贸易经验，可为您提供从市场调研、准入咨询到渠道对接的全流程服务，帮助您避免常见陷阱，节省时间和成本。',
      cta: '立即咨询我们',
      事务所名称: '上海张小强企业咨询事务所',
    },
    en: {
      title: 'Need Professional Support?',
      description: 'Our team with years of cross-border trade experience can provide you with full-process services from market research and compliance consulting to channel matching, helping you save time and costs while avoiding common pitfalls.',
      cta: 'Contact Us Now',
      事务所名称: 'Shanghai Zhang Xiaoqiang Consulting Firm',
    },
    ja: {
      title: 'プロフェッショナルなサポートが必要ですか？',
      description: '多年の越境貿易経験を持つチームが、市場調査、コンプライアンスコンサルティングからチャネルマッチングまでの包括的なサービスを提供し、一般的な落とし穴を回避しながら時間とコストを節約します。',
      cta: '今すぐお問い合わせ',
      事务所名称: '上海張小強企業コンサルティング事務所',
    },
    ko: {
      title: '전문적인 지원이 필요하세요?',
      description: '多年的 경험을 보유한 크로스보더 무역 전문가 팀이 시장 조사, 규정 자문부터 채널 매칭까지的全流程 서비스를 제공하여 일반적인 함정을 피하면서 시간과 비용을 절약할 수 있습니다.',
      cta: '지금 문의하기',
      事务所名称: '상하이 장샤오치앙 기업컨설팅사무소',
    },
    de: {
      title: 'Professionelle Unterstützung benötigt?',
      description: 'Unser Team mit jahrelanger Erfahrung im grenzüberschreitenden Handel bietet Ihnen umfassende Dienstleistungen von Marktforschung und Compliance-Beratung bis zur Kanalvermittlung, damit Sie Zeit und Kosten sparen und typische Fallstricke vermeiden.',
      cta: 'Kontaktieren Sie uns jetzt',
      事务所名称: 'Shanghai Zhang Xiaoqiang Consulting',
    },
    fr: {
      title: 'Besoin de Support Professionnel?',
      description: 'Notre équipe avec des années d\'expérience dans le commerce transfrontalier peut vous offrir des services complets depuis les études de marché et le conseil en conformité jusqu\'à la mise en relation avec des canaux, vous aidant à gagner du temps et à réduire les coûts tout en évitant les pièges courants.',
      cta: 'Contactez-nous Maintenant',
      事务所名称: 'Cabinet de Conseil Zhang Xiaoqiang Shanghai',
    },
    es: {
      title: '¿Necesita Soporte Profesional?',
      description: 'Nuestro equipo con años de experiencia en comercio transfronterizo puede ofrecerle servicios integrales desde investigación de mercado y consultoría de cumplimiento hasta emparejamiento de canales, ayudándole a ahorrar tiempo y costos mientras evita errores comunes.',
      cta: 'Contáctenos Ahora',
      事务所名称: 'Consultora Zhang Xiaoqiang Shanghai',
    },
    it: {
      title: 'Hai Bisogno di Supporto Professionale?',
      description: 'Il nostro team con anni di esperienza nel commercio transfrontaliero può fornirvi servizi completi dalla ricerca di mercato e consulenza sulla conformità fino all\'abbinamento con i canali, aiutandovi a risparmiare tempo e costi evitando le insidie comuni.',
      cta: 'Contattaci Ora',
      事务所名称: 'Studio di Consulenza Zhang Xiaoqiang Shanghai',
    },
    pt: {
      title: 'Precisa de Suporte Profissional?',
      description: 'Nossa equipe com anos de experiência em comércio transfronteiriço pode oferecer serviços completos desde pesquisa de mercado e consultoria de conformidade até correspondência de canais, ajudando você a economizar tempo e custos enquanto evita armadilhas comuns.',
      cta: 'Contacte-nos Agora',
      事务所名称: 'Escritório de Consultoria Zhang Xiaoqiang Shanghai',
    },
    ru: {
      title: 'Нужна профессиональная поддержка?',
      description: 'Наша команда с многолетним опытом трансграничной торговли может предоставить вам полный спектр услуг - от исследования рынка и консультаций по соответствию до подбора каналов, помогая экономить время и избегать распространённых ошибок.',
      cta: 'Связаться с Нами',
      事务所名称: 'Консалтинговая Фирма Zhang Xiaoqiang Шанхай',
    },
    ar: {
      title: 'هل تحتاج إلى دعم احترافي؟',
      description: 'فريقنا الذي يتمتع بسنوات من الخبرة في التجارة العابرة للحدود يمكن أن يوفر لك خدمات شاملة من أبحاث السوق والاستشارات المتعلقة بالامتثال حتى مطابقة القنوات، مما يساعدك على توفير الوقت والتكاليف مع تجنب المزالق الشائعة.',
      cta: 'اتصل بنا الآن',
      事务所名称: 'مكتب الاستشارات تشانغ شياو تشيانغ شنغهاي',
    },
  };
  
  return content[lang] || content.zh;
}

// 分析模式：卖到中国 vs 从海外采购
export type AnalysisMode = 'sell-to-china' | 'sourcing';

export const ANALYSIS_MODES = [
  { id: 'sell-to-china', name: '我要卖到中国', nameEn: 'Sell to China', desc: '分析产品进口可行性，了解市场需求与合规要求', icon: '📈' },
  { id: 'sourcing', name: '我要从海外采购', nameEn: 'Source from Overseas', desc: '获取海外采购选品建议与供应商信息', icon: '🌍' },
] as const;

/** 用户身份/角色 - 帮助 AI 做身份定位，使建议更贴合（选填） */
export const USER_ROLES = [
  { id: 'brand', name: '品牌方/厂商', desc: '自有品牌或生产方，计划进入/拓展中国市场', icon: '🏷️' },
  { id: 'trader', name: '贸易商/进口商', desc: '从事进出口贸易，寻找新品类或新区域', icon: '📦' },
  { id: 'ecommerce', name: '跨境电商卖家', desc: '在平台开店，选品或拓展供应链', icon: '🛒' },
  { id: 'procurement', name: '采购经理/企业采购', desc: '为企业采购进口商品或原料', icon: '📋' },
  { id: 'individual', name: '个人/其他', desc: '个人兴趣、创业考察等', icon: '👤' },
] as const;

/** 当前业务阶段 - 帮助 AI 判断意图与侧重点（选填） */
export const BUSINESS_STAGES = [
  { id: 'research', name: '市场调研中', desc: '了解市场可行性与大致门槛', icon: '🔍' },
  { id: 'sourcing', name: '选品/洽谈中', desc: '已锁定方向，在选品或谈供应商', icon: '🤝' },
  { id: 'first-import', name: '准备首次进口', desc: '即将落地首单，关注合规与流程', icon: '🚀' },
  { id: 'experienced', name: '已有进口经验', desc: '希望优化或拓展品类/区域', icon: '📈' },
] as const;

// 中国目标区域（卖到中国模式使用）
export const CHINA_REGIONS = [
  { id: 'east-china', name: '华东地区', cities: '上海、江苏、浙江', desc: '经济发达，消费力强，进口商品认可度高', icon: '🏙️' },
  { id: 'south-china', name: '华南地区', cities: '广东、福建、广西', desc: '对外贸易活跃，物流便利，渠道丰富', icon: '🌴' },
  { id: 'north-china', name: '华北地区', cities: '北京、天津、河北', desc: '政治文化中心，高端消费市场', icon: '🏯' },
  { id: 'southwest', name: '西南地区', cities: '四川、重庆、云南', desc: '新兴消费市场，增长潜力大', icon: '🏔️' },
  { id: 'national', name: '全国范围', cities: '覆盖全国', desc: '全渠道布局，最大化市场覆盖', icon: '🗺️' },
] as const;

// 增强版分析结果接口 - 重新设计以匹配用户选择的选项
export interface AnalysisResult {
  // ===== 核心分析维度 =====
  // 市场需求分析 - 根据选择的目标区域和产品类型定制
  marketDemand: {
    overall: string;           // 整体市场需求概述
    regional: string;          // 针对特定区域的定制分析
    targetCustomers: string;   // 目标客户群体描述
    growthTrend: string;       // 增长趋势
  };
  
  // 竞争分析 - 根据区域市场特点
  competition: {
    level: string;             // 竞争程度（低/中/高）
    mainCompetitors: string[]; // 主要竞争对手类型
    differentiation: string;   // 差异化建议
  };
  
  // 定价策略 - 根据区域消费水平
  pricing: {
    recommendedRange: string;  // 建议售价范围
    costBreakdown: string;     // 成本构成说明
    margin: string;            // 利润空间
  };
  
  // 时间周期 - 根据产品和区域
  timeline: {
    import: string;            // 进口清关周期
    marketEntry: string;       // 市场进入周期
    roi: string;              // 投资回报周期
  };
  
  // 风险与挑战
  challenges: {
    level: string;             // 风险等级
    mainRisks: string[];       // 主要风险点
    mitigation: string[];      // 风险应对建议
  };
  
  // 合规要求 - 根据产品类型
  compliance: {
    certifications: string[]; // 必需资质证书
    labeling: string[];        // 标签要求
    testing: string[];         // 检测要求
  };
  
  // 行动建议 - 综合分析结论
  actionPlan: {
    nextSteps: string[];       // 下一步行动
    priority: string;          // 优先级建议
    keySuccessFactors: string[]; // 成功关键因素
  };
  
  // 联系我们 - 引导用户进一步咨询
  contactUs?: {
    title: string;           // 区块标题
    description: string;      // 描述
    cta: string;             // 行动号召按钮文字
   事务所名称: string;          // 联系我们的事务所
  };
}

// 调用 DeepSeek API 进行智能分析
// mode: 'sell-to-china' - 进口可行性分析 | 'sourcing' - 采购选品指南
export async function analyzeWithAI(
  productType: string,
  targetRegion: string,
  mode: AnalysisMode = 'sell-to-china',
  originRegion?: string,
  options?: {
    productName?: string;
    categoryLevel1Name?: string;
    categoryLevel2Name?: string;
    categoryContext?: string;
    countryName?: string;
    countryRegion?: string;
    userRole?: string;           // 用户身份（USER_ROLES 的 name），选填
    businessStage?: string;       // 当前业务阶段（BUSINESS_STAGES 的 name），选填
    language?: string;            // 当前语言代码，用于返回对应语言的分析结果
  }
): Promise<AnalysisResult> {
  const productName = options?.productName || productType;
  const categoryLevel1Name = options?.categoryLevel1Name || '';
  const categoryLevel2Name = options?.categoryLevel2Name || productName;
  const categoryContext = options?.categoryContext || '';
  const countryName = options?.countryName || '';
  const countryRegion = options?.countryRegion || '';
  const userRole = options?.userRole || '';
  const businessStage = options?.businessStage || '';
  const language = options?.language || 'zh';

  const hasUserContext = Boolean(userRole || businessStage);
  const userContextBlock = hasUserContext
    ? `
【用户身份与阶段】（请据此调整分析深度与下一步建议的针对性）
- 用户身份：${userRole || '未选择'}
- 当前业务阶段：${businessStage || '未选择'}
`
    : '';

  const productAndAudienceBlock = categoryContext
    ? `【重要：请严格按以下品类与目标人群分析，勿与其他品类混淆】
- 品类与目标人群说明：${categoryContext}
- 一级分类：${categoryLevel1Name}
- 二级分类：${categoryLevel2Name}
- 分析对象简称：${productName}`
    : `- 产品类型/二级分类：${productName}
${categoryLevel1Name ? `- 一级分类：${categoryLevel1Name}` : ''}`;

  let prompt = '';

  if (mode === 'sell-to-china') {
    // 卖到中国模式：分析进口可行性 - 针对特定区域
    prompt = `你是一位专业的国际贸易咨询顾问，专注于帮助海外产品进入中国市场。请基于以下详细信息提供一个全面的AI分析。

${productAndAudienceBlock}
${userContextBlock}

【用户选择的其他关键信息】
- 目标销售区域: ${targetRegion}
${countryRegion ? `- 产品来源地区: ${countryRegion}` : ''}

【请提供以下分析（用JSON格式返回）】
{
  "marketDemand": {
    "overall": "该类产品在中国整体市场需求分析（1-2句话）",
    "regional": "针对${targetRegion}区域的定制市场需求分析，包括该区域消费特点",
    "targetCustomers": "目标客户群体描述，如年龄、收入、消费习惯",
    "growthTrend": "市场增长趋势预测"
  },
  "competition": {
    "level": "竞争程度（低/中/高）",
    "mainCompetitors": ["主要竞争对手1", "主要竞争对手2", "主要竞争对手3"],
    "differentiation": "差异化建议：如何在这个区域市场中脱颖而出"
  },
  "pricing": {
    "recommendedRange": "建议售价范围（人民币）",
    "costBreakdown": "成本构成说明（进货成本、物流、关税、渠道费用等）",
    "margin": "利润空间预估"
  },
  "timeline": {
    "import": "进口清关预估周期",
    "marketEntry": "市场进入完成预估周期",
    "roi": "投资回报预估周期"
  },
  "challenges": {
    "level": "整体风险等级（低/中/高）",
    "mainRisks": ["主要风险点1", "主要风险点2", "主要风险点3"],
    "mitigation": ["风险应对建议1", "风险应对建议2", "风险应对建议3"]
  },
  "compliance": {
    "certifications": ["必需资质证书1", "必需资质证书2", "必需资质证书3"],
    "labeling": ["标签要求1", "标签要求2"],
    "testing": ["检测要求1", "检测要求2"]
  },
  "actionPlan": {
    "nextSteps": ["下一步行动1", "下一步行动2", "下一步行动3"],
    "priority": "优先级建议（立即行动/观望/需要更多调研）",
    "keySuccessFactors": ["成功关键因素1", "成功关键因素2", "成功关键因素3"]
  }
}

请用中文回复，只返回JSON，不要其他内容。`;
  } else {
    // 采购模式：分析采购选品建议 - 针对特定国家和区域
    prompt = `你是一位专业的海外采购咨询顾问，专注于帮助中国采购商从海外采购优质产品。请基于以下详细信息提供一个全面的AI分析。

${productAndAudienceBlock}
${userContextBlock}

【用户选择的其他关键信息】
- 采购来源地区: ${originRegion || targetRegion}
${countryName ? `- 采购目标国家: ${countryName}` : ''}

【请提供以下分析（用JSON格式返回）】
{
  "marketDemand": {
    "overall": "${countryName || originRegion || targetRegion}地区该品类整体采购热度分析",
    "regional": "针对该地区市场的特色产品和采购优势分析",
    "targetCustomers": "适用场景和目标客户群体",
    "growthTrend": "采购趋势预测"
  },
  "competition": {
    "level": "采购竞争程度（低/中/高）",
    "mainCompetitors": ["主要竞争采购商类型1", "主要竞争采购商类型2"],
    "differentiation": "差异化建议：如何获得更好的采购价格和条件"
  },
  "pricing": {
    "recommendedRange": "参考采购价格区间（人民币或美元）",
    "costBreakdown": "成本构成（产品成本、国际物流、关税、仓储等）",
    "margin": "预计利润空间"
  },
  "timeline": {
    "import": "采购到货预估周期",
    "marketEntry": "完成首批采购预估时间",
    "roi": "资金回笼预估周期"
  },
  "challenges": {
    "level": "整体采购风险等级（低/中/高）",
    "mainRisks": ["主要采购挑战1", "主要采购挑战2", "主要采购挑战3"],
    "mitigation": ["应对建议1", "应对建议2", "应对建议3"]
  },
  "compliance": {
    "certifications": ["进口合规资质1", "进口合规资质2", "进口合规资质3"],
    "labeling": ["中文标签要求1", "中文标签要求2"],
    "testing": ["检测要求1", "检测要求2"]
  },
  "actionPlan": {
    "nextSteps": ["下一步行动1", "下一步行动2", "下一步行动3"],
    "priority": "优先级建议",
    "keySuccessFactors": ["成功关键因素1", "成功关键因素2", "成功关键因素3"]
  }
}

请用中文回复，只返回JSON，不要其他内容。`;
  }

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的国际贸易咨询顾问，擅长分析海外产品进入中国市场的可行性，以及海外采购选品策略。你的分析必须严格基于用户选择的具体选项：包括一级分类、二级分类、以及「品类与目标人群说明」。若说明中明确目标人群为老年人/银发族，则整篇分析须针对老年市场、适老产品，不得与母婴、儿童等其它品类混淆。若用户提供了「用户身份」或「当前业务阶段」，请据此调整：身份决定建议的深度与角度（如品牌方侧重合规与品牌落地，贸易商侧重供应链与利润），阶段决定侧重点（调研期侧重可行性与风险，准备首次进口侧重流程与时间表，已有经验侧重拓展与优化）。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // 解析JSON响应
    try {
      // 尝试提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        // 添加联系我们信息
        result.contactUs = getContactUsContent(language);
        return result;
      }
      throw new Error('No JSON found');
    } catch {
      // 如果JSON解析失败，返回默认数据
      return getDefaultAnalysis(productType, targetRegion, mode, options);
    }
  } catch (error) {
    console.error('DeepSeek API 错误:', error);
    // 返回基于规则的默认分析
    return getDefaultAnalysis(productType, targetRegion, mode, options);
  }
}

// 获取基于规则的默认分析（支持双模式）- 重新设计以匹配新接口
function getDefaultAnalysis(
  productType: string, 
  region: string, 
  mode: AnalysisMode,
  options?: {
    productName?: string;
    countryName?: string;
    countryRegion?: string;
    language?: string;
  }
): AnalysisResult {
  const productName = options?.productName || productType;
  const countryName = options?.countryName || '';
  const countryRegion = options?.countryRegion || '';
  
  // 中国区域消费特征
  const chinaRegionProfiles: Record<string, any> = {
    'east-china': {
      name: '华东地区',
      consumption: '消费能力强，追求品质生活，对进口商品认可度高',
      channels: '上海为核心的高端商超、跨境电商发达',
      price: '接受较高价位，200-800元区间畅销'
    },
    'south-china': {
      name: '华南地区', 
      consumption: '消费开放度高，接受新品牌，渠道多元化',
      channels: '广东为核心的进出口贸易、直播电商活跃',
      price: '价格敏感度中等，150-500元区间主流'
    },
    'north-china': {
      name: '华北地区',
      consumption: '重视品牌知名度，高端消费市场成熟',
      channels: '北京天津为核心百货渠道，社群营销发达',
      price: '品牌溢价接受度高，300-1000元区间'
    },
    'southwest': {
      name: '西南地区',
      consumption: '新兴消费市场，增长潜力大，接受新事物',
      channels: '成都重庆为核心新兴商圈，电商下沉市场活跃',
      price: '性价比导向，100-400元区间'
    },
    'national': {
      name: '全国范围',
      consumption: '多元化消费市场，一二线城市高端，三四线性价比',
      channels: '全渠道布局，线上线下结合',
      price: '全价格带覆盖'
    }
  };
  
  // 产品特征映射
  const productProfiles: Record<string, any> = {
    supplement: {
      cnName: '保健食品',
      market: '健康意识提升，保健品市场需求持续增长，尤其注重功能性产品',
      competition: '高',
      priceRange: '200-800元',
      timeline: '6-9个月',
      challenges: ['蓝帽子认证周期长', '成分合规审查严格', '功效宣传规范限制多'],
      compliance: ['保健食品注册证书', '境外生产资质认证', '进口许可批件'],
      risk: '高',
      margin: '30%-50%',
      certifications: ['蓝帽子标识', '境外生产工厂GMP认证', '产品成分检测报告'],
      timelineDetails: { import: '30-45天', marketEntry: '6-9个月', roi: '12-18个月' }
    },
    herbal: {
      cnName: '传统草药',
      market: '传统养生理念复兴，草本植物提取物产品受欢迎',
      competition: '中',
      priceRange: '150-500元',
      timeline: '4-7个月',
      challenges: ['药食同源资质认定', '成分检测标准', '质量标准一致性'],
      compliance: ['境外生产资质', '进口许可', '成分检验报告'],
      risk: '中',
      margin: '40%-60%',
      certifications: ['境外生产资质证明', '植物来源认证', '成分COA报告'],
      timelineDetails: { import: '20-35天', marketEntry: '4-7个月', roi: '9-12个月' }
    },
    cosmetics: {
      cnName: '化妆品',
      market: '中国美妆市场规模庞大，对高端进口产品需求持续增长',
      competition: '高',
      priceRange: '200-1000元',
      timeline: '3-6个月',
      challenges: ['动物测试要求', '中文标签规范', '功效宣称备案'],
      compliance: ['进口特殊化妆品批件', '非特备案凭证', '中文标签设计'],
      risk: '中',
      margin: '50%-80%',
      certifications: ['进口特殊化妆品批件', '产品配方备案', '安全性评估报告'],
      timelineDetails: { import: '15-30天', marketEntry: '3-6个月', roi: '6-12个月' }
    },
    food: {
      cnName: '普通食品',
      market: '中国食品市场需求旺盛，消费者对高品质进口食品兴趣浓厚',
      competition: '中',
      priceRange: '50-300元',
      timeline: '2-4个月',
      challenges: ['中文标签规范', '检验检疫流程', '保质期管理'],
      compliance: ['进口食品检验检疫', '中文营养成分标签', '原产地证明'],
      risk: '低',
      margin: '20%-35%',
      certifications: ['进口食品检验检疫证书', '原产地证书', '营养成分检测报告'],
      timelineDetails: { import: '7-15天', marketEntry: '2-4个月', roi: '6-9个月' }
    },
    // 银发经济相关
    elderly_health: {
      cnName: '老年保健',
      market: '老龄化加速，银发族健康产品需求旺盛',
      competition: '中',
      priceRange: '200-600元',
      timeline: '5-8个月',
      challenges: ['蓝帽子认证', '功效宣传规范', '渠道特殊性'],
      compliance: ['保健食品注册证书', '老年食品资质', '安全性报告'],
      risk: '中',
      margin: '35%-55%',
      certifications: ['蓝帽子标识', '适宜人群说明', '产品安全检测'],
      timelineDetails: { import: '25-40天', marketEntry: '5-8个月', roi: '10-15个月' }
    },
    elderly_food: {
      cnName: '适老食品',
      market: '吞咽困难、营养补充类老年食品需求增长',
      competition: '低',
      priceRange: '80-300元',
      timeline: '3-6个月',
      challenges: ['产品适应性', '标准认定', '渠道开发'],
      compliance: ['老年食品标准', '营养成分标签', '生产资质'],
      risk: '低',
      margin: '25%-40%',
      certifications: ['老年食品资质', '营养成分检测', '产品适应性报告'],
      timelineDetails: { import: '15-25天', marketEntry: '3-6个月', roi: '8-12个月' }
    },
    care_products: {
      cnName: '护理用品',
      market: '失禁护理、康复辅助类用品需求增加',
      competition: '中',
      priceRange: '100-500元',
      timeline: '4-7个月',
      challenges: ['医疗器械资质', '产品标准', '渠道特殊性'],
      compliance: ['一类/二类医疗器械备案', '产品检测报告', '中文说明书'],
      risk: '中',
      margin: '30%-50%',
      certifications: ['医疗器械备案凭证', '产品检测报告', '质量管理体系认证'],
      timelineDetails: { import: '20-35天', marketEntry: '4-7个月', roi: '9-14个月' }
    },
    health_monitor: {
      cnName: '健康监测',
      market: '家用健康监测设备需求上升，年轻送礼市场活跃',
      competition: '高',
      priceRange: '200-1000元',
      timeline: '4-8个月',
      challenges: ['医疗器械注册', '认证周期', '售后体系'],
      compliance: ['二类医疗器械注册证', '产品检测报告', 'EMC电磁兼容测试'],
      risk: '中',
      margin: '40%-70%',
      certifications: ['医疗器械注册证', '产品检测报告', '产品技术要求'],
      timelineDetails: { import: '20-40天', marketEntry: '4-8个月', roi: '10-18个月' }
    },
    elderly_devices: {
      cnName: '适老器械',
      market: '助行器、康复器材需求随老龄化增长',
      competition: '中',
      priceRange: '150-800元',
      timeline: '5-8个月',
      challenges: ['医疗器械资质', '产品适配性', '使用培训'],
      compliance: ['一类医疗器械备案', '产品检测报告', '中文说明书'],
      risk: '中',
      margin: '35%-55%',
      certifications: ['医疗器械备案凭证', '产品检测报告', '使用说明书'],
      timelineDetails: { import: '20-35天', marketEntry: '5-8个月', roi: '10-15个月' }
    }
  };

  // 采购来源地区特征
  const sourcingRegionProfiles: Record<string, any> = {
    'east-asia': {
      name: '东亚',
      advantages: '地理临近、物流便捷、文化相近，日本韩国产品在中国口碑好',
      hotProducts: '日本药妆、韩国护肤品、日韩健康食品',
      competition: '高',
      priceRange: '80-500元',
      timeline: '7-15天'
    },
    'southeast-asia': {
      name: '东南亚',
      advantages: '成本优势、热带特产、准入门槛相对低',
      hotProducts: '热带水果干、燕窝、咖啡、橡胶制品',
      competition: '中',
      priceRange: '30-200元',
      timeline: '10-20天'
    },
    'oceania': {
      name: '大洋洲',
      advantages: '纯净天然形象、质检标准高、消费者信赖',
      hotProducts: '澳洲保健品、奶粉、肉类、乳制品',
      competition: '中',
      priceRange: '100-400元',
      timeline: '15-25天'
    },
    'europe': {
      name: '欧洲',
      advantages: '品牌溢价高、质量标准严苛、高端市场定位',
      hotProducts: '德国保健品、法国美妆、意大利食品、北欧设计品',
      competition: '高',
      priceRange: '150-800元',
      timeline: '20-35天'
    },
    'north-america': {
      name: '北美',
      advantages: '科技含量高、创新产品多、大品牌背书',
      hotProducts: '美国保健品、智能家居、加拿大农产品',
      competition: '高',
      priceRange: '100-600元',
      timeline: '15-30天'
    },
    'middleeast': {
      name: '中东',
      advantages: '特色产品、 luxury定位、市场相对蓝海',
      hotProducts: '波斯地毯、精油、阿拉伯特色食品',
      competition: '低',
      priceRange: '200-1000元',
      timeline: '25-40天'
    }
  };
  
  // 采购国家特征
  const countryProfiles: Record<string, any> = {
    japan: { name: '日本', features: '品质精细、匠人精神、技术领先', popular: '汉方保健品、药妆、美容仪' },
    korea: { name: '韩国', features: '时尚潮流、更新迭代快、性价比', popular: '化妆品、护肤品、小家电' },
    australia: { name: '澳大利亚', features: '纯净天然、质量严格、形象高端', popular: '保健品、奶粉、绵羊油' },
    newzealand: { name: '新西兰', features: '纯净无污染、质检严格、绿色有机', popular: '蜂蜜、奶粉、保健品' },
    usa: { name: '美国', features: '科技领先、品牌强大、创新产品多', popular: '维生素、运动补剂、智能设备' },
    europe: { name: '欧洲', features: '工艺精湛、品质高端、设计独特', popular: '高端美妆、厨具、保健品' },
    southeast: { name: '东南亚', features: '成本低、热带特产、准入易', popular: '水果干、咖啡、工艺品' },
    canada: { name: '加拿大', features: '质量严苛、自然资源丰富', popular: '冰酒、保健品、农产品' },
    germany: { name: '德国', features: '品质严谨、技术领先、性价比高', popular: '保健品、厨具、婴幼儿产品' },
    france: { name: '法国', features: '奢华时尚、品牌价值高、精致生活', popular: '高端美妆、香水、奢侈品' }
  };

  // 卖到中国模式
  if (mode === 'sell-to-china') {
    const profile = productProfiles[productType] || productProfiles.food;
    const regionProfile = chinaRegionProfiles[region] || chinaRegionProfiles['national'];
    
    return {
      marketDemand: {
        overall: profile.market,
        regional: `${regionProfile.name}是该产品的重要销售区域。${regionProfile.consumption}。${regionProfile.channels}为主要销售渠道。`,
        targetCustomers: `以${regionProfile.name}当地消费者为主，注重${regionProfile.price}价格带产品`,
        growthTrend: '随着消费升级和进口商品认可度提升，市场需求持续增长'
      },
      competition: {
        level: profile.competition,
        mainCompetitors: profile.competition === '高' 
          ? ['国际知名品牌', '国内头部品牌', '跨境电商热门产品']
          : ['区域品牌', '同类进口产品', '国内替代品'],
        differentiation: `建议突出${profile.cnName}的原产地优势和差异化功效定位`
      },
      pricing: {
        recommendedRange: `${profile.priceRange}（${regionProfile.name}建议售价）`,
        costBreakdown: '产品成本40% + 国际物流8% + 关税及税费12% + 渠道费用25% + 利润15%',
        margin: profile.margin
      },
      timeline: profile.timelineDetails,
      challenges: {
        level: profile.risk,
        mainRisks: profile.challenges,
        mitigation: [
          '提前准备认证材料，委托专业机构办理',
          '选择有经验的清关代理',
          '建立合规的的功效宣称体系'
        ]
      },
      compliance: {
        certifications: profile.certifications,
        labeling: ['产品中文名称', '成分表（中文）', '原产地标识', '生产日期和保质期'],
        testing: ['产品成分检测', '安全性评估', '功效成分含量检测']
      },
      actionPlan: {
        nextSteps: [
          '确定产品定位和目标渠道',
          '准备进口资质和认证材料',
          '选择清关代理和物流方案',
          '制定市场推广策略'
        ],
        priority: profile.risk === '高' ? '需要充分准备，建议观望' : '可以立即行动',
        keySuccessFactors: [
          '产品差异化定位',
          '合规资质完备',
          '稳定供应链',
          '合适渠道伙伴'
        ]
      },
      contactUs: getContactUsContent(options?.language || 'zh')
    };
  } 
  // 采购模式
  else {
    const profile = productProfiles[productType] || productProfiles.food;
    const regionProfile = sourcingRegionProfiles[region] || sourcingRegionProfiles['east-asia'];
    // 只有当 countryName 确实在 countryProfiles 中时才能用 countryProfile，否则 fallback 到 regionProfile
    const countryProfile = countryName && countryProfiles[countryName] ? countryProfiles[countryName] : null;
    
    const overallMarketDesc = countryProfile
      ? `${countryProfile.name}地区的${profile.cnName}产品具有${countryProfile.features}特点，${countryProfile.popular}等产品在中国市场热销`
      : `${regionProfile.name}地区热门采购产品：${regionProfile.hotProducts}`;
    
    return {
      marketDemand: {
        overall: overallMarketDesc,
        regional: `${regionProfile.advantages}，是采购${profile.cnName}类产品的优质来源地`,
        targetCustomers: '中国跨境电商卖家、直播带货商家、进口商超采购',
        growthTrend: '随着跨境电商政策利好和消费者对进口产品需求增加，采购热度持续上升'
      },
      competition: {
        level: regionProfile.competition,
        mainCompetitors: [
          '大型跨境电商平台自采',
          '专业采购代购团队',
          '其他中小采购商'
        ],
        differentiation: '建立稳定的供应商关系，寻找差异化产品，提升采购效率'
      },
      pricing: {
        recommendedRange: regionProfile.priceRange,
        costBreakdown: '产品成本约60% + 国际物流10% + 关税税费15% + 仓储周转10% + 利润5-15%',
        margin: profile.margin
      },
      timeline: {
        import: regionProfile.timeline,
        marketEntry: `完成首批采购到上架约${parseInt(regionProfile.timeline) + 5}-${parseInt(regionProfile.timeline) + 15}天`,
        roi: '首批资金回笼约2-3个月'
      },
      challenges: {
        level: profile.risk,
        mainRisks: [
          '供应商真假辨别',
          '产品库存和补货周期',
          '国际物流时效和风险',
          '汇率波动影响'
        ],
        mitigation: [
          '实地考察或委托验厂',
          '建立安全库存机制',
          '选择稳定物流渠道',
          '锁定汇率或合理定价'
        ]
      },
      compliance: {
        certifications: [
          '原产地证明',
          '产品质检报告(COA)',
          '进口食品/保健品备案'
        ],
        labeling: ['中文营养成分标签', '产品中文说明书', '原产地标识'],
        testing: ['产品成分检测', '微生物检测', '重金属检测']
      },
      actionPlan: {
        nextSteps: [
          '筛选和验证供应商资质',
          '获取产品样品进行检测',
          '洽谈合作条款和价格',
          '安排试采购和物流'
        ],
        priority: '建议小批量试采购验证市场',
        keySuccessFactors: [
          '可靠的供应商关系',
          '产品品质把控',
          '物流效率',
          '市场定位准确'
        ]
      },
      contactUs: getContactUsContent(options?.language || 'zh')
    };
  }
}
export const PRODUCT_TYPES = [
  { id: 'supplement', name: '保健食品', nameEn: 'Health Supplements', icon: '💊' },
  { id: 'herbal', name: '传统草药', nameEn: 'Traditional Herbal Medicine', icon: '🌿' },
  { id: 'cosmetics', name: '化妆品', nameEn: 'Cosmetics', icon: '✨' },
  { id: 'food', name: '普通食品', nameEn: 'Food & Beverage', icon: '🍎' },
];

// 商品分类：二级/三级菜单结构（一级 -> 二级 [-> 三级]）
export interface ProductCategoryLevel2 {
  id: string;
  name: string;
  /** 若存在则为三级，否则为叶子，id 作为 productType 传给 API */
  children?: Array<{ id: string; name: string }>;
}
export interface ProductCategoryLevel1 {
  id: string;
  name: string;
  icon: string;
  children: ProductCategoryLevel2[];
}

export const PRODUCT_CATEGORIES: ProductCategoryLevel1[] = [
  {
    id: 'supplement',
    name: '保健食品',
    icon: '💊',
    children: [
      { id: 'supplement', name: '膳食补充剂' },
      { id: 'supplement_nutrition', name: '营养品' },
      { id: 'supplement_vitamin', name: '维生素/矿物质' },
    ],
  },
  {
    id: 'herbal',
    name: '传统草药',
    icon: '🌿',
    children: [
      { id: 'herbal', name: '植物提取/药食同源' },
      { id: 'herbal_traditional', name: '中成药/汉方' },
      { id: 'herbal_tea', name: '草本茶/养生茶' },
    ],
  },
  {
    id: 'cosmetics',
    name: '化妆品',
    icon: '✨',
    children: [
      { id: 'cosmetics', name: '护肤' },
      { id: 'cosmetics_makeup', name: '彩妆' },
      { id: 'cosmetics_personal', name: '个护/洗护' },
    ],
  },
  {
    id: 'food',
    name: '普通食品',
    icon: '🍎',
    children: [
      { id: 'food', name: '休闲食品/零食' },
      { id: 'food_dairy', name: '乳品/饮料' },
      { id: 'food_grain', name: '粮油/调味' },
    ],
  },
  {
    id: 'silver',
    name: '银发经济相关',
    icon: '👴',
    children: [
      { id: 'elderly_health', name: '老年保健' },
      { id: 'elderly_food', name: '适老食品' },
      { id: 'care_products', name: '护理用品' },
      { id: 'health_monitor', name: '健康监测' },
      { id: 'elderly_devices', name: '适老器械' },
    ],
  },
];

/** 从分类树中解析出当前选中的叶子 productType id */
export function getProductTypeFromCategory(
  level1Id: string,
  level2Id: string,
  level3Id?: string
): string {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === level1Id);
  if (!cat) return 'food';
  const l2 = cat.children.find((c) => c.id === level2Id);
  if (!l2) return cat.children[0]?.id || 'food';
  if (l2.children && level3Id) {
    const l3 = l2.children.find((c) => c.id === level3Id);
    return l3?.id ?? l2.id;
  }
  return l2.id;
}

/**
 * 为 AI 生成「商品分类与目标人群」的明确上下文，避免歧义（如银发经济下的「护理用品」指老年护理，非母婴）。
 */
export function getCategoryContextForAI(level1Id: string, level2Id: string): string {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === level1Id);
  const l2 = cat?.children.find((c) => c.id === level2Id);
  const level1Name = cat?.name ?? '';
  const level2Name = l2?.name ?? '';

  // 银发经济相关：明确目标人群为老年人，且子类均指老年/适老产品
  if (level1Id === 'silver') {
    const silverClarify: Record<string, string> = {
      elderly_health: '老年保健产品（如中老年营养补充、关节养护等）',
      elderly_food: '适老食品（如吞咽困难食品、老年营养配方等）',
      care_products: '老年护理用品（如失禁护理、压疮护理、康复辅助等），非母婴护理用品',
      health_monitor: '老年健康监测设备（如血压仪、血糖仪、跌倒监测等）',
      elderly_devices: '适老器械（如助行器、轮椅、康复器材等）',
    };
    const subDesc = silverClarify[level2Id] || level2Name;
    return `一级分类为「${level1Name}」，目标人群为老年人/银发族。二级分类「${level2Name}」在此特指：${subDesc}。请严格按老年市场、适老产品分析，勿与母婴、儿童品类混淆。`;
  }

  // 其他一级分类的简短说明
  const contextByLevel1: Record<string, string> = {
    supplement: `一级分类「${level1Name}」，二级「${level2Name}」，目标用户为关注健康的成人。`,
    herbal: `一级分类「${level1Name}」，二级「${level2Name}」，为传统草药/汉方/药食同源类产品。`,
    cosmetics: `一级分类「${level1Name}」，二级「${level2Name}」，为护肤/彩妆/个护类产品。`,
    food: `一级分类「${level1Name}」，二级「${level2Name}」，为普通食品与饮料。`,
  };
  return contextByLevel1[level1Id] ?? `商品分类：${level1Name} > ${level2Name}。`;
}

// 来源国按产品类型分组
export const ORIGIN_COUNTRIES_BY_PRODUCT: Record<string, Array<{ id: string; name: string; flag: string; priority?: 'high' | 'normal' }>> = {
  supplement: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'australia', name: '澳大利亚', flag: '🇦🇺', priority: 'high' },
    { id: 'newzealand', name: '新西兰', flag: '🇳🇿', priority: 'high' },
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'normal' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'normal' },
    { id: 'canada', name: '加拿大', flag: '🇨🇦', priority: 'normal' },
  ],
  herbal: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'korea', name: '韩国', flag: '🇰🇷', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'normal' },
    { id: 'southeast', name: '东南亚', flag: '🌏', priority: 'normal' },
  ],
  cosmetics: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'korea', name: '韩国', flag: '🇰🇷', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'normal' },
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'normal' },
    { id: 'australia', name: '澳大利亚', flag: '🇦🇺', priority: 'normal' },
  ],
  food: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'high' },
    { id: 'southeast', name: '东南亚', flag: '🌏', priority: 'normal' },
    { id: 'australia', name: '澳大利亚', flag: '🇦🇺', priority: 'normal' },
    { id: 'korea', name: '韩国', flag: '🇰🇷', priority: 'normal' },
    { id: 'newzealand', name: '新西兰', flag: '🇳🇿', priority: 'normal' },
  ],
  // 银发经济相关沿用保健/食品/器械常用来源国
  elderly_health: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'australia', name: '澳大利亚', flag: '🇦🇺', priority: 'high' },
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'normal' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'normal' },
    { id: 'korea', name: '韩国', flag: '🇰🇷', priority: 'normal' },
  ],
  elderly_food: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'high' },
    { id: 'australia', name: '澳大利亚', flag: '🇦🇺', priority: 'normal' },
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'normal' },
  ],
  care_products: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'high' },
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'normal' },
    { id: 'korea', name: '韩国', flag: '🇰🇷', priority: 'normal' },
  ],
  health_monitor: [
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'high' },
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'normal' },
    { id: 'korea', name: '韩国', flag: '🇰🇷', priority: 'normal' },
  ],
  elderly_devices: [
    { id: 'japan', name: '日本', flag: '🇯🇵', priority: 'high' },
    { id: 'europe', name: '欧洲', flag: '🇪🇺', priority: 'high' },
    { id: 'usa', name: '美国', flag: '🇺🇸', priority: 'normal' },
  ],
};

// 产品类型 -> 用于查询来源国的键（子类沿用一级类）
const PRODUCT_TO_ORIGIN_KEY: Record<string, string> = {
  supplement_nutrition: 'supplement',
  supplement_vitamin: 'supplement',
  herbal_traditional: 'herbal',
  herbal_tea: 'herbal',
  cosmetics_makeup: 'cosmetics',
  cosmetics_personal: 'cosmetics',
  food_dairy: 'food',
  food_grain: 'food',
};

// 获取指定产品类型对应的来源国列表
export const getOriginCountriesByProduct = (productId: string) => {
  const key = PRODUCT_TO_ORIGIN_KEY[productId] || productId;
  return ORIGIN_COUNTRIES_BY_PRODUCT[key] || ORIGIN_COUNTRIES_BY_PRODUCT.food;
};

// 预定义的来源国选项 (备用)
export const ORIGIN_COUNTRIES = [
  { id: 'japan', name: '日本', flag: '🇯🇵' },
  { id: 'europe', name: '欧洲', flag: '🇪🇺' },
  { id: 'usa', name: '美国', flag: '🇺🇸' },
  { id: 'australia', name: '澳大利亚', flag: '🇦🇺' },
  { id: 'southeast', name: '东南亚', flag: '🌏' },
  { id: 'korea', name: '韩国', flag: '🇰🇷' },
  { id: 'newzealand', name: '新西兰', flag: '🇳🇿' },
  { id: 'canada', name: '加拿大', flag: '🇨🇦' },
  { id: 'middleeast', name: '中东', flag: '🏜️' },
];

// 市场分类：简化为地理区域（更符合跨境贸易决策逻辑）
export const MARKET_REGIONS = [
  { id: 'east-asia', name: '东亚', icon: '🎌', flag: '🇯🇵' },
  { id: 'southeast-asia', name: '东南亚', icon: '🌏', flag: '🌏' },
  { id: 'oceania', name: '大洋洲', icon: '🦘', flag: '🇦🇺' },
  { id: 'europe', name: '欧洲', icon: '🇪🇺', flag: '🇪🇺' },
  { id: 'north-america', name: '北美', icon: '🌎', flag: '🇺🇸' },
  { id: 'middleeast', name: '中东', icon: '🏜️', flag: '🏜️' },
];

// 按区域显示的目标市场（region -> countries）
export const MARKETS_BY_REGION: Record<string, Array<{ id: string; name: string; flag: string; tag?: string }>> = {
  'east-asia': [
    { id: 'japan', name: '日本', flag: '🇯🇵', tag: '热门' },
    { id: 'korea', name: '韩国', flag: '🇰🇷' },
  ],
  'southeast-asia': [
    { id: 'thailand', name: '泰国', flag: '🇹🇭' },
    { id: 'vietnam', name: '越南', flag: '🇻🇳' },
    { id: 'indonesia', name: '印度尼西亚', flag: '🇮🇩' },
    { id: 'malaysia', name: '马来西亚', flag: '🇲🇾' },
    { id: 'singapore', name: '新加坡', flag: '🇸🇬' },
    { id: 'philippines', name: '菲律宾', flag: '🇵🇭' },
  ],
  'oceania': [
    { id: 'australia', name: '澳大利亚', flag: '🇦🇺', tag: '热门' },
    { id: 'newzealand', name: '新西兰', flag: '🇳🇿' },
  ],
  'europe': [
    { id: 'germany', name: '德国', flag: '🇩🇪' },
    { id: 'france', name: '法国', flag: '🇫🇷' },
    { id: 'uk', name: '英国', flag: '🇬🇧' },
    { id: 'italy', name: '意大利', flag: '🇮🇹' },
    { id: 'spain', name: '西班牙', flag: '🇪🇸' },
    { id: 'netherlands', name: '荷兰', flag: '🇳🇱' },
  ],
  'north-america': [
    { id: 'usa', name: '美国', flag: '🇺🇸', tag: '热门' },
    { id: 'canada', name: '加拿大', flag: '🇨🇦' },
  ],
  'middleeast': [
    { id: 'uae', name: '阿联酋', flag: '🇦🇪' },
    { id: 'saudi', name: '沙特阿拉伯', flag: '🇸🇦' },
    { id: 'qatar', name: '卡塔尔', flag: '🇶🇦' },
  ],
};

// 兼容旧接口
export const MARKET_CATEGORIES = MARKET_REGIONS;
export const MARKETS_BY_CATEGORY = MARKETS_BY_REGION;
export const getMarketsByCategory = (regionId: string) => {
  return MARKETS_BY_REGION[regionId] || MARKETS_BY_REGION['east-asia'];
};
// 新接口：按区域获取市场列表
export const getMarketsByRegion = (regionId: string) => {
  return MARKETS_BY_REGION[regionId] || MARKETS_BY_REGION['east-asia'];
};
