'use client';

import Link from 'next/link';
import { ChevronRight, Home, FolderArchive, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type PixelBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function PixelBreadcrumb({ items, className }: PixelBreadcrumbProps) {
  return (
    <nav className={cn("relative z-20 mb-4 breadcrumb-fade-in", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-lg border shadow-lg mx-5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <div className="group flex items-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 px-2 py-1 text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    {item.icon && <span className="w-3 h-3">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center space-x-1 px-2 py-1 text-sm font-mono text-foreground font-medium">
                    {item.icon && <span className="w-3 h-3">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </div>
              
              {!isLast && (
                <span className="mx-2 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200">
                  <ChevronRight className="w-3 h-3" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// 预设的面包屑配置
export const breadcrumbPresets = {
  home: {
    label: '首页',
    href: '/',
    icon: <Home className="w-3 h-3" />,
  },
  category: {
    label: '分类',
    href: '/category',
    icon: <FolderArchive className="w-3 h-3" />,
  },
  posts: {
    label: '文章',
    href: '/posts',
    icon: <FileText className="w-3 h-3" />,
  },
};