[route dsl]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/generator.rb#L77-L107
[this pull request]: https://github.com/ElMassimo/pingcrm-vite/pull/2 

[exported routes]: /guide/#export-the-routes
[client]: /client/
[config]: /config/#code-generation
[default template]: /config/#template-path
[template_path]: /config/#template-path
[template all]: /config/#template-all-path

[client_library]: /config/#client-library

# Code Generation 🤖

Whenever you add a new route and _refresh the page_, the Rails reloader will kick in and generate path helpers for any of the [exported routes].

If you are not running the development server, you can run a rake task to generate path helpers:

```bash
bin/rake js_from_routes:generate
```

By default, it will generate one file per controller, with one helper per exported action:

```js
// app/javascript/api/VideoClipsApi.ts
import { definePathHelper } from '@js-from-routes/client'

export default {
  download: definePathHelper('get', '/video_clips/:id/download'),

  update: definePathHelper('patch', '/video_clips/:id'),
}
```

Notice how the HTTP verb becomes an implementation detail.

Changing the verb in `routes.rb` does not require updating your client code!

## Customizing the Generated Code 🛠

You can customize the code produced by the [default template], or use your own template.

The following code examples assume that you are configuring _JS From Routes_ in an [initializer][config].

### Using a different client

You can use any of the [provided client libraries][client] by using <kbd>[client_library]</kbd>:

```ruby
config.client_library = '@js-from-routes/axios'
```

### Using your own code

You can also use <kbd>[client_library]</kbd> to target your own code when generating path helpers:

```ruby
config.client_library = '~/MyPathHelpers'
```

As a result, the [default template] will generate:

```js
// app/javascript/api/VideoClipsApi.ts
import { definePathHelper } from '~/MyPathHelpers'

export default {
  ...
}
```

### Using a different template

If you need to generate helpers in a different way, or want do something entirely different with exported routes, you can configure <kbd>[template_path]</kbd> to use your own template:

```ruby
config.template_path = Rails.root.join('custom_js_from_routes.js.erb')
```

A `routes` variable will be available in the template, with the exported routes for a controller.

Each `route` exposes properties such as `verb` and `path`, [check the source code][route dsl] for details.

See [this pull request] to get a sense of how flexible it can be.

## Caching 📦

Generated files are only written when their content changed, so repeated runs
leave untouched files alone and their modification times stay stable for file
watchers.

In development, helpers are generated when the app boots, and afterwards only
when one of the files Rails loads routes from (or one of the templates) has
changed, using the same file watcher Rails uses to reload routes.

The rake task always regenerates everything:

```bash
bin/rake js_from_routes:generate
```
