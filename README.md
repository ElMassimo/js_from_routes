<h1 align="center">
JS From Rails Routes
<p align="center">
<a href="https://rubygems.org/gems/js_from_routes"><img alt="Gem Version" src="https://img.shields.io/gem/v/js_from_routes.svg?colorB=e9573f"/></a>
<a href="https://travis-ci.org/ElMassimo/js_from_routes"><img alt="Build Status" src="https://travis-ci.org/ElMassimo/js_from_routes.svg"/></a>
<a href="https://codeclimate.com/github/ElMassimo/js_from_routes"><img alt="Coverage Status" src="https://codeclimate.com/github/ElMassimo/request_store_rails/badges/coverage.svg"/></a>
<a href="https://codeclimate.com/github/ElMassimo/js_from_routes"><img alt="Code Quality" src="https://codeclimate.com/github/ElMassimo/js_from_routes/badges/gpa.svg"/></a>
<a href="http://inch-ci.org/github/ElMassimo/js_from_routes"><img alt="Inline docs" src="http://inch-ci.org/github/ElMassimo/js_from_routes.svg"/></a>
<a href="https://github.com/ElMassimo/js_from_routes/blob/master/LICENSE.txt"><img alt="License" src="https://img.shields.io/badge/license-MIT-428F7E.svg"/></a>
</p>
</h1>

_JS from Routes_ allows to automatically generate path and API helpers from
Rails route definitions, allowing you to save development effort and focus on
the things that matter.

### Installation 💿

Add this line to your application's Gemfile:

```ruby
gem 'js_from_routes'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install js_from_routes

### Usage 🚀

#### 1. Specify the Rails routes you want to export

By default this gem uses the `export` attribute to determine which routes should
be taken into account when generating JS. [Example](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/config/routes.rb#L6)

```ruby
Rails.application.routes.draw do
  resources :video_clips, export: true do
    get :download, on: :member, export: :path_only
    get :subtitles, on: :collection, export: false
  end
end
```

#### 2. Make a request to your Rails application

This is usually done automatically the next time you make a request to your
Rails server (such as when you refresh the page), which causes Rails reloader to
kick in, and the routes to be generated.

If you are not running a local development server, or prefer to do it manually,
you can use a rake task instead: `bin/rake js_from_routes:generate`.

#### 3. Use the generated code in your JS application

This can happen in many [different ways](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/app/javascript/app.vue#L10), but to illustrate using the example above:

```js
import VideoClipsRequests from '@requests/VideoClipsRequests'

VideoClipsRequests.get({ id: 'oHg5SJYRHA0' }).then(displayVideo)

const path = VideoClipsRequests.downloadPath({ id })
```

Check the [examples](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/app/javascript/App.vue) for ideas on how to [use it](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/app/javascript/App.vue), and how you can [configure](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/config/webpack/aliases.js#L11) Webpack to your convenience.

Read on to find out how to customize the

### How does it work? ⚙️

By adding a hook to Rails' reload process in development, it's possible to
automatically generate files from routes when a route is added, modified, or removed.

In order to optimize file generation, the generated JS files are split by
controller, and add a cache key based on the routes to avoid rewriting the file
if the route definition hasn't changed.

When the Webpack development server is running, this automatically triggers a
new build, and the request method (or path helper) is ready to be used!

### Advanced Configuration 📖

Since all projects are different, it's very unlikely that the library defaults
fulfill all your requirements. The following [settings](https://github.com/ElMassimo/js_from_routes/blob/master/lib/js_from_routes/generator.rb#L77-L80) are available:

##### `file_suffix`, default: `Requests.js`

This suffix is added by default to all generated files, as a way to create a
convention.

##### `helper_mappings`

It allows to map certain actions to a different convention that might be more
intuitive. By default it maps `index` to `list` and `show` to `get`, which
helps to make the JS code read more natural.

##### `output_folder`, default: `app/javascript/requests`

The location where the generated files are placed. If using `webpacker`, the
default location can be very convenient if you [add a webpack alias](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/config/webpack/aliases.js#L11).

##### `template_path`

A [default template](https://github.com/ElMassimo/js_from_routes/blob/master/lib/js_from_routes/template.js.erb) is provided, but it makes [assumptions](https://github.com/ElMassimo/js_from_routes/tree/master/spec/support/sample_app/app/javascript/requests) about the [available](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/app/javascript/services/ApiService.js#L17) [code](https://github.com/ElMassimo/js_from_routes/blob/master/spec/support/sample_app/app/javascript/helpers/UrlHelper.js#L28).

You will probably want to use a custom template, such as:

```ruby
# config/initializers/js_from_routes.rb
JsFromRoutes.config do |config|
  config.template = Rails.root.join('app', 'views', 'custom_js_from_routes.js.erb')
end
```

As in the [default template](https://github.com/ElMassimo/js_from_routes/blob/master/lib/js_from_routes/template.js.erb),
a `routes` variable will be available, and will contain the exported endpoints
for a single controller.

Each `route` exposes properties such as `verb` and `path`, please [check the
source code](https://github.com/ElMassimo/js_from_routes/blob/master/lib/js_from_routes/generator.rb#L34-L71) for details on the [public API](https://github.com/ElMassimo/js_from_routes/blob/master/lib/js_from_routes/generator.rb#L34-L71).

