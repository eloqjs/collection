---
title: Usage
description: Learn how to use @eloqjs/collection in your project.
category: Getting Started
position: 4
---

<alert type="warning">This documentation still in development.</alert>

See the [API reference](/api/methods) for a list of available methods.

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

<alert type="warning">The nuxt module [@eloqjs/nuxt-collection](https://github.com/eloqjs/nuxt-collection) will be released soon.</alert>

See the [API reference](/api/methods) for a list of available methods.

The module globally injects `$collect` instance, meaning that you can access it anywhere
using `this.$collect`. For plugins, asyncData, nuxtServerInit and Middleware, you can access it from `context.$collect`.

<code-group>
  <code-block label="this.$collect()" active>

  ```js 
  const collection = this.$collect(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
  <code-block label="context.$collect()">

  ```js 
  const collection = context.$collect(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
</code-group>

### Vue

See the [API reference](/api/methods) for a list of available methods.

The plugin globally injects `$collect` instance, meaning that you can access it anywhere
using `this.$collect`. You can also access it from `Vue.collect`.

<code-group>
  <code-block label="this.$collect()" active>

  ```js 
  const collection = this.$collect(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
  <code-block label="Vue.collect()">

  ```js 
  const collection = Vue.collect(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
</code-group>
