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
[config options]: https://github.com/ElMassimo/js_from_routes/blob/main/lib/js_from_routes/generator.rb#L82-L85

_JS from Routes_ helps you by automatically generating path and API helpers from
Rails route definitions, allowing you to save development effort and focus on
the things that matter.

Since you are in full control of the code, it can be used in very diverse scenarios.

### Why? 🤔

Path helpers in Rails make it easy to build urls, while avoiding typos and mistakes.

With this library, it's possible the enjoy the same benefits in JS:

- No need to manually specify the URL, preventing mistakes and saving development time.
- If an action is renamed or removed, the helper ceases to exist.
- The HTTP verb becomes an implementation detail, changing it in the route just works.
  
Read more about it in the [blog announcement](https://maximomussini.com/posts/js-from-routes/).

### Installation 💿

Add this line to your application's Gemfile in the `development` group:

```ruby
gem 'js_from_routes'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install js_from_routes

### Usage 🚀

#### 1. Specify the Rails routes you want to export

Use the `export` attribute to determine which [routes](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/config/routes.rb#L6) should be taken into account when generating JS.

```ruby
Rails.application.routes.draw do
  resources :video_clips, export: true do
    get :download, on: :member, export: :path_only
    get :trending, on: :collection, export: false
  end
end
```

#### 2. Use the generated code in your JS application

This can happen in many [different ways](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/Videos.vue#L10), but to illustrate using the example above, in combination with [`axios`](https://github.com/axios/axios) or `fetch`:

```js
import VideoClipsRequests from '~/requests/VideoClipsRequests'

VideoClipsRequests.get({ id: 'oHg5SJYRHA0' }).then(data => { this.video = data })

const path = VideoClipsRequests.downloadPath(newVideo)
```

Check the [examples](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/Videos.vue) for ideas on how to [use it](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/Videos.vue), and how you can configure it to your convenience.

Read on to find out how to customize the generated code to suit your needs.


### Code Generation 🤖

Adding an exported route will cause request files to be generated automatically
when you make a request to your Rails server (such as when you refresh the page),
which causes Rails reloader to kick in, and the routes to be generated.

If you are not running a local development server, or prefer to do it manually,
you can use a rake task instead:

```
bin/rake js_from_routes:generate
```

which will generate code such as:

```js
import { formatUrl } from '~/helpers/UrlHelper'
import { request } from '~/services/ApiService'

export default {
  downloadPath: options =>
    formatUrl('/video_clips/:id/download', options),

  get: options =>
    request('get', '/video_clips/:id', options),
    
  update: options =>
    request('patch', '/video_clips/:id', options),
}
```

#### Advanced Configuration 📖

Since all projects are different, it's very unlikely that the default settings
fulfill all your requirements.

The following [settings][config options] are available:

- <kbd>[file_suffix][config options]</kbd>, default: `Requests.js`

  This suffix is added by default to all generated files. You can modify it to
  if you prefer a different convention, or if you use it to generate TypeScript.

- <kbd>[helper_mappings][config options]</kbd>

  By default it maps `index` to `list` and `show` to `get`, which helps to make
  the JS code read more naturally.

- <kbd>[output_folder][config options]</kbd>, default: `app/javascript/requests`

  The directory where the generated files are created.

  Tip: It's highly recommended to [add a webpack alias](https://github.com/ElMassimo/js_from_routes/blob/webpack/spec/support/sample_app/config/webpack/aliases.js#L11), to simplify [imports](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/Videos.vue#2).

  If you use [Vite Rails], the [aliases] are already configured for you.

- <kbd>[template_path][config options]</kbd>

  A [default template](https://github.com/ElMassimo/js_from_routes/blob/main/lib/js_from_routes/template.js.erb) is provided, but it makes assumptions about the [available](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/services/ApiService.js#L17) [code](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/helpers/UrlHelper.js#L28).

  You will probably want to use a custom template, such as:

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
  source code](https://github.com/ElMassimo/js_from_routes/blob/main/lib/js_from_routes/generator.rb#L34-L71) for details on the [API](https://github.com/ElMassimo/js_from_routes/blob/main/lib/js_from_routes/generator.rb#L34-L71).

  Check out [this pull request](https://github.com/ElMassimo/pingcrm-vite/pull/2) to get a sense of how flexible it can be.

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

While the original use cases intended to generate code that targes a custom `ApiService`, 
it can be tweaked to generate TypeScript, [target jQuery](https://gist.github.com/ElMassimo/cab56e64e20ff797f3054b661a883646),
or use it only to generate [path helpers](https://github.com/ElMassimo/js_from_routes/blob/main/spec/support/sample_app/app/javascript/requests/UserPreferencesRequests.js#L11-L15).

There are plenty of other opportunities for automatic code generation, such as keeping
enums in sync between Ruby and JS.

Let me know if you come up with new or creative ways to use this technique 😃