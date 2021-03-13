<h1 align="center">
JS From Rails Routes
<p align="center">
<a href="https://travis-ci.org/ElMassimo/js_from_routes"><img alt="Build Status" src="https://travis-ci.org/ElMassimo/js_from_routes.svg"/></a>
<a href="http://inch-ci.org/github/ElMassimo/js_from_routes"><img alt="Inline docs" src="http://inch-ci.org/github/ElMassimo/js_from_routes.svg"/></a>
<a href="https://codeclimate.com/github/ElMassimo/js_from_routes"><img alt="Maintainability" src="https://codeclimate.com/github/ElMassimo/js_from_routes/badges/gpa.svg"/></a>
<a href="https://codeclimate.com/github/ElMassimo/js_from_routes"><img alt="Test Coverage" src="https://codeclimate.com/github/ElMassimo/js_from_routes/badges/coverage.svg"/></a>
<a href="https://rubygems.org/gems/js_from_routes"><img alt="Gem Version" src="https://img.shields.io/gem/v/js_from_routes.svg?colorB=e9573f"/></a>
<a href="https://github.com/ElMassimo/js_from_routes/blob/main/LICENSE.txt"><img alt="License" src="https://img.shields.io/badge/license-MIT-428F7E.svg"/></a>
</p>
</h1>

[Vite Rails]: https://vite-ruby.netlify.app/
[aliases]: https://vite-ruby.netlify.app/guide/development.html#import-aliases-%F0%9F%91%89
[config options]: https://github.com/ElMassimo/js_from_routes/blob/main/lib/js_from_routes/generator.rb#L97-L101
[generate TypeScript]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/initializers/js_from_routes.rb
[usage]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/app/javascript/Videos.vue#L9
[routes]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L6
[route dsl]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/generator.rb#L40-L70
[imports]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/app/javascript/Videos.vue#L3
[default template]: https://github.com/ElMassimo/js_from_routes/blob/main/lib/js_from_routes/template.js.erb
[ping]: https://github.com/ElMassimo/pingcrm-vite/pull/2
[axios]: https://github.com/axios/axios
[redaxios]: https://github.com/developit/redaxios
[advanced configuration]: https://github.com/ElMassimo/js_from_routes#advanced-configuration-
[jQuery]: https://gist.github.com/ElMassimo/cab56e64e20ff797f3054b661a883646
[client libraries]: #client-libraries-

_JS from Routes_ helps you by automatically generating path and API helpers from
Rails route definitions, allowing you to save development effort and focus on
the things that matter.

Since code generation is fully customizable it can be used in very diverse scenarios.

### Why? 🤔

Path helpers in Rails make it easy to build urls, while avoiding typos and mistakes.

With this library, it's possible the enjoy the same benefits in JS, and even more if using TypeScript.

Read more about it in the [blog announcement](https://maximomussini.com/posts/js-from-routes/).

### Features ⚡️

- 🚀 __Productive__ 

  No need to manually specify the URL, just use the controller and action name, preventing mistakes and saving development time.

  The HTTP verb becomes an implementation detail, changing it in the Rails route definition just works.

  Path helpers can be generated automatically whenever Rails reload is triggered.

- 🎩 __Elegant__ 

  Make network requests with simple function calls, which return promises.

  JSON serialization/deserialization for you by default, but you can easily opt-out by choosing a different response type.

  Pass parameters as plain objects, and they will be interpolated in the URL as needed.

- ✅ __Safe__

  If an action is renamed or removed, it can be detected by static analysis or the TypeScript compiler.

  You can find problems in development, instead of getting 404s in testing or production.

  Path helpers are fully typed, and client libraries are entirely written in TypeScript.

- 🛠 __Customizable__ 

  Select between different network libraries such as native `fetch`, [axios] or [redaxios], or use your own code instead.

  Choose different conventions by [customizing][advanced configuration] how code is generated.

### Installation 💿

Add this line to your application's Gemfile in the `development` group and execute `bundle`:

```ruby
group :development do
  gem 'js_from_routes'
end
```

Add the client library to your `package.json`:

```bash
npm install @js-from-routes/client # or yarn install
```

Have in mind this is [optional][client libraries].

### Usage 🚀

#### Specify the Rails routes you want to export

Use the `export` attribute to determine which [routes] should be taken into account when generating JS.

```ruby
Rails.application.routes.draw do
  resources :video_clips, export: true do
    get :download, on: :member
  end
end
```

Path helpers will be automatically generated when refreshing the page.

#### Use the path helpers in your JS application

Path helpers are located in a file with the controller name, and export [one method per action][advanced configuration].

```js
import VideoClipsApi from '~/api/VideoClipsApi'
```

Calling the methods which will return a promise with the unwrapped JSON result.

```js
const video = await VideoClipsApi.get({ id: 'oHg5SJYRHA0' })
```

You may use the `path` method from one of the actions to obtain the URL with interpolated parameters.

```js
const downloadPath = VideoClipsApi.download.path(video)
```

Check the [examples][usage] for ideas on how to [use it][usage], and how you can configure it to your convenience.

A documentation website is coming soon! 📖 :shipit:

### Code Generation 🤖

Adding an exported route will cause path helpers to be generated automatically
next time Rails reloader kicks in (such as when you refresh the page after adding a route).

If you are not running a local development server, or prefer to do it manually,
you can use a rake task instead:

```
bin/rake js_from_routes:generate
```

which will generate code such as:

```js
// app/javascript/api/VideoClipsApi.ts
import { definePathHelper } from '@js-from-routes/client'

export default {
  download: definePathHelper('/video_clips/:id/download'),

  get: definePathHelper('get', '/video_clips/:id'),
    
  update: definePathHelper('patch', '/video_clips/:id'),
}
```

### Client Libraries 📦

Three different API clients are provided. When in doubt, choose the first one:

- <kbd>@js-from-routes/client</kbd>

  The default client. Uses `fetch`, so it has no additional dependencies.

- <kbd>@js-from-routes/axios</kbd>

  Choose it if already using [axios], or have a complex use case that requires [interceptors](https://github.com/axios/axios#interceptors) or [different instances](https://github.com/axios/axios#creating-an-instance).

- <kbd>@js-from-routes/redaxios</kbd>

  Choose it if already using [redaxios], for consistency within your codebase.

You may also use [your own client code instead][advanced configuration], or even [jQuery].

### Advanced Configuration 🛠

You can fully customize how code is generated, which [client libraries] to use,
or whether to not use one at all.

The following [settings][config options] are available:

- <kbd>[client_library][config options]</kbd>, default: `@js-from-routes/client`

  The [preferred library][client libraries] from which to import `definePathHelper`.
  You could change it to target your own code instead, such as `~/MyCustomPathHelpers`.

- <kbd>[file_suffix][config options]</kbd>, default: `Api.js`

  This suffix is added by default to all generated files. You can modify it to
  if you prefer a different convention, or if you use it to [generate TypeScript].

- <kbd>[helper_mappings][config options]</kbd>

  By default it maps `index` to `list` and `show` to `get`, which helps to make
  the JS code read more naturally.

- <kbd>[output_folder][config options]</kbd>, default: `app/javascript/api`

  The directory where the generated files are created.

  Tip: It's highly recommended to [add a webpack alias](https://github.com/ElMassimo/js_from_routes/blob/webpack/spec/support/sample_app/config/webpack/aliases.js#L11), to simplify [imports].

  If you use [Vite Rails], the [aliases] are already configured for you.

- <kbd>[template_path][config options]</kbd>

  A [default template] is provided, which you can customize by using <kbd>[client library][config options]</kbd> to use a different library, or roll your own.

  If you still want to use a custom template to generate helpers in a different way, you can provide one:

  ```ruby
  # config/initializers/js_from_routes.rb
  if Rails.env.development?
    JsFromRoutes.config do |config|
      config.template_path = Rails.root.join('app', 'views', 'custom_js_from_routes.js.erb')
    end
  end
  ```

  A `routes` variable will be available in the template, which will contain the
  endpoints exported for a controller.

  Each `route` exposes properties such as `verb` and `path`, please [check the
  source code][route dsl] for details on the [API][route dsl].

  Check out [this pull request][ping] to get a sense of how flexible it can be.


### How does it work? ⚙️

By adding a hook to Rails' reload process in development, it's possible to
automatically generate files from routes when a route is added, modified, or removed.

In order to optimize file generation, the generated JS files are split by
controller, and add a cache key based on the routes to avoid rewriting the file
if the route definition hasn't changed.

When the Vite.js or Webpack development server is running, it detects when a new
file is generated, automatically triggering a new build, which can now use the
generated request methods or path helpers 😃

### Take this idea 💡

The generator can be tweaked to [generate TypeScript], target [jQuery], or [adapt to your framework of choice][ping].

However, this is just one possible application. There are plenty of other opportunities for code generation, such as keeping enums in sync between Ruby and JS, and other shared data structures.

Let me know if you come up with new or creative ways to use this technique 😃
