'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BackToTopButtonProps = {
  showAfter: number;
};

export default function BackToTopButton({ showAfter }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  const normalizedShowAfter = useMemo(() => Math.max(0, showAfter), [showAfter]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY >= normalizedShowAfter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [normalizedShowAfter]);

  const handleBackToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <Button
      type="button"
      size="icon"
      onClick={handleBackToTop}
      aria-label="返回顶部"
      className={cn(
        'fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/75',
        'dark:border-white/20 dark:bg-zinc-950/80 dark:text-white dark:shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] dark:ring-1 dark:ring-white/10',
        'transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white',
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <ArrowUp className="h-4 w-4 text-current" />
    </Button>
  );
}
