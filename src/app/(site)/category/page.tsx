import type { Metadata } from 'next';
import { getArticles, getSiteSettings } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { FolderArchive } from 'lucide-react';
import Link from 'next/link';
import SiteHero from '@/components/site/SiteHero';
import PixelBreadcrumb, { breadcrumbPresets } from '@/components/site/PixelBreadcrumb';
import { BreadcrumbSchema, createHomeBreadcrumb, createCategoryBreadcrumb } from '@/components/seo';
import type { Category } from '@/lib/types';
import { getSiteUrl, buildUrl } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl(settings);
  const description = `探索 ${settings.siteTitle} 的文章分类，包含 ${settings.categories.length} 个分类，涵盖技术、服务器、随笔等多个主题。`;

  return {
    title: '文章分类',
    description,
    keywords: [...(settings.seo?.keywords || []), '分类', '目录', '标签'],
    alternates: {
      canonical: buildUrl(siteUrl, '/category'),
    },
    openGraph: {
      title: `文章分类 | ${settings.siteTitle}`,
      description,
      url: buildUrl(siteUrl, '/category'),
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: '文章分类',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `文章分类 | ${settings.siteTitle}`,
      description,
      images: [`${siteUrl}/og/home.jpg`],
      creator: settings.seo?.twitterHandle,
    },
  };
}

export default async function CategoriesPage() {
  const settings = await getSiteSettings();
  const articles = await getArticles();
  const { categories } = settings;

  // 计算每个分类的文章数量
  const categoryCounts = categories.map(category => {
    const count = articles.filter(article => article.categoryId === category.id).length;
    return { ...category, count };
  });

  return (
    <>
      <BreadcrumbSchema
        settings={settings}
        items={[
          createHomeBreadcrumb(settings),
          createCategoryBreadcrumb(),
        ]}
      />
      <SiteHero settings={settings} size="medium" />
      <div className="container mx-auto px-5 -mt-8">
        <PixelBreadcrumb
          items={[
            breadcrumbPresets.home,
            { ...breadcrumbPresets.category, label: '分类' }
          ]}
        />
      </div>
      
      {/* 45° 网格背景 */}
      <div className="relative">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                hsl(var(--primary)) 10px,
                hsl(var(--primary)) 20px
              )
            `
          }} />
        </div>
        
        <div className="container mx-auto px-5 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* 页面标题 */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FolderArchive className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
                文章分类
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                探索不同主题的文章，找到您感兴趣的内容
              </p>
            </div>

            {/* 分类网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryCounts.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.id}`}
                  className="group"
                >
                  <Card className="
                    relative overflow-hidden
                    bg-card/50 backdrop-blur-sm
                    border-2 border-border
                    rounded-xl
                    transition-all duration-200
                    hover:-translate-y-1 hover:shadow-xl
                    hover:border-primary/30
                  ">
                    {/* 霓虹描边效果 */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div 
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `linear-gradient(45deg, transparent, ${category.color}20, transparent)`,
                        }}
                      />
                    </div>

                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <h2 className="text-xl font-bold font-mono">
                            {category.name}
                          </h2>
                        </div>
                        
                        {/* LED 数字样式计数器 */}
                        <div className="
                          relative overflow-hidden
                          bg-background/80
                          border border-border
                          rounded-lg
                          px-3 py-1
                        ">
                          <span className="text-lg font-mono font-bold text-primary">
                            {category.count}
                          </span>
                          {/* 微光效果 */}
                          <div className="
                            absolute inset-0
                            bg-gradient-to-r from-transparent via-primary/20 to-transparent
                            animate-shimmer
                          " />
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.count > 0 
                          ? `探索 ${category.count} 篇${category.name}相关的文章` 
                          : '该分类下暂无文章'}
                      </p>

                      {/* 线条装饰 */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-px flex-1"
                          style={{ 
                            background: `linear-gradient(to right, ${category.color}, transparent)` 
                          }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">
                          {category.count} POSTS
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* 统计信息 */}
            <div className="mt-12 pt-8 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-primary">
                    {categories.length}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    分类
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-primary">
                    {articles.length}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    文章
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-primary">
                    {Math.round(articles.length / categories.length)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    平均
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-primary">
                    {categories.filter(c => articles.some(a => a.categoryId === c.id)).length}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    活跃
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}