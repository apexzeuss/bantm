'use client';

import type { Goat } from '@/lib/goats';

type Props = {
  goat: Goat | undefined;
  fallbackInitial?: string;
  size?: number;
  className?: string;
};

export function GoatAvatar({ goat, fallbackInitial = '?', size = 40, className = '' }: Props) {
  if (goat) {
    return (
      <div
        className={`relative rounded-full flex items-center justify-center font-black overflow-hidden ${className}`}
        style={{
          width: size,
          height: size,
          background: goat.color,
          color: goat.textColor,
          fontSize: size * 0.45,
          lineHeight: 1,
        }}
        title={`GOAT pick: ${goat.name}`}
      >
        <span>{goat.initials}</span>
        <span
          className="absolute"
          style={{
            bottom: -size * 0.05,
            right: -size * 0.05,
            fontSize: size * 0.42,
            lineHeight: 1,
          }}
        >
          {goat.flag}
        </span>
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
