"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ChevronDown, Menu, Search, X } from 'lucide-react';

import type { NavigationItem, SiteSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { Input } from '../ui/input';

type SiteHeaderProps = {
  settings: SiteSettings;
};

export default function SiteHeader({ settings }: SiteHeaderProps) {
  const { navigation, siteTitle, theme } = settings;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState<string[]>([]);
  const [openDesktopMenuId, setOpenDesktopMenuId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  const hasHero =
    pathname === '/' ||
    pathname === '/category' ||
    pathname.startsWith('/category/') ||
    pathname.startsWith('/posts/') ||
    pathname === '/friends';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setOpenDesktopMenuId((current) => (current === null ? current : null));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMobileMenus([]);
    setOpenDesktopMenuId(null);
  }, [pathname]);

  const headlineFontClass = theme.headlineFont === 'Space Grotesk' ? 'font-headline' : '';
  const isScrolledOrMenuOpen = scrolled || menuOpen;
  const isTransparent = hasHero && !isScrolledOrMenuOpen;
  const shouldUseTransparentLightText = mounted && isTransparent && resolvedTheme !== 'dark';
  const textColorClass = shouldUseTransparentLightText ? 'text-white' : 'text-foreground';
  const desktopNavButtonClass = isTransparent
    ? `${textColorClass} hover:bg-white/10 hover:text-white`
    : 'text-foreground hover:bg-accent hover:text-accent-foreground';
  const desktopDropdownTriggerClass = cn(
    desktopNavButtonClass,
    'border border-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
    isTransparent
      ? 'data-[state=open]:border-white/20 data-[state=open]:bg-white/12 data-[state=open]:shadow-sm focus-visible:border-white/20 focus-visible:bg-white/12 focus-visible:shadow-sm'
      : 'data-[state=open]:border-transparent data-[state=open]:bg-accent data-[state=open]:shadow-sm focus-visible:border-transparent focus-visible:bg-accent focus-visible:shadow-sm'
  );

  const toggleMobileMenuSection = (id: string) => {
    setOpenMobileMenus((current) =>
      current.includes(id)
        ? current.filter((sectionId) => sectionId !== id)
        : [...current, id]
    );
  };

  const getLinkProps = (href: string) => {
    const isExternal = /^https?:\/\//i.test(href);

    return isExternal
      ? {
          href,
          target: '_blank',
          rel: 'noreferrer noopener',
        }
      : {
          href,
        };
  };

  const renderDesktopDropdownItems = (items: NavigationItem[]) =>
    items.map((item) => {
      if (item.items?.length) {
        return (
          <DropdownMenuSub key={item.id}>
            <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {item.href ? (
                <>
                  <DropdownMenuItem asChild>
                    <a {...getLinkProps(item.href)} onClick={() => setOpenDesktopMenuId(null)}>
                      {item.label}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}
              {renderDesktopDropdownItems(item.items)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      }

      if (!item.href) {
        return null;
      }

      return (
        <DropdownMenuItem key={item.id} asChild>
          <a {...getLinkProps(item.href)} onClick={() => setOpenDesktopMenuId(null)}>
            {item.label}
          </a>
        </DropdownMenuItem>
      );
    });

  const renderDesktopNavigationItem = (item: NavigationItem) => {
    if (!item.items?.length) {
      if (!item.href) {
        return null;
      }

      return (
        <Button key={item.id} variant="ghost" asChild className={desktopNavButtonClass}>
          <Link href={item.href} prefetch={false}>{item.label}</Link>
        </Button>
      );
    }

    return (
      <DropdownMenu
        key={item.id}
        modal={false}
        open={openDesktopMenuId === item.id}
        onOpenChange={(open) => setOpenDesktopMenuId(open ? item.id : null)}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={desktopDropdownTriggerClass}>
            {item.label}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={10}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="min-w-48 rounded-xl border-white/15 bg-background/95 p-1.5 shadow-xl backdrop-blur-md"
        >
          {item.href ? (
            <>
              <DropdownMenuItem asChild>
                <a {...getLinkProps(item.href)} onClick={() => setOpenDesktopMenuId(null)}>
                  {item.label}
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {renderDesktopDropdownItems(item.items)}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderMobileNavigationItems = (items: NavigationItem[], level = 0) =>
    items.map((item) => {
      const hasChildren = Boolean(item.items?.length);
      const isOpen = openMobileMenus.includes(item.id);
      const paddingLeft = `${level * 0.75}rem`;

      if (!hasChildren) {
        if (!item.href) {
          return null;
        }

        return (
          <Button
            key={item.id}
            variant="ghost"
            asChild
            className="w-full justify-start py-6 text-lg"
            style={{ paddingLeft }}
          >
            <Link href={item.href} prefetch={false} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          </Button>
        );
      }

      return (
        <div key={item.id} className="space-y-2">
          {item.href ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="flex-1 justify-start py-6 text-lg"
                style={{ paddingLeft }}
              >
                <Link href={item.href} prefetch={false} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => toggleMobileMenuSection(item.id)}
              >
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')}
                />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between py-6 text-lg"
              style={{ paddingLeft }}
              onClick={() => toggleMobileMenuSection(item.id)}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')}
              />
            </Button>
          )}

          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="ml-4 space-y-2 border-l border-border/60 pl-3">
              {renderMobileNavigationItems(item.items ?? [], level + 1)}
            </div>
          </div>
        </div>
      );
    });

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-30 transition-all duration-300',
        scrolled && hasHero ? 'top-4' : 'top-0'
      )}
    >
      <div
        className={cn(
          'container mx-auto px-4 transition-all duration-300',
          isScrolledOrMenuOpen || !hasHero ? 'max-w-4xl' : 'max-w-full'
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden transition-all duration-300',
            isScrolledOrMenuOpen || !hasHero
              ? 'rounded-xl border bg-background/80 shadow-lg backdrop-blur-sm'
              : 'bg-transparent'
          )}
        >
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link
              href="/"
              className={cn('text-xl font-bold tracking-tight', headlineFontClass, textColorClass)}
              suppressHydrationWarning
            >
              {siteTitle}
            </Link>

            <div className="hidden flex-wrap items-center space-x-1 md:flex">
              {navigation.map(renderDesktopNavigationItem)}
              <div className="relative pl-2">
                <Search
                  className={cn(
                    'absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2',
                    isTransparent ? 'text-gray-300' : 'text-muted-foreground'
                  )}
                />
                <Input
                  placeholder="搜索..."
                  className={cn(
                    'h-9 w-32 rounded-full border-0 pl-9 transition-all focus:w-48',
                    isTransparent
                      ? 'bg-white/20 text-white placeholder:text-gray-300'
                      : 'bg-background focus:bg-white'
                  )}
                />
              </div>
            </div>

            <div className="md:hidden">
              <Button
                onClick={() => setMenuOpen((current) => !current)}
                variant="ghost"
                size="icon"
                className={cn(textColorClass, isTransparent ? 'hover:bg-white/20' : 'hover:bg-accent')}
              >
                <Menu
                  className={cn(
                    'h-5 w-5 transition-transform duration-300',
                    menuOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
                  )}
                />
                <X
                  className={cn(
                    'absolute h-5 w-5 transition-transform duration-300',
                    menuOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                  )}
                />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'transition-all duration-500 ease-in-out md:hidden',
              menuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="flex flex-col space-y-2 p-4 pt-0">{renderMobileNavigationItems(navigation)}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
