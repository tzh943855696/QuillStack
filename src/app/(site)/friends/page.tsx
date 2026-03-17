import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail, FileText } from 'lucide-react';
import PixelBreadcrumb, { breadcrumbPresets } from '@/components/site/PixelBreadcrumb';
import FriendsGrid from './components/FriendsGrid';
import { getFriendLinks, getSiteSettings } from '@/lib/data';
import { getSiteUrl, buildUrl, truncateDescription } from '@/lib/seo';
import type { FriendLinkSettings } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl(settings);
  const friendData: FriendLinkSettings = await getFriendLinks();
  
  const title = `友情链接 | ${settings.siteTitle}`;
  const description = truncateDescription(friendData.description);

  return {
    title,
    description,
    keywords: [...(settings.seo?.keywords || []), '友链', '友情链接', '合作伙伴'],
    alternates: {
      canonical: buildUrl(siteUrl, '/friends'),
    },
    openGraph: {
      title,
      description,
      url: buildUrl(siteUrl, '/friends'),
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: '友情链接',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og/home.jpg`],
      creator: settings.seo?.twitterHandle,
    },
  };
}

export default async function FriendsPage() {
  const settings = await getSiteSettings();
  const friendData: FriendLinkSettings = await getFriendLinks();

  return (
    <>
      {/* Site Hero */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${settings.header.heroImageUrl})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
              友情链接
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
              {friendData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-5 -mt-4">
        <PixelBreadcrumb
          items={[
            breadcrumbPresets.home,
            { label: '友链', href: '/friends' }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-5 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* 友链网格 */}
          <FriendsGrid links={friendData.links} />

          {/* 申请友链 */}
          <Card className="mt-12 bg-gradient-to-br from-primary/5 via-card/50 to-secondary/5 border border-border/60">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                {/* 头部 */}
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold font-headline mb-2">
                      {friendData.applyInfo.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 font-body">
                      {friendData.applyInfo.description}
                    </p>
                    <Link 
                      href={`mailto:${friendData.applyInfo.email}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors font-body"
                    >
                      <Mail className="w-4 h-4" />
                      {friendData.applyInfo.email}
                    </Link>
                  </div>
                </div>

                {/* 协议内容 */}
                {friendData.applyInfo.agreement && (
                  <div className="border-t border-border/60 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">申请须知</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 md:p-6 overflow-x-auto">
                      <p 
                        className="text-sm text-muted-foreground font-body whitespace-pre-line leading-relaxed"
                      >
                        {friendData.applyInfo.agreement}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 统计 */}
          <div className="mt-12 flex items-center justify-center gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-mono font-bold text-primary">
                {friendData.links.length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-body">
                友链数量
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="space-y-1">
              <div className="text-3xl font-mono font-bold text-primary">
                {new Set(friendData.links.flatMap(l => l.tags)).size}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-body">
                技术标签
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
