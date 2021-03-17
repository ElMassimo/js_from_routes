<h2 align='center'><samp>@js-from-routes/core</samp></h2>

<p align='center'>URL interpolation and JSON transform utilities</p>

<p align='center'>
  <a href='https://www.npmjs.com/package/@js-from-routes/core'>
    <img src='https://img.shields.io/npm/v/@js-from-routes/core?color=222&style=flat-square'>
  </a>
  <a href='https://github.com/ElMassimo/js_from_routes/blob/main/LICENSE.txt'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg'>
  </a>
</p>

<br>

[js_from_routes]: https://github.com/ElMassimo/js_from_routes

## Installation 💿

Normally you wouldn't need to install it manually, instead follow the instructions
of [<kbd>js_from_routes</kbd>][js_from_routes].

```bash
npm i @js-from-routes/core # yarn add @js-from-routes/core
```

## Usage 🚀

```ts
import { formatUrl } from '@js-from-routes/core'

formatUrl('/video_clips/:id/download', { id: 5 }) == '/video_clips/5/download'
```

## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
