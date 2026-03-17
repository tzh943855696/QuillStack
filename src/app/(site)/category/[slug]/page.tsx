import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getArticles, getSiteSettings, getCategory } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import PaginationControls from '@/components/site/PaginationControls';
import SiteHero from '@/components/site/SiteHero';
import PixelBreadcrumb, { breadcrumbPresets } from '@/components/site/PixelBreadcrumb';
import { BreadcrumbSchema, createHomeBreadcrumb, createCategoryBreadcrumb, createCategoryDetailBreadcrumb } from '@/components/seo';
import { getSiteUrl, buildUrl } from '@/lib/seo';
import { Skeleton } from '@/components/ui/skeleton';

function ArticlesSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="w-full md:w-48 h-48 md:h-auto" />
            <div className="flex-1 p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  const { categories } = await getSiteSettings();
  return categories.map(category => ({
    slug: category.id,
  }));
}

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategory(resolvedParams.slug);
  const settings = await getSiteSettings();

  if (!category) {
    return {
      title: '分类未找到',
    };
  }

  const allArticles = await getArticles();
  const articles = allArticles.filter(article => article.categoryId === category.id);
  const siteUrl = getSiteUrl(settings);
  const description = articles.length > 0
    ? `探索 ${articles.length} 篇关于${category.name}的文章，包含技术分享、经验总结等内容。`
    : `${category.name}分类下的文章列表。`;

  // 查找分类索引，确定是否使用本地生成的 OG 图
  const categoryIndex = settings.categories.findIndex(c => c.id === category.id);
  const ogImageUrl = categoryIndex < (settings.seo?.ogImageGenerationLimit ?? 10)
    ? `${siteUrl}/og/category-${category.id}.jpg`
    : settings.seo?.fallbackOgImage || `${siteUrl}/og/default.jpg`;

  return {
    title: category.name,
    description,
    keywords: [...(settings.seo?.keywords || []), category.name, '分类'],
    alternates: {
      canonical: buildUrl(siteUrl, `/category/${category.id}`),
    },
    openGraph: {
      title: `${category.name} | ${settings.siteTitle}`,
      description,
      url: buildUrl(siteUrl, `/category/${category.id}`),
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name}分类`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ${settings.siteTitle}`,
      description,
      images: [ogImageUrl],
      creator: settings.seo?.twitterHandle,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const allArticles = await getArticles();
  const settings = await getSiteSettings();
  const { pagination, author } = settings;

  if (!resolvedParams?.slug) {
    notFound();
  }

  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const articles = allArticles.filter(article => article.categoryId === category.id);
  const categoryColor = category?.color || 'gray';
  const postsPerPage = pagination.postsPerPage;

  return (
    <>
      <BreadcrumbSchema
        settings={settings}
        items={[
          createHomeBreadcrumb(settings),
          createCategoryBreadcrumb(),
          createCategoryDetailBreadcrumb(category.id, category.name),
        ]}
      />
      <SiteHero settings={settings} size="medium" />
      <div className="container mx-auto px-5 -mt-8">
        <PixelBreadcrumb
          items={[
            breadcrumbPresets.home,
            { ...breadcrumbPresets.category, label: '分类', href: '/category' },
            { label: category.name }
          ]}
        />
      </div>
      <div className="container mx-auto px-5 py-12 md:py-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: categoryColor}}></div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline">
              {category.name}
            </h1>
          </div>
          <Separator className="mb-8" />
        </div>

        {articles.length > 0 ? (
          <Suspense fallback={<ArticlesSkeleton />}>
            <PaginationControls
              articles={articles}
              postsPerPage={postsPerPage}
              baseUrl={`/category/${category.id}`}
              author={author}
            />
          </Suspense>
        ) : (
          <Card className="col-span-full text-center py-12 max-w-4xl">
            <CardHeader>
              <CardTitle className="font-headline">暂无文章</CardTitle>
              <CardDescription>此分类下还没有文章哦OwO</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
}
