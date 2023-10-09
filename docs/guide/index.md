[library]: https://github.com/ElMassimo/js_from_routes
[GitHub Issues]: https://github.com/ElMassimo/js_from_routes/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc
[GitHub Discussions]: https://github.com/ElMassimo/js_from_routes/discussions
[client]: /client/
[config]: /config/
[rails bytes]: https://railsbytes.com/templates/X6ksgn
[codegen]: /guide/codegen
[path]: /client/#passing-parameters
[request]: /client/#submitting-data
[all helpers]: /config/#all-helpers-file
[ping]: https://github.com/ElMassimo/pingcrm-vite

[development]: /client/
[routes]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L6
[export false]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L18

# Getting Started

If you are interested to learn more about JS From Routes before trying it, check out the [Introduction](./introduction).

## Installation 💿

For a one-line installation, you can [run this][rails bytes]:

```bash
rails app:template LOCATION='https://railsbytes.com/script/X6ksgn'
```

Or, add this line to your application's Gemfile in the `development` group and execute `bundle`:

```ruby
group :development, :test do
  gem 'js_from_routes'
end
```

And then, add a [client library][client] to your `package.json`:

```bash
npm install @js-from-routes/client # yarn add @js-from-routes/client
```

## Usage 🚀

Once the library is installed, all you need to do is:

### Export the routes

Use `export: true` to specify which [routes] should be taken into account when generating JS.

```ruby {2}
Rails.application.routes.draw do
  resources :video_clips, only: [:show], export: true do
    get :download, on: :member
  end

  # Or:
  defaults export: true do
    # All routes defined inside this block will be exported.
  end
end
```

It will cascade to any nested action or resource, but you can [opt out][export false] with `export: false`.

### Refresh the page

Rails' reloader will detect the changes, and path helpers will be [generated][codegen] for the exported actions.

```js
// app/frontend/api/VideoClipsApi.ts
import { definePathHelper } from '@js-from-routes/client'

export default {
  download: definePathHelper('get', '/video_clips/:id/download'),

  show: definePathHelper('get', '/video_clips/:id'),
}
```

A file will be generated per controller, with a path helper per exported action, although this is [fully customizable][codegen].

You can run <kbd>bin/rake js_from_routes:generate</kbd> to trigger generation manually.

### Use the generated helpers

Calling a helper will [make a request][request] and return a promise with the unwrapped JSON result.

```js
import { videoClips } from '~/api'

const video = await videoClips.show({ id: 'oHg5SJYRHA0' })
```

Use [`path`][path] when you only need the URL. It will interpolate parameters, such as `:id`.

```js
const downloadPath = videoClips.download.path(video)
```

You can also use an object that combines [all helpers].

```js
import api from '~/api'

const video = await api.videoClips.show({ id: 'oHg5SJYRHA0' })

const comments = await api.comments.index()
```

Depending on your use case, you may prefer to use this object instead of explicit imports.

## Onwards 🛣

You should now be able to get started with [JS From Routes][library].

Have in mind that code generation is [fully customizable][codegen]; this is just the default way to use it.

For more information about using the helpers, check out [this section][development].

If you would like to see a working example, check [this repo][ping].

### Contact ✉️

Please visit [GitHub Issues] to report bugs you find, and [GitHub Discussions] to make feature requests, or to get help.

Don't hesitate to [⭐️ star the project][library] if you find it useful!

Using it in production? Always love to hear about it! 😃
