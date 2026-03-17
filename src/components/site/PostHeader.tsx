'use client';

import Image from 'next/image';
import type { Article } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

type PostHeaderProps = {
  article: Article;
};

export default function PostHeader({ article }: PostHeaderProps) {
  const headlineFontClass = 'font-headline';
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <header className="bg-card text-card-foreground -mb-20">
      <div className="relative h-[40vh] w-full flex items-center justify-center text-center text-white">
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.imageHint || article.title}
            data-ai-hint={article.imageHint}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div 
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            isDark ? "bg-black/60" : "bg-black/50"
          )}
        />
        
        <div className="relative z-10 flex flex-col items-center px-4 max-w-4xl mx-auto">
            <h1 className={cn("text-4xl md:text-5xl font-bold tracking-tight", headlineFontClass)} suppressHydrationWarning>
              {article.title}
            </h1>
        </div>
      </div>
    </header>
  );
}
