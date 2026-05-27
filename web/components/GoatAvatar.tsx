'use client';

import { useState } from 'react';
import type { Goat } from '@/lib/goats';

type Props = {
  goat: Goat | undefined;
  fallbackInitial?: string;
  size?: number;
  className?: string;
};

export function GoatAvatar({ goat, fallbackInitial = '?', size = 40, className = '' }: Props) {
  const [imgError, setImgError] = useState(false);

  if (goat && !imgError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden ${className}`}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 50% 30%, ${goat.color}, ${goat.color}66 60%, ${goat.color}33)`,
        }}
        title={`GOAT pick: ${goat.name}`}
      >
        <img
          src={goat.image}
          alt={goat.name}
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  if (goat && imgError) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-black ${className}`}
        style={{
          width: size,
          height: size,
          background: goat.color,
          color: goat.textColor,
          fontSize: size * 0.45,
          lineHeight: 1,
        }}
      >
        {goat.initials}
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-[#00D26A]/20 border border-[#00D26A]/40 flex items-center justify-center text-[#00D26A] font-black ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {fallbackInitial}
    </div>
  );
}
