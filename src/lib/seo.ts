import type { Article, Category, SiteSettings } from './types';

// SEO 配置类型
export interface SeoConfig {
  siteUrl: string;
  ogImageGenerationLimit: number;
  fallbackOgImage: string;
  twitterHandle?: string;
  keywords: string[];
}

// OG 图片生成结果
export interface OgImageResult {
  local: boolean;
  url: string;
  width: number;
  height: number;
  alt: string;
}

// 元数据生成参数
export interface MetadataParams {
  title: string;
  description: string;
  path: string;
  image?: OgImageResult;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  authors?: { name: string; url?: string }[];
}

// 获取站点完整 URL
export function getSiteUrl(settings: SiteSettings): string {
  return settings.seo?.siteUrl || 'https://example.com';
}

// 构建完整 URL
export function buildUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// 检查是否应该生成本地 OG 图片
export function shouldGenerateLocalOg(
  index: number,
  limit: number
): boolean {
  return index < limit;
}

// 获取 OG 图片 URL（本地或外部）
export function getOgImageUrl(
  type: 'home' | 'category' | 'article',
  slug: string,
  settings: SiteSettings,
  index: number = 0
): OgImageResult {
  const limit = settings.seo?.ogImageGenerationLimit ?? 10;
  const siteUrl = getSiteUrl(settings);
  
  if (type === 'home') {
    return {
      local: true,
      url: `${siteUrl}/og/home.jpg`,
      width: 1200,
      height: 630,
      alt: settings.siteTitle,
    };
  }

  if (shouldGenerateLocalOg(index, limit)) {
    return {
      local: true,
      url: `${siteUrl}/og/${type}-${slug}.jpg`,
      width: 1200,
      height: 630,
      alt: `${type === 'category' ? '分类' : '文章'}: ${slug}`,
    };
  }

  // 超限使用回退图片
  return {
    local: false,
    url: settings.seo?.fallbackOgImage || `${siteUrl}/og/default.jpg`,
    width: 1200,
    height: 630,
    alt: settings.siteTitle,
  };
}

// 获取文章 OG 图片（优先使用文章图片）
export function getArticleOgImage(
  article: Article,
  settings: SiteSettings,
  index: number
): OgImageResult {
  const limit = settings.seo?.ogImageGenerationLimit ?? 10;
  const siteUrl = getSiteUrl(settings);

  // 在限制内生成专用 OG 图
  if (shouldGenerateLocalOg(index, limit)) {
    return {
      local: true,
      url: `${siteUrl}/og/article-${article.slug}.jpg`,
      width: 1200,
      height: 630,
      alt: article.imageHint || article.title,
    };
  }

  // 超限使用文章原有图片
  if (article.imageUrl) {
    return {
      local: false,
      url: article.imageUrl,
      width: 1200,
      height: 630,
      alt: article.imageHint || article.title,
    };
  }

  // 回退到默认图
  return {
    local: false,
    url: settings.seo?.fallbackOgImage || `${siteUrl}/og/default.jpg`,
    width: 1200,
    height: 630,
    alt: article.title,
  };
}

// 截断描述文本
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength - 3).trim() + '...';
}

// 生成页面标题
export function generatePageTitle(
  pageTitle: string,
  siteTitle: string,
  includeSiteName: boolean = true
): string {
  if (!includeSiteName || pageTitle === siteTitle) return pageTitle;
  return `${pageTitle} | ${siteTitle}`;
}

// 合并关键词
export function mergeKeywords(
  baseKeywords: string[],
  ...additionalKeywords: (string[] | undefined)[]
): string[] {
  const allKeywords = new Set(baseKeywords);
  additionalKeywords.forEach(kws => {
    kws?.forEach(kw => allKeywords.add(kw));
  });
  return Array.from(allKeywords);
}

// 生成规范 URL
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  return buildUrl(baseUrl, path);
}

// 判断是否为生产环境
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
