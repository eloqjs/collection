/* eslint-disable @typescript-eslint/no-unused-vars */

import type Collection from '../Collection'
import type { ItemData } from '../types'

function toQuery<T extends ItemData>({
  collection,
  item
}: {
  collection: Collection<T>
  item: T
}): T {
  return item
}

export default toQuery
