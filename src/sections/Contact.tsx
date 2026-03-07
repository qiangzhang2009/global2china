import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { emailConfig } from '@/lib/email';

// 团队成员信息
const teamMembers: { name: string; roleKey: string; phone: string; phoneLocal: string; email: string }[] = [
  {
    name: '张强',
    roleKey: 'contact.role1',
    phone: '+86 137 6487 2538',
    phoneLocal: '',
    email: 'zxq@zxqconsulting.com',
  },
  {
    name: '李静',
    roleKey: 'contact.role2',
    phone: '+86 138 166 89487',
    phoneLocal: '+81 080 962 86389',
    email: 'yuqian@zxqconsulting.com',
  },
  {
    name: '刘潇',
    roleKey: 'contact.role3',
    phone: '+86 182 177 94992',
    phoneLocal: '+61 466 981 227',
    email: 'dianaliu@zxqconsulting.com',
  },
];

const Contact = () => {
  const { t } = useTranslation();
  const [inquiryType, setInquiryType] = useState('sell-to-china');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryTypes = [
    { id: 'sell-to-china', labelKey: 'contact.inquiry.sellToChina', icon: '📈' },
    { id: 'sourcing', labelKey: 'contact.inquiry.sourcing', icon: '🌍' },
    { id: 'other', labelKey: 'contact.inquiry.other', icon: '💬' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 根据询盘类型发送到不同负责人
      const getTargetEmails = () => {
        if (inquiryType === 'sourcing') {
          // 采购类 - 张强负责
          return ['zxq@zxqconsulting.com'];
        }
        // 卖到中国和其他 - 全部负责人
        return emailConfig.toEmails;
      };

      const targetEmails = getTargetEmails();

      // 发送邮件
      const sendPromises = targetEmails.map(async (toEmail) => {
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || '未填写',
          company: formData.company || '未填写',
          message: `【询盘类型】${inquiryTypes.find(t => t.id === inquiryType)?.labelKey ? t(inquiryTypes.find(t => t.id === inquiryType)?.labelKey || '') : ''}\n\n${formData.message}`,
          inquiry_type: inquiryTypes.find(t => t.id === inquiryType)?.labelKey ? t(inquiryTypes.find(t => t.id === inquiryType)?.labelKey || '') : '',
          to_email: toEmail,
        };

        return emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          templateParams,
          emailConfig.publicKey
        );
      });

      await Promise.all(sendPromises);

      toast.success(t('contact.success'));
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      console.error('Email send error:', error);
      toast.error(t('contact.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* 全球视野配图 */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-12 max-w-4xl mx-auto">
          <img src="/images/paris-europe.png" alt="" className="w-full h-40 md:h-48 object-cover object-center" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info - Three Team Members */}
          <div className="animate-on-scroll">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white h-full">
              <h3 className="text-2xl font-bold mb-2">上海张小强企业咨询事务所</h3>
              <p className="text-emerald-100 text-sm mb-8">可靠·专业·高效</p>

              {/* Team Members */}
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg">{member.name}</div>
                        <div className="text-emerald-100 text-sm mb-2">{t(member.roleKey)}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 opacity-70" />
                            <span>{member.phone}</span>
                          </div>
                          {member.phoneLocal && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 opacity-70" />
                              <span>{member.phoneLocal}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 opacity-70" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-lg font-medium mb-2">微信公众号/视频号</div>
                <div className="opacity-80 text-sm">
                  张小强出海
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl animate-on-scroll">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 询盘类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  我想咨询 *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInquiryType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        inquiryType === type.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium text-sm">{t(type.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.phonePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('contact.companyPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t('contact.messagePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>提交中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('contact.submit')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
