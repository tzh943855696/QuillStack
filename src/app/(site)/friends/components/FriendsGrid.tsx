'use client';

import { useState } from 'react';
import FriendCard from './FriendCard';
import type { FriendLink } from '@/lib/types';

interface FriendsGridProps {
  links: FriendLink[];
}

export default function FriendsGrid({ links }: FriendsGridProps) {
  // Use state initialized to true to avoid hydration mismatch and unnecessary re-render
  // The animation will still run due to CSS animation properties
  const [mounted] = useState(true);

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 cards-visible`}>
        {links.map((friend, index) => (
          <FriendCard key={friend.id} friend={friend} index={index} />
        ))}
      </div>

      {/* 入场动画样式 */}
      <style jsx global>{`
        .friend-card {
          opacity: 0;
          transform: translateY(20px);
          animation: card-enter 0.5s ease-out forwards;
        }
        
        .cards-visible .friend-card {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
