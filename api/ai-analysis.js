// AI 分析 API 路由
// 使用 DeepSeek API 进行智能分析

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { productType, targetRegion, mode, originRegion, options } = req.body

  // 从环境变量获取 API 密钥
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
  
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  const productName = options?.productName || productType
  const categoryLevel1Name = options?.categoryLevel1Name || ''
  const categoryLevel2Name = options?.categoryLevel2Name || productName
  const categoryContext = options?.categoryContext || ''
  const countryName = options?.countryName || ''
  const countryRegion = options?.countryRegion || ''
  const userRole = options?.userRole || ''
  const businessStage = options?.businessStage || ''
  const language = options?.language || 'zh'

  const hasUserContext = Boolean(userRole || businessStage)
  const userContextBlock = hasUserContext
    ? `
【用户身份与阶段】（请据此调整分析深度与下一步建议的针对性）
- 用户身份：${userRole || '未选择'}
- 当前业务阶段：${businessStage || '未选择'}
`
    : ''

  const productAndAudienceBlock = categoryContext
    ? `【重要：请严格按以下品类与目标人群分析，勿与其他品类混淆】
- 品类与目标人群说明：${categoryContext}
- 一级分类：${categoryLevel1Name}
- 二级分类：${categoryLevel2Name}
- 分析对象简称：${productName}`
    : `- 产品类型/二级分类：${productName}
${categoryLevel1Name ? `- 一级分类：${categoryLevel1Name}` : ''}`

  const targetRegionBlock = targetRegion
    ? `
【目标销售区域】
- 目标区域：${targetRegion}
- 区域特点：${getRegionDescription(targetRegion)}`
    : ''

  const originRegionBlock = originRegion
    ? `
【采购来源地区】
- 原产国/地区：${countryName || originRegion}
- 区域特点：${getOriginRegionDescription(countryRegion || originRegion)}`
    : ''

  const prompt = `
请作为专业的国际贸易咨询顾问，分析以下内容，并以严格的JSON格式返回结果。

${productAndAudienceBlock}
${targetRegionBlock}
${originRegionBlock}
${userContextBlock}

【重要】你必须返回以下JSON格式（不要包含任何其他内容）：
{
  "marketDemand": {
    "overall": "一句话市场概述",
    "regional": "区域分析",
    "targetCustomers": "目标客户描述",
    "growthTrend": "增长趋势"
  },
  "competition": {
    "level": "竞争程度",
    "mainCompetitors": ["竞争对手1", "竞争对手2"],
    "differentiation": "差异化建议"
  },
  "pricing": {
    "recommendedRange": "价格范围",
    "costBreakdown": "成本构成",
    "margin": "利润空间"
  },
  "timeline": {
    "import": "清关周期",
    "marketEntry": "进入市场周期",
    "roi": "投资回报周期"
  },
  "challenges": {
    "level": "风险等级",
    "mainRisks": ["风险1", "风险2"],
    "mitigation": ["应对1", "应对2"]
  },
  "compliance": {
    "certifications": ["资质1", "资质2"],
    "labeling": ["标签要求1"],
    "testing": ["检测要求1"]
  },
  "actionPlan": {
    "nextSteps": ["下一步1", "下一步2"],
    "priority": "优先级",
    "keySuccessFactors": ["成功因素1", "成功因素2"]
  }
}

请用${language === 'zh' ? '简体中文' : language === 'en' ? 'English' : language === 'ja' ? '日本語' : '简体中文'}回复。只返回JSON，不要其他内容。
`

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
            content: '你是一位专业的国际贸易咨询顾问，擅长分析海外产品进入中国市场的可行性，以及海外采购选品策略。你的分析必须严格基于用户选择的具体选项。若用户提供了「用户身份」或「当前业务阶段」，请据此调整。你必须全程使用简体中文回答，包括所有专业术语、概念名称、证书名称、法规名称等。禁止使用任何英文词汇或英文缩写。你的回复必须是100%的纯中文内容，JSON中的所有字符串值也必须是纯中文。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('DeepSeek API error:', data)
      return res.status(500).json({ error: 'AI analysis failed' })
    }

    const analysisContent = data.choices[0]?.message?.content || ''

    return res.status(200).json({
      success: true,
      result: {
        content: analysisContent,
        productType,
        targetRegion,
        mode
      }
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    return res.status(500).json({ error: 'Failed to analyze with AI' })
  }
}

function getRegionDescription(region) {
  const descriptions = {
    '华东地区': '上海、江苏、浙江 - 经济发达，消费力强，进口商品认可度高',
    '华南地区': '广东、福建、广西 - 对外贸易活跃，物流便利，渠道丰富',
    '华北地区': '北京、天津、河北 - 政治文化中心，高端消费市场',
    '西南地区': '四川、重庆、云南 - 新兴消费市场，增长潜力大',
    '华中地区': '湖北、湖南、河南 - 人口众多，市场潜力大',
    '全国范围': '覆盖全国 - 全渠道布局，最大化市场覆盖'
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
    '加拿大': '冰酒、枫糖浆、农产品'
  }
  return descriptions[region] || region
}
