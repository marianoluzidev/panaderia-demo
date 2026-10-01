import type { ArticleCategory, IllustrationKey } from '../types/article.ts'
import { normalizeSearchText } from './stockList.ts'

const knownIllustrations: readonly {
  keyword: string
  illustration: IllustrationKey
}[] = [
  { keyword: 'servilleta', illustration: 'servilletas' },
  { keyword: 'margarina', illustration: 'margarina' },
  { keyword: 'levadura', illustration: 'levadura' },
  { keyword: 'guante', illustration: 'guantes' },
  { keyword: 'harina', illustration: 'harina' },
  { keyword: 'aceite', illustration: 'aceite' },
  { keyword: 'azucar', illustration: 'azucar' },
  { keyword: 'bolsa', illustration: 'bolsas' },
  { keyword: 'caja', illustration: 'cajas' },
  { keyword: 'vaso', illustration: 'vasos' },
  { keyword: 'sal', illustration: 'sal' },
]

function matchesKeyword(name: string, keyword: string): boolean {
  if (keyword === 'sal') {
    return /(^|\s)sal(\s|$)/.test(name)
  }

  return name.includes(keyword)
}

export function resolveArticleIllustration(
  name: string,
  category: ArticleCategory,
): IllustrationKey {
  const normalized = normalizeSearchText(name.trim())

  for (const item of knownIllustrations) {
    if (matchesKeyword(normalized, item.keyword)) {
      return item.illustration
    }
  }

  return category === 'descartable' ? 'generico-descartable' : 'generico-materia'
}
