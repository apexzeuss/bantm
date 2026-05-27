'use client';

import { useEffect, useState } from 'react';

type Item = {
  tag: string;
  text: string;
  source: string;
  url?: string;
};

/** Curated fallback if the news API is unavailable. */
const FALLBACK: Item[] = [
  { tag: 'FRA', text: 'Mbappé named France captain, Deschamps locks in final 26-man squad', source: 'L\'Équipe' },
  { tag: 'ARG', text: 'Messi brace in Argentina friendly vs Mexico in Houston', source: 'TyC Sports' },
  { tag: 'BRA', text: 'Vinicius Jr passes fitness test ahead of Brazil\'s group opener', source: 'Globo' },
  { tag: 'ENG', text: 'Bellingham, Saka, Foden confirmed in England 26-man final list', source: 'BBC Sport' },
  { tag: 'USA', text: 'Mercedes-Benz Stadium passes FIFA inspection, ready to host opener', source: 'ESPN FC' },
  { tag: 'POR', text: 'Cristiano Ronaldo eyes fifth World Cup, named Portugal captain again', source: 'A Bola' },
  { tag: 'ESP', text: 'Lamine Yamal headlines Spain\'s 26 as youngest in squad history', source: 'MARCA' },
  { tag: 'GER', text: 'Germany name new captain after Müller retires from international duty', source: 'Bild' },
  { tag: 'MEX', text: 'Sánchez: "Home advantage carries Mexico to the semi-finals"', source: 'ESPN Deportes' },
  { tag: 'NED', text: 'Netherlands lose Frenkie de Jong to last-minute hamstring injury', source: 'NOS' },
  { tag: 'NGA', text: 'Super Eagles squad: Osimhen leads attack, Lookman returns to wing', source: 'BBC Africa' },
  { tag: 'CRO', text: 'Modrić to captain Croatia in what coach Dalić calls "his farewell tour"', source: 'HRT' },
];

export function LiveTicker() {
  const [items, setItems] = useState<Item[]>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          setLive(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="border-y border-[#1F2538] bg-[#0A0E1A] overflow-hidden">
      <div className="relative h-10 flex items-center">
        <span className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-[#FF4D6D] text-white text-[10px] font-black uppercase tracking-widest live-pulse">
          <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {live ? 'LIVE NEWS' : 'NEWS'}
        </span>
        <div className="overflow-hidden ticker-mask w-full">
          <div className="ticker-track flex gap-10 whitespace-nowrap pl-32 text-sm">
            {doubled.map((item, i) => {
              const content = (
                <span className="inline-flex items-center gap-2 text-[#8B92A8]">
                  <span className="font-mono text-[10px] font-bold text-[#00D26A]">[{item.tag}]</span>
                  <span className="text-white">{item.text}</span>
                  <span className="text-[#1F2538] ml-2">·</span>
                </span>
              );
              return item.url ? (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                >
                  {content}
                </a>
              ) : (
                <span key={i}>{content}</span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
