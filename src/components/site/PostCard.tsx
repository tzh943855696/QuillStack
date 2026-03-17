import Link from 'next/link';
import Image from 'next/image';
import type { Article, AuthorSettings } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import PostCardStats from './PostCardStats';

type PostCardProps = {
  article: Article;
  author: AuthorSettings | null;
};

export default function PostCard({ article, author }: PostCardProps) {
  const categoryColor = article.category?.color || 'gray';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-[1.02] active:scale-[1.01] active:shadow-md">
        <div className="flex flex-col md:flex-row">
            {article.imageUrl && (
              <div className="w-full md:w-1/3 shrink-0 overflow-hidden">
                  <Link href={`/posts/${article.slug}`} className="block h-full">
                      <div className="aspect-[4/3] relative w-full">
                          <Image
                              src={article.imageUrl}
                              alt={article.imageHint || article.title}
                              data-ai-hint={article.imageHint}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                      </div>
                  </Link>
              </div>
            )}
            <div className="flex-grow flex flex-col p-6 md:p-8">
                {article.category ? (
                  <Link href={`/category/${article.category.id}`} className="w-fit mb-2 z-10">
                    <Badge 
                      style={{ 
                        // @ts-ignore
                        '--badge-bg-color': categoryColor,
                        '--badge-text-color': 'white'
                      }}
                      className="border-transparent bg-[var(--badge-bg-color)] text-[var(--badge-text-color)]"
                    >
                      {article.category.name}
                    </Badge>
                  </Link>
                ) : (
                   <Badge variant="secondary" className="w-fit mb-2">未分类</Badge>
                )}
                
                <h2 className="text-2xl font-bold font-headline mb-2">
                  <Link href={`/posts/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                </h2>
                <p className="text-muted-foreground text-base flex-grow mb-4">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                    {author && (
                        <Image src={author.avatarUrl} alt={author.avatarHint} width={24} height={24} className="rounded-full" />
                    )}
                    <span className="font-medium">{author?.name}</span>
                    
                    <PostCardStats />

                     <span className="hidden md:block">&bull;</span>
                    <time dateTime={article.publishedAt} className="hidden md:block">
                        {format(new Date(article.publishedAt), 'yyyy-MM-dd')}
                    </time>
                </div>
            </div>
        </div>
    </Card>
  );
}
