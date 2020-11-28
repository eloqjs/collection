---
title: Configuration
description: You can configure @eloqjs/collection with the Collection.config property in src/main.js.
category: Getting Started
position: 3
---

<alert type="warning">This documentation still in development.</alert>

<alert type="info">If you are using **Nuxt** or **Vue**, please follow their configuration steps instead of this one.</alert>

See the [API reference](/api/options) for a list of available options.

You can configure `@eloqjs/collection` with the `Collection.config` property in `src/main.js`.

```js{}[src/main.js]
import { Collection } from '@eloqjs/collection'

Collection.config = {
  // My custom configuration
}
```

## Frameworks

### Nuxt

<alert type="warning">The nuxt module [@eloqjs/nuxt-collection](https://github.com/eloqjs/nuxt-collection) will be released soon.</alert>

See the [API reference](/api/options) for a list of available options.

You can configure `@eloqjs/nuxt-collection` with the `collection` property in your `nuxt.config.js`.

```js{}[nuxt.config.js]
export default {
  collection: {
    // My custom configuration
  }
}
```

### Vue

See the [API reference](/api/options) for a list of available options.

You can configure `@eloqjs/vue-collection` by passing the options to `Vue.use` in `src/main.js`.

```js{}[src/main.js]
import vue from 'vue'
import Collection from '@eloqjs/vue-collection'

Vue.use(Collection, {
  // My custom configuration
})
```
