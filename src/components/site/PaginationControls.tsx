'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import type { Article, AuthorSettings } from '@/lib/types';
import PostCard from './PostCard';

type PaginationControlsProps = {
  articles: Article[];
  postsPerPage: number;
  baseUrl: string;
  author: AuthorSettings | null;
};

export default function PaginationControls({
  articles,
  postsPerPage,
  baseUrl,
  author,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const totalPages = Math.ceil(articles.length / postsPerPage);

  const paginatedArticles = articles.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    const queryString = params.toString();
    // For the first page, we want a clean URL without "?page=1"
    if (pageNumber === 1) {
      // Base URL for category pages should not be just "/"
      if (baseUrl.startsWith('/category/') && params.has('page')) {
         params.delete('page');
         const remainingParams = params.toString();
         return `${baseUrl}${remainingParams ? `?${remainingParams}`: ''}`;
      }
      return baseUrl === '/' ? '/' : baseUrl.split('?')[0];
    }
    return `${baseUrl.split('?')[0]}?${queryString}`;
  };

  const getPaginationItems = () => {
    const items: (number | '...')[] = [];
    const showPages = 2; // number of pages to show around the current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      if (currentPage > showPages + 1) {
        items.push('...');
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= showPages) {
         end = 3;
      }
      if (currentPage > totalPages - showPages) {
         start = totalPages - 2;
      }

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (currentPage < totalPages - showPages) {
        items.push('...');
      }
      items.push(totalPages);
    }
    return items;
  };
  
  const paginationItems = getPaginationItems();

  return (
    <div>
      <div className="space-y-8 max-w-4xl">
        {paginatedArticles.map(article => (
          <PostCard key={article.id} article={article} author={author} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center max-w-4xl">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createPageURL(currentPage - 1)}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : undefined}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              
              {paginationItems.map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {typeof page === 'number' ? (
                    <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href={createPageURL(currentPage + 1)}
                  aria-disabled={currentPage >= totalPages}
                  tabIndex={currentPage >= totalPages ? -1 : undefined}
                  className={
                    currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
