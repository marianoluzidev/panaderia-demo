import type { IllustrationKey } from '../../types/article.ts'
import { illustrationFor } from '../../assets/products/index.ts'

type ArticleIllustrationProps = {
  illustration: IllustrationKey
}

export function ArticleIllustration({ illustration }: ArticleIllustrationProps) {
  return (
    <img
      src={illustrationFor(illustration)}
      alt=""
      width={56}
      height={56}
      className="size-14 shrink-0 rounded-2xl"
    />
  )
}
