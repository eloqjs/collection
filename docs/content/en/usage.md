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
