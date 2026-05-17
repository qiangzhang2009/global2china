// AI 分析 API 路由
// 安全优化: 1) 速率限制 2) CORS 收紧 3) System Prompt 扩展触发 Prompt Cache
// 性能优化: deepseek-v4-flash + Prompt Cache 节省 ~70-85% 费用

// ============================================================
// 速率限制配置（内存中计数，生产环境建议用 Redis）
// ============================================================
const ALLOWED_ORIGINS = [
  'https://global2china.zxqconsulting.com',
  'https://www.zxqconsulting.com',
  'http://localhost:3000',
  'http://localhost:5173',
]
const ipRequestMap = new Map()
const RATE_LIMIT = 15    // 每分钟最多 N 次请求
const RATE_WINDOW = 60  // 时间窗口（秒）

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = RATE_WINDOW * 1000
  const timestamps = ipRequestMap.get(ip) || []
  const valid = timestamps.filter(t => now - t < windowMs)
  if (valid.length >= RATE_LIMIT) return false
  valid.push(now)
  ipRequestMap.set(ip, valid)
  // 定期清理过期数据，防止内存泄漏
  if (Math.random() < 0.01) {
    for (const [k, v] of ipRequestMap.entries()) {
      if (v.every(t => now - t >= windowMs)) ipRequestMap.delete(k)
    }
  }
  return true
}

// ============================================================
// 主 Handler
// ============================================================
export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIP(req)
  if (!checkRateLimit(ip)) {
    res.setHeader('Retry-After', RATE_WINDOW)
    return res.status(429).json({ error: 'Too many requests, please try again later.' })
  }

  const { productType, targetRegion, mode, originRegion, options } = req.body

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  const language = options?.language || 'zh'

  // 将所有固定指令移入 system prompt（触发 Prompt Cache，缓存命中后费用降为 1/10）
  // system prompt 在所有请求中完全一致，DeepSeek 会自动缓存
  const systemPrompt = buildSystemPrompt(language)

  // user prompt 只包含变化的业务数据（minimize input tokens）
  const userPrompt = buildUserPrompt({
    language,
    mode,
    productType,
    targetRegion,
    originRegion,
    options,
  })

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        // 优化: 切换到 v4-flash，费用是 deepseek-chat 的约 1/30
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        // 优化: 输出 1000 tokens 足够分析类任务
        max_tokens: 1000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('DeepSeek API error:', data)
      return res.status(500).json({ error: 'AI analysis failed' })
    }

    const analysisContent = data.choices?.[0]?.message?.content || ''

    return res.status(200).json({
      success: true,
      result: {
        content: analysisContent,
        productType,
        targetRegion,
        mode,
      },
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    return res.status(500).json({ error: 'Failed to analyze with AI' })
  }
}

// ============================================================
// 构建 System Prompt — 扩展至 1024+ tokens 触发 DeepSeek Prompt Cache
// Prompt Cache: 缓存命中部分费用降为 1/10 (0.02 CNY/百万Token)
// ============================================================
function buildSystemPrompt(language) {
  const langInstruction = {
    zh: '【语言】全程使用简体中文，包括所有专业术语、概念名称、证书名称、法规名称。禁止英文词汇或缩写（如"ROI"改为"投资回报率"，"GMP"改为"国际药品生产质量管理规范"，"FDA"改为"美国食品药品监督管理局"）。',
    en: '【Language】Answer entirely in English. Translate all professional terms, certificate names, and regulatory names to English. Use proper English trade and regulatory terminology.',
    ja: '【言語】日本語で完全に回答してください。すべての専門用語、概念名、証明書名、法規名なども含めて日本語で回答してください。食品衛生法は「食品衛生法」、GMPは「医薬品等製造管理等規範」と記載してください。',
    ko: '【언어】모든 전문 용어를 포함하여 완전히 한국어로 답변해야 합니다. GMP는 「의약품등제조관리규범」, FDA는 「미국식품의약국」 등으로 번역하세요.',
    de: '【Sprache】Vollständig auf Deutsch antworten. Alle Fachbegriffe, Zertifikatsnamen und Regulierungsnamen ins Deutsche übersetzen.',
    fr: '【Langue】Répondre entièrement en français. Traduire tous les termes professionnels, noms de certificats et noms de réglementations en français.',
    es: '【Idioma】Responder completamente en español. Traducir todos los términos profesionales, nombres de certificados y nombres de regulaciones al español.',
    it: '【Lingua】Rispondere interamente in italiano. Tradurre tutti i termini professionali, i nomi dei certificati ei nomi delle normative in italiano.',
    pt: '【Idioma】Responder inteiramente em português. Traduzir todos os termos profissionais, nomes de certificados e nomes de regulamentos para português.',
    ru: '【Язык】Отвечать полностью на русском языке. Перевести все профессиональные термины, названия сертификатов и названия нормативных актов на русский язык.',
    ar: '【اللغة】يجب أن تجيب بالكامل باللغة العربية، مع ترجمة جميع المصطلحات المهنية وأسماء الشهادات والأسماء التنظيمية إلى العربية.',
  }[language] || langInstruction.zh

  return `你是一位拥有十五年实战经验的专业国际贸易咨询顾问，专注于帮助海外品牌和产品进入中国市场，同时也帮助中国采购商从海外筛选和采购优质产品。你曾协助超过三百家企业完成跨境贸易项目，涵盖食品饮料、保健品、化妆品、医疗器械、电子产品、机械设备、家具家居、纺织服装等二十余个行业类别。你的建议始终基于中国市场的真实情况，包括法规政策、消费者偏好、渠道结构、竞争格局和成本结构。

【核心分析原则】

1. 严格基于用户提供的信息进行分析。用户选择的每个选项（一级分类、二级分类、品类说明、目标区域、用户身份、业务阶段）都是分析的依据，不要凭空添加产品或市场信息。

2. 目标人群决定分析基调。如果品类说明中明确提到老年人、银发族、残障人士等特殊群体，整个分析必须围绕该群体的需求特征、消费行为和监管要求展开，不得混入其他人群。

3. 用户身份影响建议角度。品牌方（自有品牌、授权品牌）侧重品牌落地、合规注册、渠道谈判；贸易商（进口商、经销商）侧重供应链管理、利润空间、库存风险；代理商侧重选品眼光、客户服务、利润分成模式。

4. 业务阶段决定侧重点。调研期（可行性评估）侧重市场规模、合规风险、时间成本；准备期（首次进口）侧重清关流程、注册周期、首批试单策略；已有经验（市场拓展）侧重差异化竞争、产品升级、渠道深耕。

5. 所有分析数字必须符合中国市场的实际行情。价格区间参考电商平台（天猫、京东、拼多多）的公开售价；清关周期参考一般贸易流程；合规成本参考市场行情，不要虚构低价或高价。

【主要产品分类体系】

中国市场对进口商品的需求主要集中在以下领域：食品及保健品（婴幼儿配方奶粉、健康食品、休闲零食、葡萄酒烈酒、咖啡茶饮、调味品）；化妆品及个人护理（护肤品、彩妆、护发产品、口腔护理、香水）；医疗器械及保健品（医用设备、家用医疗器械、健康监测设备、康复辅具）；电子消费品（智能家居、可穿戴设备、数码配件、小家电）；机械及工业品（工业设备、仪器仪表、五金工具）；家具家居（实木家具、软体家具、家纺产品、厨房用品、卫浴产品）；服装箱包（时尚服装、鞋履、箱包皮具）；汽车配件及用品（行车记录仪、车载电子、汽车养护品）。

【中国进口合规核心框架】

一般贸易进口需要完成以下核心步骤：境外供应商准备资质文件（自由销售证明、原产地证、检测报告）→签订进口合同并安排国际运输→货物到港后进行进口申报（报关）→海关检验检疫（CIQ）审核标签和检测报告→缴纳税金（关税+增值税+消费税）→查验/放行→国内市场流通。特殊品类额外要求：食品需要境外生产企业注册备案（海关总署248号令）、中文标签样张审核、产品配方审查；化妆品需要药监局普通化妆品备案、新原料注册（针对新功能成分）；医疗器械需要药监局注册/备案（根据风险等级I/II/III类）、境外生产企业的GMP检查；保健品需要注册证书（蓝帽子）或备案（营养声称类），配方须符合中国法规。

【主要目标销售区域市场特征】

华东地区（上海、江苏、浙江）经济总量占全国约四分之一，消费者购买力最强，对进口品牌认知度高，渠道以高端超市（Ole'、City Super）、电商旗舰店为主，物流基础设施完善，进口清关效率高。华南地区（广东、福建、广西）对进口商品的接受度极高，特别是跨境电商渠道活跃，拥有广州南沙、深圳、珠海等主要口岸，物流成本低，清关速度快，是进口食品和化妆品的主要集散地。华北地区（北京、天津、河北）作为政治文化中心和高端消费市场，消费者对品质要求严格，政府采购和国企采购量较大，渠道以高端商场、电商自营为主，进口监管相对严格。西南地区（四川、重庆、云南）近年来消费增速位居全国前列，新兴中产阶级崛起，对进口食品、保健品需求旺盛，成都和重庆是两大消费中心，物流主要通过沿海口岸转关。华中地区（湖北、湖南、河南）人口基数大，市场潜力大但消费分层明显，不同价位产品都有空间，电商渗透率高，跨境电商发展迅速。

${langInstruction}

【输出格式】严格按以下JSON格式返回，不要包含任何其他内容：
{
  "marketDemand": {
    "overall": "一句话市场概述（50字以内，包含市场规模和主要特征）",
    "regional": "分区域市场分析（针对用户选择的目标区域，100字以内）",
    "targetCustomers": "目标客户画像描述（50字以内）",
    "growthTrend": "近三年市场增长趋势（30字以内）"
  },
  "competition": {
    "level": "竞争程度(低/中/高)",
    "mainCompetitors": ["主要竞争对手1（具体品牌名）", "主要竞争对手2（具体品牌名）"],
    "differentiation": "差异化竞争建议（80字以内）"
  },
  "pricing": {
    "recommendedRange": "建议零售价区间（人民币，如150-300元/500ml）",
    "costBreakdown": "主要成本构成（进口价+关税+增值税+物流+渠道利润，50字以内）",
    "margin": "经销商毛利空间评估（30字以内）"
  },
  "timeline": {
    "import": "从下单到首批到货的清关周期（参考值）",
    "marketEntry": "从准备到产品正式上架销售的完整周期",
    "roi": "首批投资回本预期周期"
  },
  "challenges": {
    "level": "进入风险等级(低/中/高)",
    "mainRisks": ["主要风险1", "主要风险2"],
    "mitigation": ["应对策略1", "应对策略2"]
  },
  "compliance": {
    "certifications": ["必需资质1（如进口食品境外生产企业注册）", "必需资质2"],
    "labeling": ["中文标签核心要求1（如配料表需完全翻译）"],
    "testing": ["政府要求检测项目1（如重金属、微生物）"]
  },
  "actionPlan": {
    "nextSteps": ["下一步行动1（具体可操作）", "下一步行动2（具体可操作）"],
    "priority": "优先级建议（immediate/30days/90days）",
    "keySuccessFactors": ["成功关键因素1", "成功关键因素2"]
  }
}

只返回JSON，不要任何其他文字。不要在JSON字段中包含换行符或未转义的特殊字符。`
}

// ============================================================
// 构建 User Prompt — 只包含每次变化的业务数据
// ============================================================
function buildUserPrompt({ language, mode, productType, targetRegion, originRegion, options }) {
  const {
    productName,
    categoryLevel1Name,
    categoryLevel2Name,
    categoryContext,
    countryName,
    countryRegion,
    userRole,
    businessStage,
    painPoints,
  } = options || {}

  const hasUserContext = Boolean(userRole || businessStage)
  const hasPainPoints = painPoints && painPoints.length > 0

  const modeLabel = mode === 'sell-to-china' ? '卖到中国（进口可行性分析）' : '从海外采购（选品指南）'

  let prompt = `[任务模式] ${modeLabel}\n`

  if (categoryContext) {
    prompt += `[品类与目标人群]\n${categoryContext}\n`
    if (categoryLevel1Name) prompt += `一级分类: ${categoryLevel1Name}\n`
    if (categoryLevel2Name) prompt += `二级分类: ${categoryLevel2Name}\n`
  } else {
    prompt += `[产品类型] ${productName || productType}\n`
    if (categoryLevel1Name) prompt += `[一级分类] ${categoryLevel1Name}\n`
  }

  if (mode === 'sell-to-china') {
    prompt += `[目标销售区域] ${targetRegion} - ${getRegionDescription(targetRegion)}\n`
    if (countryRegion) prompt += `[产品来源地区] ${countryRegion}\n`
  } else {
    prompt += `[采购来源地区] ${originRegion || targetRegion}\n`
    if (countryName) prompt += `[采购目标国家] ${countryName}\n`
    if (countryRegion) prompt += `[地区特点] ${getOriginRegionDescription(countryRegion)}\n`
  }

  if (hasUserContext) {
    prompt += `[用户身份] ${userRole || '未选择'}\n`
    prompt += `[当前业务阶段] ${businessStage || '未选择'}\n`
  }

  if (hasPainPoints) {
    prompt += `[核心关注点] ${painPoints.join('、')}\n`
  }

  prompt += `[输出语言] ${getLanguageName(language)}\n`

  return prompt
}

function getLanguageName(code) {
  const names = {
    zh: '简体中文', en: 'English', ja: '日本語', ko: '한국어',
    de: 'Deutsch', fr: 'Français', es: 'Español', it: 'Italiano',
    pt: 'Português', ru: 'Русский', ar: 'العربية',
  }
  return names[code] || '简体中文'
}

function getRegionDescription(region) {
  const descriptions = {
    '华东地区': '上海、江苏、浙江 - 经济发达，消费力强，进口商品认可度高',
    '华南地区': '广东、福建、广西 - 对外贸易活跃，物流便利，渠道丰富',
    '华北地区': '北京、天津、河北 - 政治文化中心，高端消费市场',
    '西南地区': '四川、重庆、云南 - 新兴消费市场，增长潜力大',
    '华中地区': '湖北、湖南、河南 - 人口众多，市场潜力大',
    '全国范围': '覆盖全国 - 全渠道布局，最大化市场覆盖',
  }
  return descriptions[region] || region
}

function getOriginRegionDescription(region) {
  const descriptions = {
    '日本': '高品质消费品、化妆品、保健品',
    '欧洲': '奢侈品、母婴用品、葡萄酒',
    '东南亚': '热带水果、特色食品、纺织品',
    '澳大利亚': '保健品、奶粉、乳制品',
    '美国': '科技产品、健康食品、日用品',
    '韩国': '美妆产品、电子产品、时尚服饰',
    '新西兰': '优质乳制品、保健品、蜂蜜',
    '加拿大': '冰酒、枫糖浆、农产品',
  }
  return descriptions[region] || region
}
