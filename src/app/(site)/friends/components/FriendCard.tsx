'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { FriendLink } from '@/lib/types';

interface FriendCardProps {
  friend: FriendLink;
  index: number;
}

export default function FriendCard({ friend, index }: FriendCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <Link href={friend.url} target="_blank" rel="noopener noreferrer" className="block">
      <Card
        ref={cardRef}
        className="
          friend-card
          relative overflow-hidden
          bg-card/60 backdrop-blur-sm
          border border-border/60
          rounded-xl
          cursor-pointer
          group
        "
        style={{
          animationDelay: `${index * 100}ms`,
          '--mouse-x': `${mousePos.x}px`,
          '--mouse-y': `${mousePos.y}px`
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 鼠标跟随光效 */}
        <div 
          className={`
            pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: `radial-gradient(
              400px circle at var(--mouse-x) var(--mouse-y),
              hsl(var(--primary) / 0.15),
              transparent 40%
            )`
          }}
        />
        
        {/* 边框光效 */}
        <div 
          className={`
            pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: `radial-gradient(
              200px circle at var(--mouse-x) var(--mouse-y),
              hsl(var(--primary) / 0.4),
              transparent 60%
            )`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            padding: '1px'
          }}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            {/* 头像 */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted ring-2 ring-border/50 group-hover:ring-primary/30 transition-colors duration-300">
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 在线状态指示器 */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg font-headline truncate">
                  {friend.name}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-body">
                {friend.description}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1.5">
                {friend.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary font-body"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
