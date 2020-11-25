---
title: Installation
description: How to install @eloqjs/collection in your project.
position: 2
category: Getting Started
---

<alert type="info">If you are using **Nuxt** or **Vue**, please follow their installation steps instead of this one.</alert>

Add `@eloqjs/collection` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @eloqjs/collection
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @eloqjs/collection
  ```

  </code-block>
</code-group>

Set up on `src/main.js`:

```js{}[src/main.js]
import { Collection } from '@eloqjs/collection'

Collection.config = {
  // Options
}
```

## Installing on Nuxt

The module globally injects `$collect` instance, meaning that you can access it anywhere
using `this.$collect`. For plugins, asyncData, nuxtServerInit and Middleware, you can access it from `context.$collect`.

### Module

Add `@eloqjs/nuxt-collection` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @eloqjs/nuxt-collection
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @eloqjs/nuxt-collection
  ```

  </code-block>
</code-group>

Then, add `@eloqjs/nuxt-collection` to the `modules` section of `nuxt.config.js`:

```js{}[nuxt.config.js]
{
  modules: [
    '@eloqjs/nuxt-collection',

    collection: {
      // Options
    }
  ]
}
```

### TypeScript

Add the types to your "types" array in tsconfig.json after the `@nuxt/types` (Nuxt 2.9.0+) or `@nuxt/vue-app` entry.

```json{}[tsconfig.json]
{
  "compilerOptions": {
    "types": [
      "@nuxt/types",
      "@eloqjs/nuxt-collection"
    ]
  }
}
```


## Installing on Vue

The plugin globally injects `$collect` instance, meaning that you can access it anywhere
using `this.$collect`.

### Plugin

Add `@eloqjs/collection` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @eloqjs/collection
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @eloqjs/collection
  ```

  </code-block>
</code-group>

Set up on `src/main.js`

```js{}[src/main.js]
import vue from 'vue'
import { collect, Collection } from '@eloqjs/collection'

Collection.config = {
  // Options
}

Vue.use('collect', collect)
```