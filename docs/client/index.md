[Vite Rails]: https://vite-ruby.netlify.app/
[aliases]: https://vite-ruby.netlify.app/guide/development.html#import-aliases-%F0%9F%91%89
[codegen]: /guide/codegen
[axios]: https://github.com/axios/axios
[redaxios]: https://github.com/developit/redaxios
[Inertia.js]: https://github.com/inertiajs/inertia
[@js-from-routes/client]: https://github.com/ElMassimo/js_from_routes/tree/main/packages/client
[@js-from-routes/axios]: https://github.com/ElMassimo/js_from_routes/tree/main/packages/axios
[@js-from-routes/inertia]: https://github.com/ElMassimo/js_from_routes/tree/main/packages/inertia
[@js-from-routes/redaxios]: https://github.com/ElMassimo/js_from_routes/tree/main/packages/redaxios
[client_library]: /config/#client-library
[easily submit forms]: https://github.com/ElMassimo/pingcrm-vite/blob/05e462cbed63ef150b1e1f12c984ef03a2e485aa/app/javascript/Pages/Contacts/Edit.vue#L24
[config.ts]: https://github.com/ElMassimo/js_from_routes/blob/main/packages/client/src/config.ts
[@rails/ujs]: https://github.com/rails/rails/tree/main/actionview/app/assets/javascripts
[extracted]: https://github.com/ElMassimo/js_from_routes/blob/babeae83294efe58c4fa6bea0d76b5e146b0b92a/packages/client/src/config.ts#L37-L42

# Client Libraries

Several JS packages are provided to handle URL interpolation and requests.

You can select which one to use by configuring <kbd>[client_library]</kbd>, which also enables you to target your own code instead.

#### <kbd>[@js-from-routes/client]</kbd>

The default client. Uses `fetch` to avoid additional dependencies.

#### <kbd>[@js-from-routes/axios]</kbd>

Choose it if already using [axios], or have a [complex use case](https://github.com/axios/axios#creating-an-instance) with extensive usage of [interceptors](https://github.com/axios/axios#interceptors).

#### <kbd>[@js-from-routes/inertia]</kbd>

Allows you to [easily submit forms] and make requests using your existing configuration in [Inertia.js].

#### <kbd>[@js-from-routes/redaxios]</kbd>

Choose it if already using [redaxios], for consistency within your codebase.

## Usage 🚀

The methods are fully typed, and documented using JSDoc.

Here a few examples when using <kbd>[@js-from-routes/client]</kbd>, more examples coming soon.

### Importing helpers

If you use [Vite Rails], [aliases] will allow you to import these files as:

```js
import VideoClipsApi from '~/api/VideoClipsApi'
```

When using webpack, it's highly recommended to [add an alias](https://webpack.js.org/configuration/resolve/#resolvealias) to simplify imports.

### Passing parameters

You can pass a plain object as parameters; properties will be interpolated on any matching placeholders (`:id`) in the URL.

```js
const video = { id: 5, title: 'New Wave' }
VideoClipsApi.download.path(video) == "/video_clips/5/download"
```

Missing parameters will throw an error providing the full context.

### Submitting data

You can pass `data` to specify the request body, just like in [axios].

```js
VideoClipsApi.update({ params: video, data: { title: 'New Waves' } })
```

By default, the CSRF token will be [extracted] using the same conventions in <kbd>[@rails/ujs]</kbd>.

### Obtaining the raw response

By default, JSON responses are automatically unwrapped.

If you need access to the response, or are using MIME types, pass `responseAs`:

```js
const response = await VideoClipsApi.download({ params: video, responseAs: 'response' })
```

The type of the response object depends on which library you are using.

For example, it will be an `AxiosResponse` if using <kbd>[@js-from-routes/axios]</kbd>.

## Configuring Requests ⚙️

You can configure the defaults in all clients by using `Config`:

```js
import { Config } from '@js-from-routes/client'

Config.baseUrl = process.env.API_BASE_URL
```

#### Disabling Case Conversion

By default, object keys are `camelCased` when deserialized, and `snake_cased`
when sent back to the server, but you can disable this behavior.

```js
const noop = val => val
Config.deserializeData = noop
Config.serializeData = noop
```

#### Other Options

You can provide default headers, intercept all requests, handle response errors, and more.

A new section documenting all available configuration options will be added soon.

In the meantime, refer to [the source code][config.ts].
