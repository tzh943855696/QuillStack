import React from 'react';
import { JsonLd } from './JsonLd';
import type { Article, SiteSettings } from '@/lib/types';
import { getSiteUrl, buildUrl } from '@/lib/seo';

interface ArticleSchemaProps {
  article: Article;
  settings: SiteSettings;
}

/**
 * 文章结构化数据组件 (Article Schema)
 * 为搜索引擎提供文章的详细信息，支持富媒体搜索结果
 */
export function ArticleSchema({ article, settings }: ArticleSchemaProps) {
  const siteUrl = getSiteUrl(settings);
  const articleUrl = buildUrl(siteUrl, `/posts/${article.slug}`);
  const imageUrl = article.imageUrl || settings.seo?.fallbackOgImage || `${siteUrl}/og/default.jpg`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: settings.author.name,
      image: {
        '@type': 'ImageObject',
        url: settings.author.avatarUrl,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: settings.footer.logoIcon || settings.author.avatarUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    url: articleUrl,
    ...(article.category && {
      articleSection: article.category.name,
    }),
    keywords: settings.seo?.keywords?.join(', '),
  };

  return <JsonLd data={schema} />;
}

export default ArticleSchema;
