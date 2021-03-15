<h1 align="center">
  <img src="https://raw.githubusercontent.com/ElMassimo/js_from_routes/main/docs/public/logo-with-text.svg" width="240px"/>

  <br>

  <p align="center">
    <a href="https://travis-ci.org/ElMassimo/js_from_routes">
      <img alt="Build Status" src="https://travis-ci.org/ElMassimo/js_from_routes.svg"/>
    </a>
    <a href="https://codeclimate.com/github/ElMassimo/js_from_routes">
      <img alt="Maintainability" src="https://codeclimate.com/github/ElMassimo/js_from_routes/badges/gpa.svg"/>
    </a>
    <a href="https://codeclimate.com/github/ElMassimo/js_from_routes">
      <img alt="Test Coverage" src="https://codeclimate.com/github/ElMassimo/js_from_routes/badges/coverage.svg"/>
    </a>
    <a href="https://rubygems.org/gems/js_from_routes">
      <img alt="Gem Version" src="https://img.shields.io/gem/v/js_from_routes.svg?colorB=e9573f"/>
    </a>
    <a href="https://github.com/ElMassimo/js_from_routes/blob/main/LICENSE.txt">
      <img alt="License" src="https://img.shields.io/badge/license-MIT-428F7E.svg"/>
    </a>
  </p>
</h1>

[Vite Rails]: https://vite-ruby.netlify.app/
[aliases]: https://vite-ruby.netlify.app/guide/development.html#import-aliases-%F0%9F%91%89
[config options]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/generator.rb#L178-L189
[generate TypeScript]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/initializers/js_from_routes.rb
[example]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/app/javascript/Videos.vue#L9
[example 2]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/app/javascript
[routes]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L6
[route dsl]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/generator.rb#L77-L107
[imports]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/app/javascript/Videos.vue#L3
[default template]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/template.js.erb
[template all]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/template_all.js.erb
[ping]: https://github.com/ElMassimo/pingcrm-vite/pull/2
[axios]: https://github.com/axios/axios
[redaxios]: https://github.com/developit/redaxios
[Inertia.js]: https://github.com/inertiajs/inertia
[advanced configuration]: https://github.com/ElMassimo/js_from_routes#advanced-configuration-
[jQuery]: https://gist.github.com/ElMassimo/cab56e64e20ff797f3054b661a883646
[client libraries]: #client-libraries-
[codegen]: #code-generation-
[usage]: #use-the-path-helpers-in-your-js-application
[export false]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L18
[rails bytes]: https://railsbytes.com/templates/X6ksgn

_JS from Routes_ generates path helpers and API methods from your Rails routes, allowing you to be more productive and prevent routing-related errors.

Since code generation is fully customizable it can be used in very diverse scenarios.

## Why? 🤔

Path helpers in Rails make it easy to build URLs, while avoiding typos and mistakes.

With this library, it's possible the enjoy the same benefits in JS, and even more if using TypeScript.

Read more about it in the [blog announcement](https://maximomussini.com/posts/js-from-routes/).

## Features ⚡️

- 🚀 __Productive__ 

  No need to specify the URL, just use the [controller and action name][codegen], preventing mistakes and saving development time.

  Path helpers are [generated automatically][codegen] whenever Rails reload is triggered.

- 🎩 __Elegant__ 

  Make network requests with [simple function calls][usage], which return promises.

  JSON serialization/deserialization works out of the box, but you can easily opt-out by choosing a different response type.

- ✅ __Safe__

  If an action is renamed or removed, it can be detected by static analysis or the TypeScript compiler.

  Path helpers are fully typed, and client libraries are entirely written in TypeScript.

- 🛠 __Customizable__ 

  Select a [network library][client libraries] such as native `fetch`, [axios], or use your own code.

  Choose different conventions by [customizing][advanced configuration] how code is generated.

## Installation 💿

For a one liner, you can use [this template][rails bytes]:

```
rails app:template LOCATION='https://railsbytes.com/script/X6ksgn'
```

Else, add this line to your application's Gemfile in the `development` group and execute `bundle`:

```ruby
group :development do
  gem 'js_from_routes'
end
```

Then, add the [client library][client libraries] to your `package.json`:

```bash
npm install @js-from-routes/client # yarn add @js-from-routes/client
```

Have in mind this is [optional][client libraries].

## Getting Started 🚀

A documentation website is coming soon! 📖 :shipit:

### Specify the Rails routes you want to export

Use the `export` attribute to determine which [routes] should be taken into account when generating JS.

```ruby
Rails.application.routes.draw do
  resources :video_clips, export: true do
    get :download, on: :member
  end
end
```

Path helpers will be [automatically generated][codegen] when refreshing the page.

The option will cascade to any nested action or resource, but you can [opt out][export false].

### Use the path helpers in your JS application

Path helpers are located in a file with the controller name, and export [one method per action][codegen].

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

A file that exports all helpers as properties is also generated.

```js
import api from '~/api'

const video = await api.videoClips.get(video)

const comments = await api.comments.list()
```

Check the [examples][example 2] for ideas on how to [use it][example], and how you can [configure it to your convenience][advanced configuration].

## Code Generation 🤖

Whenever you add a new route and refresh the page, the Rails reloader will kick in and generate path helpers.

If you are not running the development server, you can run a rake task to generate path helpers:

```
bin/rake js_from_routes:generate
```

One file per controller, one helper per exported action:

```js
// app/javascript/api/VideoClipsApi.ts
import { definePathHelper } from '@js-from-routes/client'

export default {
  download: definePathHelper('get', '/video_clips/:id/download'),

  get: definePathHelper('get', '/video_clips/:id'),
    
  update: definePathHelper('patch', '/video_clips/:id'),
}
```

Notice how the HTTP verb becomes an implementation detail; changing it in `routes.rb` just works!

The code is terse and readable, and [fully customizable][advanced configuration].

## Client Libraries 📦

Three different API clients are provided. When in doubt, choose the first one:

- <kbd>@js-from-routes/client</kbd>

  The default client. Uses `fetch`, so it has no additional dependencies.

- <kbd>@js-from-routes/axios</kbd>

  Choose it if already using [axios], or have a complex use case that requires [interceptors](https://github.com/axios/axios#interceptors) or [different instances](https://github.com/axios/axios#creating-an-instance).

- <kbd>@js-from-routes/inertia</kbd>

  When using [Inertia.js], this package will allow you to easily submit forms and make requests using your existing configuration.

- <kbd>@js-from-routes/redaxios</kbd>

  Choose it if already using [redaxios], for consistency within your codebase.

You may also use [your own client code instead][advanced configuration], or even [jQuery].

### Usage 📖

A documentation website is coming soon! 📖 :shipit:

The methods are documented using JSDoc, but here are some examples in the meantime:

#### Importing helpers

If you use [Vite Rails], [aliases] will allow you to import these files as:

```js
import VideoClipsApi from '~/api/VideoClipsApi'
```

When using webpack, it's highly recommended to [add an alias](https://webpack.js.org/configuration/resolve/#resolvealias) to simplify imports.

#### Passing parameters

You can pass a plain object as parameters; properties will be interpolated on any matching placeholders (`:id`) in the URL.

```js
const video = { id: 5, title: 'New Wave' }
VideoClipsApi.download.path(video) == "/video_clips/5/download"
```

Missing parameters will throw an error providing the full context.

#### Submitting data

You can pass `data` to specify the request body, just like in [axios].

```js
VideoClipsApi.update({ params: video, data: { title: 'New Waves' } })
```

#### Obtaining the raw response

By default, JSON responses are automatically unwrapped. If you need access to the response, you can use `responseAs`:

```js
const response = await VideoClipsApi.download({ params: video, responseAs: 'response' })
```

## Advanced Configuration 🛠

You can fully customize how code is generated, which [client libraries] to use,
whether to [generate TypeScript], target [jQuery], or [adapt to your framework of choice][ping].

In order to customize the options, you can add an initializer to your Rails app:

```ruby
# config/initializers/js_from_routes.rb
if Rails.env.development?
  JsFromRoutes.config do |config|
    config.client_library = "@js-from-routes/client"
    ...
  end
end
```

The following [config options] are available:

- <kbd>[all_helpers_file][config options]</kbd>, default: `true`

  Whether to generate a file that exports all available helpers.

  By default it's exported to `index.js` in the <kbd>[output_folder][config options]</kbd>, but you can specify a different name if needed.

  If you are importing helpers separately (which provides better code-splitting), you can disable generation.
  
  ```ruby
  config.all_helpers_file = false # Don't generate the file
  ```

- <kbd>[client_library][config options]</kbd>, default: `@js-from-routes/client`

  The [preferred library][client libraries] from which to import `definePathHelper`.
  You could change it to target your own code:
  
  ```ruby
  config.client_library = '~/MyCustomPathHelpers'
  ```

- <kbd>[file_suffix][config options]</kbd>, default: `Api.js`

  This suffix is added by default to all generated files. You can modify it if
  you [are using TypeScript][generate TypeScript], or want to use a different convention.

  ```ruby
  config.file_suffix = 'Api.ts'
  ```

- <kbd>[helper_mappings][config options]</kbd>

  Defines how to obtain a path helper name from the name of a controller action.

  By default it maps `index` to `list` and `show` to `get`, to make the JS code more idiomatic.

  ```ruby
  config.helper_mappings = {'index' => 'getAll', 'show' => 'find', 'edit' => 'infoForUpdate'}
  ```

- <kbd>[output_folder][config options]</kbd>, default:  `app/{frontend|javascript|packs|assets}/api`

  The directory where the generated files are created. It will attempt to infer where you place JS code by checking whether any of these directories exist.

  ```ruby
  config.output_folder = Rails.root.join('app', 'api', 'path_helpers')
  ```

- <kbd>[template_path][config options]</kbd>

  A [default template] is provided, which you can customize by using <kbd>[client library][config options]</kbd>.

  If you want to generate helpers in a different way, you can provide an absolute path to a template:

  ```ruby
  config.template_path = Rails.root.join('app', 'views', 'custom_js_from_routes.js.erb')
  ```

  A `routes` variable will be available in the [template][default template], which will contain the
  endpoints exported for a controller.

  Each `route` exposes properties such as `verb` and `path`, [check the
  source code][route dsl] for details.

  Check out [this pull request][ping] to get a sense of how flexible it can be.

- <kbd>[template_all_path][config options]</kbd>

  A [default template][template all] is provided, but you can customize it in case you want to use different conventions instead of `camelize(:lower)` for the controller names.
