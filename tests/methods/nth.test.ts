import { collect } from '../../src'

describe('nth()', () => {
  const data = [
    {
      letter: 'a'
    },
    {
      letter: 'b'
    },
    {
      letter: 'c'
    },
    {
      letter: 'd'
    },
    {
      letter: 'e'
    },
    {
      letter: 'f'
    },
    {
      letter: 'g'
    },
    {
      letter: 'h'
    },
    {
      letter: 'i'
    }
  ]
  const collection = collect(data)

  it('should create a new collection consisting of every n-th element', () => {
    const nth4 = collection.nth(4)
    expect(nth4).toEqual([
      {
        letter: 'a'
      },
      {
        letter: 'e'
      },
      {
        letter: 'i'
      }
    ])
  })

  it('should return all items when receiving 1 as the first argument', () => {
    const nth1 = collection.nth(1)
    expect(nth1).toEqual(data)
  })

  it('should accept offset as the second argument', () => {
    const nth4offset1 = collection.nth(4, 1)
    expect(nth4offset1).toEqual([
      {
        letter: 'b'
      },
      {
        letter: 'f'
      }
    ])

    const nth4offset3 = collection.nth(4, 3)
    expect(nth4offset3).toEqual([
      {
        letter: 'd'
      },
      {
        letter: 'h'
      }
    ])
  })
})
