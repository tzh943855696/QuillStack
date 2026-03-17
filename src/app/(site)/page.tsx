import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getArticles, getSiteSettings } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PaginationControls from '@/components/site/PaginationControls';
import SiteHero from '@/components/site/SiteHero';
import { WebsiteSchema } from '@/components/seo';
import { getSiteUrl, truncateDescription } from '@/lib/seo';
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl(settings);

  return {
    title: settings.siteTitle,
    description: truncateDescription(settings.siteDescription),
    keywords: settings.seo?.keywords || ['博客', '技术', '前端', '开发'],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: settings.siteTitle,
      description: truncateDescription(settings.siteDescription),
      url: siteUrl,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: settings.siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: truncateDescription(settings.siteDescription),
      images: [`${siteUrl}/og/home.jpg`],
      creator: settings.seo?.twitterHandle,
    },
  };
}

export default async function HomePage() {
  const allArticles = await getArticles();
  const settings = await getSiteSettings();
  const { pagination, author } = settings;
  
  const postsPerPage = pagination.postsPerPage;

  return (
    <>
      <WebsiteSchema settings={settings} />
      <SiteHero settings={settings} />
      <div className="container mx-auto px-5 py-12 md:py-16">
        {allArticles.length > 0 ? (
          <Suspense fallback={<ArticlesSkeleton />}>
            <PaginationControls
              articles={allArticles}
              postsPerPage={postsPerPage}
              baseUrl="/"
              author={author}
            />
          </Suspense>
        ) : (
          <Card className="col-span-full text-center py-12 max-w-4xl">
            <CardHeader>
              <CardTitle className="font-headline">暂无文章</CardTitle>
              <CardDescription>请稍后再回来查看新内容！</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
}
