import { collect } from '../../src'

describe('mapInto()', () => {
  class Person {
    public name: string

    constructor(item: { name: string }) {
      this.name = item.name
    }

    uppercase(): void {
      this.name = this.name.toUpperCase()
    }
  }

  const collection = collect([{ name: 'Firmino' }, { name: 'Mané' }])

  it('should map into a class', () => {
    const data = collection.mapInto(Person)
    expect(data).toBeInstanceOf(Array)

    expect(data.first()).toEqual(new Person({ name: 'Firmino' }))
    expect(data.last()).toEqual(new Person({ name: 'Mané' }))
  })

  it('should trigger the callback after apply class instance', () => {
    const data = collection.mapInto(Person, (person) => {
      person.uppercase()
    })

    expect(data.first()).toEqual(new Person({ name: 'FIRMINO' }))
    expect(data.last()).toEqual(new Person({ name: 'MANÉ' }))
  })
})
