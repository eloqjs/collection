---
title: Configuration
description: You can configure @eloqjs/collection with the Collection.config property in src/main.js.
category: Getting Started
position: 3
---

<alert type="info">If you are using **Nuxt** or **Vue**, please follow their configuration steps instead of this one.</alert>

You can configure `@eloqjs/collection` with the `Collection.config` property in `src/main.js`.

```js{}[src/main.js]
import { Collection } from '@eloqjs/collection'

Collection.config = {
  // My custom configuration
}
```

## Frameworks

### Nuxt

You can configure `@eloqjs/nuxt-collection` with the `collection` property in your `nuxt.config.js`.

```js{}[nuxt.config.js]
export default {
  collection: {
    // My custom configuration
  }
}
```

### Vue

You can configure `@eloqjs/vue-collection` by passing the options to `Vue.use` in `src/main.js`.

```js{}[src/main.js]
import vue from 'vue'
import Collection from '@eloqjs/vue-collection'

Vue.use(Collection, {
  // My custom configuration
})
```


## Properties

### `primaryKey`

- Type: `() => string`
- Arguments: `({ collection })` 
- Default: `id`

The primary key of the items.

<code-group>
  <code-block label="JavaScript" active>

  ```js
  {
    primaryKey: ({ collection }) => {
      const item = collection.first()
  
      if (item.type === 'article') {
        return 'slug'
      }
      
      return 'id'
    }
  }
  ```

  </code-block>
  <code-block label="TypeScript">

  ```ts
  import { Collection, ItemData } from '@eloqjs/collection'
  
  {
    primaryKey: <T extends ItemData>({
      collection
    }: {
      collection: Collection<T>
    }): string => {
      const item = collection.first()
  
      if (item.type === 'article') {
        return 'slug'
      }
      
      return 'id'
    }
  }
  ```

  </code-block>
</code-group>

### `toQuery`

- Type: `() => Class`
- Arguments: `({ collection, item })`

If our items are Model classes with Query Builder, we can configure this option to
convert the collection into a Query Builder.

See [primaryKey()](/api/methods#primarykey) and [modelKeys()](/api/methods#modelkeys)

> This example is from `vue-api-query` integration.

<code-group>
  <code-block label="JavaScript" active>

  ```js
  {
    toQuery: ({ collection, item }) => {
      return item.newModelQuery().whereIn(
        collection.primaryKey(), collection.modelKeys()
      )
    }
  }
  ```

  </code-block>
  <code-block label="TypeScript">

  ```ts
  import { Collection, ItemData } from '@eloqjs/collection'
  
  {
    toQuery: <T extends ItemData>({
      collection,
      item
    }: {
      collection: Collection<T>
      item: T
    }): T => {
      const model = item.newModelQuery().whereIn(
        collection.primaryKey(), collection.modelKeys()
      )
      
      return (model as unknown) as T
    }
  }
  ```


  </code-block>
</code-group>

### `fresh`

- Type: `() => Promise`
- Arguments: `({ collection, include })`

If our items are Model classes with Query Builder, we can configure this option to
reload a fresh item instance from the database for all the items.

> This example is from `vue-api-query` integration.

<code-group>
  <code-block label="JavaScript" active>

  ```js
  {
    fresh: async ({ collection, include }) => {
      return await collection.toQuery().include(...include).$get()
    }
  }
  ```

  </code-block>
  <code-block label="TypeScript">

  ```ts
  import { Collection, ItemData } from '@eloqjs/collection'
  
  {
    fresh: async <T extends ItemData>({
      collection,
      include
    }: {
      collection: Collection<T>,
      include: string[]
    }): Promise<Collection<T>> => {
      const _collection = await collection.toQuery()
        .include(...include).$get()
      return (_collection as unknown) as Promise<Collection<T>>
    }
  }
  ```

  </code-block>
</code-group>
