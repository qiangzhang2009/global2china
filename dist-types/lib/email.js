// EmailJS 配置
// 请在 https://www.emailjs.com/ 注册并创建您的 EmailJS 账号
// 然后替换以下配置值
export const emailConfig = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    toEmails: ['customer@zxqconsulting.com', '3740977@qq.com'],
};
// EmailJS 模板中的变量名:
// - from_name: 访客姓名
// - from_email: 访客邮箱
// - phone: 联系电话
// - company: 公司名称
// - message: 询盘内容
// - to_email: 收件人邮箱 (支持多个用逗号分隔)
// 使用示例:
// 1. 登录 https://www.emailjs.com/
// 2. 创建一个 Email Service (选择 Email)
// 3. 创建一个 Email Template，例如:
//
// ---
// 新询盘通知
// 
// 您收到一个新的询盘:
//
// 姓名: {{from_name}}
// 邮箱: {{from_email}}
// 电话: {{phone}}
// 公司: {{company}}
// 询盘内容:
// {{message}}
//
// ---
// 4. 在 EmailJS Dashboard 获取您的 Public Key, Service ID, Template ID
// 5. 替换上方配置值
