import { readFileSync } from 'fs';
import { join } from 'path';

// 同步读取配置（用于构建时的静态元数据）
function loadSettingsSync() {
  try {
    const content = readFileSync(join(process.cwd(), 'content/settings.json'), 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('⚠️ 无法加载 settings.json，使用默认配置');
    return null;
  }
}

// 缓存配置
let cachedSettings: ReturnType<typeof loadSettingsSync> = null;

export function getSettingsSync() {
  if (!cachedSettings) {
    cachedSettings = loadSettingsSync();
  }
  return cachedSettings;
}

// 获取站点元数据配置
export function getSiteMetadata() {
  const settings = getSettingsSync();
  
  return {
    title: settings?.siteTitle ?? '我的博客',
    titleTemplate: `%s | ${settings?.header?.title ?? '博客'}`,
    description: settings?.siteDescription?.slice(0, 160) ?? '个人博客站点',
    keywords: settings?.seo?.keywords ?? ['博客', '技术', '开发'],
    author: settings?.author?.name ?? '博主',
    siteUrl: settings?.seo?.siteUrl ?? 'https://example.com',
    twitterHandle: settings?.seo?.twitterHandle,
  };
}

// 获取主题配置
export function getThemeConfig() {
  const settings = getSettingsSync();
  
  return {
    bodyFont: settings?.theme?.bodyFont ?? 'PT Sans',
    headlineFont: settings?.theme?.headlineFont ?? 'Space Grotesk',
  };
}
