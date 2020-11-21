import { collect, Collection } from '../../src'

describe('pipeInto()', () => {
  class ResourceCollection {
    public collection: Collection<{ name: string }>

    constructor(collection: Collection<{ name: string }>) {
      this.collection = collection
    }

    doSomething() {
      return this.collection.first()
    }
  }

  const collection = collect([{ name: 'Firmino' }, { name: 'Mané' }])

  it('should pipe into a class', () => {
    const data = collection.pipeInto(ResourceCollection)

    expect(data).toBeInstanceOf(ResourceCollection)
    expect(data.collection).toEqual(collection)
    expect(data.doSomething()).toEqual({ name: 'Firmino' })
  })
})
