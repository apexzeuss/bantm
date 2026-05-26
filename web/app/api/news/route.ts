import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour to stay well under NewsAPI's 100/day free quota.

type NewsApiArticle = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
};

type NewsApiResponse =
  | { status: 'ok'; totalResults: number; articles: NewsApiArticle[] }
  | { status: 'error'; code: string; message: string };

type TickerItem = {
  tag: string;
  text: string;
  source: string;
  url: string;
  publishedAt: string;
};

/**
 * Pull the most-likely team tag out of a headline. Order matters: more specific
 * (multi-word, distinctive) patterns first so a Colombia headline mentioning
 * "James Rodriguez" doesn't get mis-tagged via a Spain "Rodri" partial match.
 */
function inferTag(title: string): string {
  const teamPatterns: Array<[RegExp, string]> = [
    [/\bcolombia\b|james rodr[íi]guez|luis d[íi]az/i, 'COL'],
    [/\bargentina\b|\bmessi\b|lautaro\s+mart[íi]nez/i, 'ARG'],
    [/\bbrazil\b|vin[íi]cius|rodrygo|\bneymar\b/i, 'BRA'],
    [/\bfrance\b|mbapp[ée]|deschamps|\bdembele\b/i, 'FRA'],
    [/\bengland\b|bellingham|harry kane|\bsaka\b|\bfoden\b/i, 'ENG'],
    [/\bspain\b|lamine yamal|\bla roja\b|\bpedri\b/i, 'ESP'],
    [/\bgermany\b|toni kroos|\bwirtz\b|musiala/i, 'GER'],
    [/\bportugal\b|cristiano ronaldo/i, 'POR'],
    [/\bnetherlands\b|frenkie de jong|\bgakpo\b|memphis depay/i, 'NED'],
    [/\bitaly\b|donnarumma|gattuso|baldini/i, 'ITA'],
    [/\bbelgium\b|de bruyne|romelu lukaku/i, 'BEL'],
    [/\bcroatia\b|modri[ćc]/i, 'CRO'],
    [/\buruguay\b|federico valverde|darwin n[úu][ñn]ez/i, 'URU'],
    [/usmnt|\bunited states\b|christian pulisic/i, 'USA'],
    [/\bmexico\b|\bm[ée]xico\b/i, 'MEX'],
    [/\bcanada\b|alphonso davies/i, 'CAN'],
    [/\bmorocco\b|hakimi/i, 'MAR'],
    [/\bsenegal\b|sadio man[ée]/i, 'SEN'],
    [/\bjapan\b|samurai blue|\bkubo\b|\bmitoma\b/i, 'JPN'],
    [/south korea|\bkorea\b|son heung-?min/i, 'KOR'],
    [/\baustralia\b|socceroos/i, 'AUS'],
    [/\bdenmark\b|h[øo]jlund|\beriksen\b/i, 'DEN'],
    [/\bpoland\b|lewandowski/i, 'POL'],
    [/\bnigeria\b|osimhen|\blookman\b|super eagles/i, 'NGA'],
    [/\becuador\b/i, 'ECU'],
    [/\bchile\b|alexis s[áa]nchez/i, 'CHI'],
    [/\bghana\b/i, 'GHA'],
    [/\bcameroon\b|onana/i, 'CMR'],
    [/\bswitzerland\b|swiss/i, 'SUI'],
    [/\bserbia\b/i, 'SRB'],
    [/\bscotland\b/i, 'SCO'],
    [/\bwales\b/i, 'WAL'],
  ];
  for (const [pattern, tag] of teamPatterns) {
    if (pattern.test(title)) return tag;
  }
  return 'WC';
}

export async function GET() {
  const key = process.env.NEWSAPI_KEY;
  if (!key) {
    return NextResponse.json({ items: [], error: 'no-key' }, { status: 200 });
  }

  const q = encodeURIComponent('"World Cup 2026" OR "FIFA World Cup"');
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${key}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'bantM/1.0' },
    });

    if (!res.ok) {
      return NextResponse.json({ items: [], error: `http-${res.status}` }, { status: 200 });
    }

    const data: NewsApiResponse = await res.json();

    if (data.status !== 'ok') {
      return NextResponse.json({ items: [], error: data.message }, { status: 200 });
    }

    const items: TickerItem[] = data.articles
      .filter((a) => a.title && !a.title.toLowerCase().startsWith('[removed]'))
      .slice(0, 20)
      .map((a) => ({
        tag: inferTag(a.title),
        text: a.title.replace(/\s+-\s+[^-]+$/, '').trim(),
        source: a.source.name,
        url: a.url,
        publishedAt: a.publishedAt,
      }));

    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json(
      { items: [], error: e instanceof Error ? e.message : 'fetch failed' },
      { status: 200 },
    );
  }
}
