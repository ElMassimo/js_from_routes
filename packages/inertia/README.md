<h2 align='center'><samp>@js-from-routes/inertia</samp></h2>

<p align='center'>Define path helpers to make API requests or interpolate URLs</p>

<p align='center'>
  <a href='https://www.npmjs.com/package/@js-from-routes/inertia'>
    <img src='https://img.shields.io/npm/v/@js-from-routes/inertia?color=222&style=flat-square'>
  </a>
  <a href='https://github.com/ElMassimo/js_from_routes/blob/main/LICENSE.txt'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg'>
  </a>
</p>

<br>

[client]: https://github.com/ElMassimo/js_from_routes/tree/main/packages/client
[js_from_routes]: https://github.com/ElMassimo/js_from_routes
[inertia.js]: https://github.com/inertiajs/inertia

This package extends <kbd>[@js-from-routes/client][client]</kbd> to use [Inertia.js].

It's useful when using [Inertia.js], since it allows request helpers to handle forms as well.

## Installation 💿

```bash
npm i @js-from-routes/inertia # yarn add @js-from-routes/inertia
```

## Usage 🚀

```ts
import { definePathHelper } from '@js-from-routes/inertia'

const get = definePathHelper('get', '/video_clips/:id')

get.path({ id: 5 }) == '/video_clips/5/download'

const video = await get({ id: 5 })
```

## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
