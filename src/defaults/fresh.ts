/* eslint-disable @typescript-eslint/no-unused-vars */

import type Collection from '../Collection'
import type { ItemData } from '../types'

async function fresh<T extends ItemData>({
  collection,
  include
}: {
  collection: Collection<T>
  include: string[]
}): Promise<T[] | Collection<T>> {
  return await new Promise((resolve) => {
    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    // In this example, we use setTimeout(...) to simulate async code.
    // In reality, you will probably be using something like XHR or an HTML5 API.
    setTimeout(() => {
      resolve(collection)
    }, 250)
  })
}

export default fresh
