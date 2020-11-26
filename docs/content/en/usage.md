---
title: Usage
description: Learn how to use @eloqjs/collection in your project.
category: Getting Started
position: 4
---

<alert type="warning">This documentation still in development.</alert>

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
  const collection = context.collect(posts)
    .where('status', 'published')
    .sortBy('-publishedAt')
  ```

  </code-block>
</code-group>

### Vue

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

## Methods

<alert type="warning">This documentation still in development. Not all methods are yet listed.</alert>

