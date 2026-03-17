import React from 'react';
import { JsonLd } from './JsonLd';
import type { SiteSettings } from '@/lib/types';
import { getSiteUrl } from '@/lib/seo';

interface WebsiteSchemaProps {
  settings: SiteSettings;
}

/**
 * 网站结构化数据组件 (WebSite Schema)
 * 提供网站的基本信息，支持搜索引擎的站点链接搜索框
 */
export function WebsiteSchema({ settings }: WebsiteSchemaProps) {
  const siteUrl = getSiteUrl(settings);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteTitle,
    description: settings.siteDescription,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: settings.footer.logoIcon || settings.author.avatarUrl,
      },
    },
  };

  return <JsonLd data={schema} />;
}

export default WebsiteSchema;
