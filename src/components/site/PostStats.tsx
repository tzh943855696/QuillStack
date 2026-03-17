'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle } from 'lucide-react';

export default function PostStats() {
  const [stats, setStats] = useState<{ views: string; comments: number } | null>(null);

  useEffect(() => {
    // This code runs only on the client, after hydration
    setStats({
      views: (Math.random() * 2).toFixed(2) + 'k',
      comments: Math.floor(Math.random() * 10),
    });
  }, []);

  if (!stats) {
    return (
      <Button variant="outline" className="rounded-full" disabled>
        <MessageCircle className="mr-2" />
        加载中...
      </Button>
    );
  }

  return (
    <div className='flex items-center gap-4'>
        <div className="flex items-center space-x-2 text-sm">
            <Eye className="h-4 w-4" />
            <span>{stats.views}</span>
        </div>
        <Button variant="outline" className="rounded-full">
            <MessageCircle className="mr-2" />
            {stats.comments} 条评论
        </Button>
    </div>
  );
}
