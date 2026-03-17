'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';

export default function PostCardStats() {
  const [stats, setStats] = useState<{ likes: number; comments: number } | null>(null);

  useEffect(() => {
    // This code runs only on the client, after hydration
    setStats({
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
    });
  }, []);

  if (!stats) {
    return (
        <>
            <div className="flex items-center gap-2">
                <ThumbsUp className="h-3 w-3" />
                <span>-</span>
            </div>
            <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                <span>-</span>
            </div>
        </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <ThumbsUp className="h-3 w-3" />
        <span>{stats.likes}</span>
      </div>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-3 w-3" />
        <span>{stats.comments}</span>
      </div>
    </>
  );
}
