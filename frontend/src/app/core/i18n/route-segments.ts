export type LangCode = 'de' | 'pt' | 'en';

export const ROUTE_SEGMENTS: Record<LangCode, Record<string, string>> = {
  de: {
    article: 'artikel',
    areas: 'bereiche',
    authors: 'autoren',
    topic: 'thema',
    search: 'suche',
  },
  pt: {
    article: 'artigo',
    areas: 'areas',
    authors: 'autores',
    topic: 'tema',
    search: 'pesquisa',
  },
  en: {
    article: 'article',
    areas: 'areas',
    authors: 'authors',
    topic: 'topic',
    search: 'search',
  },
};

export const SUPPORTED_LANGS: LangCode[] = ['de', 'pt', 'en'];

/** Reverse lookup: given a segment like "artikel", find which key it maps to */
export function resolveSegment(segment: string): string | null {
  for (const lang of SUPPORTED_LANGS) {
    for (const [key, val] of Object.entries(ROUTE_SEGMENTS[lang])) {
      if (val === segment) return key;
    }
  }
  return null;
}
