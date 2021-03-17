<h2 align='center'><samp>@js-from-routes/client</samp></h2>

<p align='center'>Define path helpers to make API requests or interpolate URLs</p>

<p align='center'>
  <a href='https://www.npmjs.com/package/@js-from-routes/client'>
    <img src='https://img.shields.io/npm/v/@js-from-routes/client?color=222&style=flat-square'>
  </a>
  <a href='https://github.com/ElMassimo/js_from_routes/blob/main/LICENSE.txt'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg'>
  </a>
</p>

<br>

[js_from_routes]: https://github.com/ElMassimo/js_from_routes

## Installation 💿

```bash
npm i @js-from-routes/client # yarn add @js-from-routes/client
```

## Usage 🚀

```ts
import { formatUrl, request } from '@js-from-routes/client'

formatUrl('/video_clips/:id/download', { id: 5 }) == '/video_clips/5/download'

const video = await request('get', '/video_clips/:id', { id: 5 })
```

## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
