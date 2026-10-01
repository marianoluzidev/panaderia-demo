import type { IllustrationKey } from '../../types/article.ts'
import aceite from './aceite.svg'
import azucar from './azucar.svg'
import bolsas from './bolsas.svg'
import cajas from './cajas.svg'
import genericoDescartable from './generico-descartable.svg'
import genericoMateria from './generico-materia.svg'
import generico from './generico.svg'
import guantes from './guantes.svg'
import harina from './harina.svg'
import levadura from './levadura.svg'
import margarina from './margarina.svg'
import sal from './sal.svg'
import servilletas from './servilletas.svg'
import vasos from './vasos.svg'

export const illustrations: Record<IllustrationKey, string> = {
  harina,
  margarina,
  azucar,
  sal,
  levadura,
  aceite,
  vasos,
  bolsas,
  cajas,
  servilletas,
  guantes,
  generico,
  'generico-materia': genericoMateria,
  'generico-descartable': genericoDescartable,
}

export function illustrationFor(key: IllustrationKey): string {
  return illustrations[key]
}
