// Email API 路由
// 使用 nodemailer 直接发送邮件

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

  const { name, email, phone, company, message, inquiryType } = req.body

  // 验证必填字段
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // 获取环境变量中的邮件配置
  const SMTP_HOST = process.env.SMTP_HOST
  const SMTP_PORT = process.env.SMTP_PORT
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const TO_EMAILS = process.env.TO_EMAILS || 'customer@zxqconsulting.com,3740977@qq.com'

  // 如果没有配置 SMTP，返回错误
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return res.status(500).json({ error: 'Email service not configured' })
  }

  // 构建邮件内容
  const inquiryTypeLabels = {
    'sell-to-china': '卖到中国',
    'sourcing': '采购/sourcing',
    'other': '其他'
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">🌏 新询盘通知 - Global2China</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">询盘类型</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiryTypeLabels[inquiryType] || inquiryType}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">姓名</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">邮箱</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">电话</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || '未填写'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">公司</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${company || '未填写'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; vertical-align: top; font-weight: bold;">询盘内容</td>
          <td style="padding: 10px; vertical-align: top;">${(message || '').replace(/\n/g, '<br>')}</td>
        </tr>
      </table>

      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        此邮件由 Global2China 网站自动发送
      </p>
    </div>
  `

  const textContent = `
新询盘通知 - Global2China

询盘类型: ${inquiryTypeLabels[inquiryType] || inquiryType}
姓名: ${name}
邮箱: ${email}
电话: ${phone || '未填写'}
公司: ${company || '未填写'}

询盘内容:
${message}
  `

  try {
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: SMTP_PORT === '465',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    const recipientEmails = TO_EMAILS.split(',').map(e => e.trim())
    
    await transporter.sendMail({
      from: `"Global2China" <${SMTP_USER}>`,
      to: recipientEmails.join(', '),
      subject: `🌏 新询盘通知 - ${name} - ${inquiryTypeLabels[inquiryType] || 'Global2China'}`,
      text: textContent,
      html: htmlContent,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
