---
title: Usage
description: Learn how to use @eloqjs/collection in your project.
category: Getting Started
position: 4
---

<code-group>
  <code-block label="collect()" active>

  ```js
  import collect from '@eloqjs/collection'
  
  const collection = collect(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
  <code-block label="new Collection()">

  ```js
  import { Collection } from '@eloqjs/collection'
  
  const collection = new Collection(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
</code-group>

## Frameworks

### Nuxt

The module globally injects `$collect` instance, meaning that you can access it anywhere
using `this.$collect`. For plugins, asyncData, nuxtServerInit and Middleware, you can access it from `context.$collect`.

```js 
const collection = this.$collect(posts)
  .where('status', 'published')
  .sortBy('-publishedAt')
```

### Vue

The plugin globally injects `$collect` instance, meaning that you can access it anywhere
using `this.$collect`.

```js 
const collection = this.$collect(posts)
  .where('status', 'published')
  .sortBy('-publishedAt')
```

## Methods

### `average()`

Alias for the [`avg()`](/usage#avg) method.

### `avg()`

The `avg` method returns the [average value](https://en.wikipedia.org/wiki/Average) of a given key:

<code-group>
  <code-block label="Usage" active>

  ```js
  collect([
    { name: 'Chair', price: 600 },
    { name: 'Desk', price: 900 },
    { name: 'Lamp', price: 150 }
  ]).avg('price');
  ```

  </code-block>
  <code-block label="Returns">

  ```js
  550
  ```

  </code-block>
</code-group>
