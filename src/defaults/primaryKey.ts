/* eslint-disable @typescript-eslint/no-unused-vars */

import type Collection from '../Collection'
import type { ItemData } from '../types'

function primaryKey<T extends ItemData>({
  collection
}: {
  collection: Collection<T>
}): string {
  return 'id'
}

export default primaryKey
