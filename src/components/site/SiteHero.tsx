'use client';

import Image from 'next/image';
import type { SiteSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

type SiteHeroProps = {
  settings: SiteSettings;
  size?: 'large' | 'medium';
};

export default function SiteHero({ settings, size = 'large' }: SiteHeroProps) {
  const { header, theme } = settings;

  const headlineFontClass = theme.headlineFont === 'Space Grotesk' ? 'font-headline' : '';

  const sizeClasses = {
    large: {
      container: 'h-[80vh]',
      avatar: 'h-32 w-32',
      title: 'text-4xl md:text-5xl',
      bio: 'text-lg',
    },
    medium: {
      container: 'h-[60vh]',
      avatar: 'h-24 w-24',
      title: 'text-3xl md:text-4xl',
      bio: 'text-base',
    },
  };
  const currentSize = sizeClasses[size];

  return (
      <div className={cn("relative w-full flex items-center justify-center text-center text-white bg-card -mb-12", currentSize.container)}>
        <Image
          src={header.heroImageUrl}
          alt={header.heroImageHint}
          data-ai-hint={header.heroImageHint}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 flex flex-col items-center px-4">
            <div className={cn("relative rounded-full border-4 border-background bg-background shrink-0 overflow-hidden shadow-lg mb-4", currentSize.avatar)}>
                <Image
                    src={header.avatarUrl}
                    alt={header.avatarHint}
                    data-ai-hint={header.avatarHint}
                    fill
                    sizes="128px"
                    className="object-cover"
                />
            </div>
            <h1 className={cn("font-bold tracking-tight", headlineFontClass, currentSize.title)} suppressHydrationWarning>
              {header.title}
            </h1>
            <p className={cn("mt-2 text-white/80 max-w-xl", currentSize.bio)} suppressHydrationWarning>{header.bio}</p>
        </div>
      </div>
  );
}
