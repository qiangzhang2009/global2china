import { useEffect, useRef } from 'react';

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: object;
  LDtype?: 'FAQ' | 'Article' | 'Product' | 'BreadcrumbList';
}

const BASE_URL = 'https://global2china.zxqconsulting.com';
const DEFAULT_OG_IMAGE = '/og-image.png';
const SITE_NAME = 'Global2China - 上海张小强';

const DEFAULT_META = {
  title: 'Global2China - 海外优品·中国上市 | 日本欧洲东南亚进口服务专家',
  description: 'Global2China（上海张小强企业咨询事务所）- 专业海外产品进口解决方案。从日本、欧洲、东南亚选品采购到中国上市，一站式服务：市场准入、报关清关，品牌本地化、渠道对接。AI智能分析，50+国家经验，成功案例1000+。',
  keywords: '进口中国,海外产品进口,日本进口,欧洲进口,东南亚进口,中国市场准入,报关清关,品牌本地化,跨境电商进口,选品采购服务,China import,import to China',
};

const i18nLangMap: Record<string, string> = {
  en: 'en_US',
  ja: 'ja_JP',
  ko: 'ko_KR',
  zh: 'zh_CN',
};

export default function Seo({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  structuredData,
  LDtype,
}: SeoProps) {
  const doc = useRef<Document | null>(null);

  const setMeta = (d: Document) => {
    const base = d.head.querySelector('base');
    if (base) d.head.removeChild(base);
    const baseEl = d.createElement('base');
    baseEl.href = window.location.origin + '/';
    d.head.prepend(baseEl);

    const set = (selector: string, value: string) => {
      const el = d.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = value;
    };

    const createMeta = (property: string, content: string) => {
      let el = d.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = d.createElement('meta');
        el.setAttribute('property', property);
        d.head.appendChild(el);
      }
      el.content = content;
    };

    const createLink = (rel: string, hreflang: string, href: string) => {
      const existing = d.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][hreflang="${hreflang}"]`);
      if (existing) return;
      const el = d.createElement('link');
      el.rel = rel;
      el.hreflang = hreflang;
      el.href = href;
      d.head.appendChild(el);
    };

    const fullTitle = title
      ? `${title} | Global2China`
      : DEFAULT_META.title;

    document.title = fullTitle;
    set('meta[name="description"]', description || DEFAULT_META.description);
    set('meta[name="keywords"]', keywords || DEFAULT_META.keywords);
    set('meta[name="robots"]', noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    createMeta('og:title', fullTitle);
    createMeta('og:description', description || DEFAULT_META.description);
    createMeta('og:url', canonical || window.location.href);
    createMeta('og:type', ogType);
    createMeta('og:site_name', SITE_NAME);
    createMeta('og:image', ogImage || DEFAULT_OG_IMAGE);
    createMeta('og:image:width', '1200');
    createMeta('og:image:height', '630');

    const currentLang = document.documentElement.lang?.replace('-', '_') || 'zh_CN';
    createMeta('og:locale', currentLang);

    createMeta('twitter:card', 'summary_large_image');
    createMeta('twitter:title', fullTitle);
    createMeta('twitter:description', description || DEFAULT_META.description);
    createMeta('twitter:image', ogImage || DEFAULT_OG_IMAGE);

    const canon = canonical || window.location.href;
    let canonicalEl = d.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = d.createElement('link');
      canonicalEl.rel = 'canonical';
      d.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canon;

    // Ensure hreflang links are present for all supported languages
    const hreflangs: Record<string, string> = {
      'zh-CN': `${BASE_URL}/`,
      en: `${BASE_URL}/en/`,
      ja: `${BASE_URL}/ja/`,
      ko: `${BASE_URL}/ko/`,
      de: `${BASE_URL}/de/`,
      fr: `${BASE_URL}/fr/`,
      es: `${BASE_URL}/es/`,
      it: `${BASE_URL}/it/`,
      pt: `${BASE_URL}/pt/`,
      ru: `${BASE_URL}/ru/`,
      ar: `${BASE_URL}/ar/`,
    };
    Object.entries(hreflangs).forEach(([lang, href]) => {
      createLink('alternate', lang, href);
    });
    createLink('alternate', 'x-default', `${BASE_URL}/`);
  };

  const updateJsonLd = (d: Document, data: object, type: string) => {
    const existing = d.head.querySelector<HTMLScriptElement>(`script[data-seo-type="${type}"]`);
    if (existing) {
      existing.textContent = JSON.stringify(data);
      return;
    }
    const script = d.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-type', type);
    script.textContent = JSON.stringify(data);
    d.head.appendChild(script);
  };

  useEffect(() => {
    doc.current = document;
    if (typeof document !== 'undefined') {
      setMeta(document);
    }
  }, [title, description, keywords, canonical, ogImage, ogType, noIndex]);

  useEffect(() => {
    if (structuredData && LDtype && typeof document !== 'undefined') {
      updateJsonLd(document, structuredData, LDtype);
    }
  }, [structuredData, LDtype]);

  return null;
}
