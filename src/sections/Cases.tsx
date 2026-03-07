import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink } from 'lucide-react';

const cases = [
  {
    id: 1,
    title: '上海精品超市日本进口项目',
    category: '零售渠道',
    image: '🛒',
    description: '为上海某精品超市提供日本零食、饮品、日用品的选品及采购服务，成功引入50+SKU。',
    result: '月销售额突破30万元',
  },
  {
    id: 2,
    title: '欧洲美妆品牌进入中国',
    category: '美妆护肤',
    image: '💄',
    description: '协助法国高端美妆品牌完成中国海关准入、标签备案及电商平台入驻。',
    result: '天猫旗舰店首月销售额破百万',
  },
  {
    id: 3,
    title: '澳大利亚保健品渠道建设',
    category: '健康产品',
    image: '💊',
    description: '帮助澳大利亚保健品牌对接国内经销商，成功进入200+线下药店。',
    result: '年销售额突破2000万元',
  },
];

const Cases = () => {
  const { t } = useTranslation();

  return (
    <section id="cases" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {t('cases.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t('cases.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Area */}
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-6xl">
                {item.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                  {item.category}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">成果：</span>
                    <span className="text-emerald-600 font-medium">{item.result}</span>
                  </div>
                  <a
                    href="#contact"
                    className="flex items-center gap-1 text-emerald-600 text-sm font-medium group-hover:gap-2 transition-all"
                  >
                    咨询详情 <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cases;
