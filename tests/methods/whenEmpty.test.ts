import { collect } from '../../src'

describe('whenEmpty()', () => {
  it('should execute the callback when the collection is empty', () => {
    const collection = collect<{ name: string }>([])

    collection.whenEmpty((c) => c.push({ name: 'Mohamed Salah' }))

    expect(collection).toEqual([{ name: 'Mohamed Salah' }])
  })

  it('should not execute the callback when the collection is empty', () => {
    const players = [{ name: 'Roberto Firmino' }, { name: 'Sadio Mané' }]
    const collection = collect(players)

    collection.whenEmpty((c) => c.push({ name: 'Mohamed Salah' }))

    expect(collection).toEqual(players)
  })

  it('should execute the default when the collection is empty', () => {
    const collection = collect([{ name: 'Sadio Mané' }])

    collection.whenEmpty(
      (c) => c.push({ name: 'Mohamed Salah' }),
      (c) => c.push({ name: 'Xherdan Shaqiri' })
    )

    expect(collection).toEqual([
      { name: 'Sadio Mané' },
      { name: 'Xherdan Shaqiri' }
    ])
  })
})
