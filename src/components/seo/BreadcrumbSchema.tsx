import React from 'react';
import { JsonLd } from './JsonLd';
import type { SiteSettings } from '@/lib/types';
import { getSiteUrl, buildUrl } from '@/lib/seo';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  settings: SiteSettings;
}

/**
 * 面包屑导航结构化数据组件 (BreadcrumbList Schema)
 * 帮助搜索引擎理解网站层级结构，可能在搜索结果中显示面包屑
 */
export function BreadcrumbSchema({ items, settings }: BreadcrumbSchemaProps) {
  const siteUrl = getSiteUrl(settings);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildUrl(siteUrl, item.path),
    })),
  };

  return <JsonLd data={schema} />;
}

// 预设的面包屑配置
export function createHomeBreadcrumb(settings: SiteSettings): BreadcrumbItem {
  return { name: '首页', path: '/' };
}

export function createCategoryBreadcrumb(): BreadcrumbItem {
  return { name: '分类', path: '/category' };
}

export function createCategoryDetailBreadcrumb(categoryId: string, categoryName: string): BreadcrumbItem {
  return { name: categoryName, path: `/category/${categoryId}` };
}

export function createArticleBreadcrumb(slug: string, title: string): BreadcrumbItem {
  return { name: title, path: `/posts/${slug}` };
}

export default BreadcrumbSchema;
