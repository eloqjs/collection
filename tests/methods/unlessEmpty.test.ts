import { collect } from '../../src'

describe('unlessEmpty()', () => {
  it('should execute the callback when the collection is not empty', () => {
    const collection = collect<{ name: string }>([])

    collection.unlessEmpty((c) => c.push({ name: 'Mohamed Salah' }))

    expect(collection).toEqual([])
  })

  it('should return the default value when the collection is not empty', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const collection = collect(data)

    collection.unlessEmpty((c) => c.push({ id: 4 }))

    expect(collection).toEqual([...data, { id: 4 }])
  })

  it('should return the default function when the collection is not empty', () => {
    const collection = collect<{ id: number }>([])

    collection.unlessEmpty(
      (c) => c.push({ id: 4 }),
      (c) => c.push({ id: 5 })
    )

    expect(collection).toEqual([{ id: 5 }])
  })

  it('should not execute the callback when the collection is not empty', () => {
    const players = [{ name: 'Roberto Firmino' }, { name: 'Sadio Mané' }]
    const collection = collect(players)

    collection.unlessEmpty((c) => c.push({ name: 'Mohamed Salah' }))

    expect(collection).toEqual([...players, { name: 'Mohamed Salah' }])
  })

  it('should execute the default when the collection is not empty', () => {
    const collection = collect([{ name: 'Sadio Mané' }])

    collection.unlessEmpty(
      (c) => c.push({ name: 'Mohamed Salah' }),
      (c) => c.push({ name: 'Xherdan Shaqiri' })
    )

    expect(collection).toEqual([
      { name: 'Sadio Mané' },
      { name: 'Mohamed Salah' }
    ])
  })
})
