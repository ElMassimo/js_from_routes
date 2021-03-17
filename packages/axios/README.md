<h2 align='center'><samp>@js-from-routes/axios</samp></h2>

<p align='center'>Define path helpers to make API requests or interpolate URLs</p>

<p align='center'>
  <a href='https://www.npmjs.com/package/@js-from-routes/axios'>
    <img src='https://img.shields.io/npm/v/@js-from-routes/axios?color=222&style=flat-square'>
  </a>
  <a href='https://github.com/ElMassimo/js_from_routes/blob/main/LICENSE.txt'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg'>
  </a>
</p>

<br>

[client]: https://github.com/ElMassimo/js_from_routes/tree/main/packages/client
[js_from_routes]: https://github.com/ElMassimo/js_from_routes
[axios]: https://github.com/axios/axios

This package extends <kbd>[@js-from-routes/client][client]</kbd> to use [Axios].

It's useful when already using [axios], or when you have a complex API that requires [interceptors](https://github.com/axios/axios#interceptors) or [different instances](https://github.com/axios/axios#creating-an-instance).

## Installation 💿

```bash
npm i @js-from-routes/axios # yarn add @js-from-routes/axios
```

## Usage 🚀

```ts
import { formatUrl, request } from '@js-from-routes/axios'

formatUrl('/video_clips/:id/download', { id: 5 }) == '/video_clips/5/download'

const video = await request('get', '/video_clips/:id', { id: 5 })
```

## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
