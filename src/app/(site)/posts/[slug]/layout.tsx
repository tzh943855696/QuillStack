import type { ReactNode } from 'react';
import { getArticle, getSiteSettings } from '@/lib/data';
import PostHeader from '@/components/site/PostHeader';
import { notFound } from 'next/navigation';

export default async function PostLayout({
  children,
  params
}: {
  children: ReactNode,
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    notFound();
  }
  
  return (
    <>
      <PostHeader article={article} />
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
