"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Search, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

type SiteHeaderProps = {
  settings: SiteSettings;
};

export default function SiteHeader({ settings }: SiteHeaderProps) {
  const { navigation, siteTitle, theme } = settings;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  const hasHero = pathname === '/' || pathname === '/category' || pathname.startsWith('/category/') || pathname.startsWith('/posts/') || pathname === '/friends';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headlineFontClass = theme.headlineFont === 'Space Grotesk' ? 'font-headline' : '';
  
  const isScrolledOrMenuOpen = scrolled || menuOpen;
  const isTransparent = hasHero && !isScrolledOrMenuOpen;

  const textColorClass = isTransparent && resolvedTheme !== 'dark' ? 'text-white' : 'text-foreground';

  return (
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
        scrolled && hasHero ? "top-4" : "top-0"
      )}>
        <div className={cn(
          "container mx-auto px-4 transition-all duration-300",
          (isScrolledOrMenuOpen || !hasHero) ? "max-w-4xl" : "max-w-full"
        )}>
          <div className={cn(
            "relative overflow-hidden transition-all duration-300",
            (isScrolledOrMenuOpen || !hasHero) ? "bg-background/80 backdrop-blur-sm rounded-xl shadow-lg border" : "bg-transparent"
          )}>
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                <Link href="/" className={cn(
                    "text-xl font-bold tracking-tight", 
                    headlineFontClass,
                    textColorClass
                )} suppressHydrationWarning>
                  {siteTitle}
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1 flex-wrap">
                  {navigation.map(item => (
                      <Button key={item.id} variant="ghost" asChild className={cn(
                          isTransparent
                            ? `${textColorClass} hover:bg-white/10 hover:text-white`
                            : "text-foreground hover:bg-accent hover:text-accent-foreground" 
                      )}>
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                  ))}
                  <div className="relative pl-2">
                      <Search className={cn(
                          "absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4",
                          isTransparent ? "text-gray-300" : "text-muted-foreground"
                      )} />
                      <Input 
                        placeholder="搜索..." 
                        className={cn(
                            "border-0 rounded-full pl-9 w-32 focus:w-48 transition-all h-9",
                            isTransparent ? "bg-white/20 placeholder:text-gray-300 text-white" : "bg-background focus:bg-white"
                        )} 
                      />
                  </div>
                </div>

                {/* Mobile Navigation Trigger */}
                <div className="md:hidden">
                    <Button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          textColorClass,
                           isTransparent 
                              ? "hover:bg-white/20"
                              : "hover:bg-accent"
                        )}
                    >
                        <Menu className={cn("h-5 w-5 transition-transform duration-300", menuOpen ? "rotate-90 scale-0" : "rotate-0 scale-100")} />
                        <X className={cn("h-5 w-5 absolute transition-transform duration-300", menuOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0")} />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
            
            {/* Mobile Menu Content */}
            <div className={cn(
              "transition-all duration-500 ease-in-out md:hidden",
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}>
              <div className="flex flex-col space-y-2 p-4 pt-0">
                {navigation.map(item => (
                  <Button key={item.id} variant="ghost" asChild className="text-lg justify-start py-6">
                    <Link href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
}
