import { Globe, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Footer Top - CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-emerald-100 text-sm font-medium">开启您的全球之旅</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            准备好拓展中国市场了吗？
          </h3>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
            专业的团队、丰富的经验，帮助您的产品快速进入中国市场
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            立即咨询
          </a>
        </div>
      </div>

      {/* Footer Main */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">上海张小强</span>
                <span className="block text-xs text-gray-400">企业咨询事务所</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              专业的海外产品进口咨询服务，帮助海外企业快速进入中国市场。AI技术赋能企业全球扩张。
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>上海市</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">核心服务</h4>
            <ul className="space-y-3">
              {[
                '海外选品服务',
                '采购代理服务',
                '市场准入咨询',
                '渠道对接服务',
                '品牌本地化',
                '海外市场调研',
              ].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">全球市场</h4>
            <ul className="space-y-3">
              {[
                { name: '日本', flag: '🇯🇵' },
                { name: '欧洲', flag: '🇪🇺' },
                { name: '东南亚', flag: '🌏' },
                { name: '澳大利亚', flag: '🦘' },
                { name: '美国', flag: '🇺🇸' },
                { name: '中东', flag: '🏜️' },
              ].map((item, index) => (
                <li key={index}>
                  <a href="#markets" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">快速链接</h4>
            <ul className="space-y-3">
              {[
                { name: '关于我们', href: '#about' },
                { name: '服务项目', href: '#services' },
                { name: '全球市场', href: '#markets' },
                { name: 'AI工具', href: '#tools' },
                { name: '联系我们', href: '#contact' },
              ].map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} 上海张小强企业咨询事务所. 版权所有
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                服务条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
