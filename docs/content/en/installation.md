---
title: Installation
description: How to install @eloqjs/collection in your project.
position: 2
category: Getting Started
---

<alert type="warning">This documentation still in development.</alert>

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


## Frameworks

### Nuxt

<alert type="warning">The nuxt module [@eloqjs/nuxt-collection](https://github.com/eloqjs/nuxt-collection) will be released soon.</alert>

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

#### TypeScript

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


### Vue

Add `@eloqjs/vue-collection` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @eloqjs/vue-collection
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @eloqjs/vue-collection
  ```

  </code-block>
</code-group>

Set up on `src/main.js`

```js{}[src/main.js]
import vue from 'vue'
import Collection from '@eloqjs/vue-collection'

Vue.use(Collection, {
  // Options
})
```
