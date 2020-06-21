<h1 align="center">
JS From Rails Routes
<p align="center">
<a href="https://travis-ci.org/ElMassimo/js_from_routes"><img alt="Build Status" src="https://travis-ci.org/ElMassimo/js_from_routes.svg"/></a>
<a href="https://coveralls.io/github/ElMassimo/js_from_routes?branch=master"><img alt="Coverage Status" src="https://coveralls.io/repos/github/ElMassimo/js_from_routes/badge.svg?branch=master"/></a>
<a href="http://inch-ci.org/github/ElMassimo/js_from_routes"><img alt="Inline docs" src="http://inch-ci.org/github/ElMassimo/js_from_routes.svg"/></a>
<a href="https://rubygems.org/gems/js_from_routes"><img alt="Gem Version" src="https://img.shields.io/gem/v/js_from_routes.svg?colorB=e9573f"/></a>
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
be taken into account when generating JS:

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

This can happen in many different ways, but to illustrate using the example above:

```js
import VideoClipsRequests from '@requests/VideoClipsRequests'

VideoClipsRequests.get({ id: 'oHg5SJYRHA0' }).then(displayVideo)

const path = VideoClipsRequests.downloadPath({ id: 'oHg5SJYRHA0' })
```

### How does it work? ⚙️

By adding a hook to Rails' reload process in development, it's possible to
automatically generate files from routes when a route is added, modified, or removed.

In order to optimize file generation, the generated JS files are split by
controller, and add a cache key based on the routes to avoid rewriting the file
if the route definition hasn't changed.

When the Webpack development server is running, this automatically triggers a
new build, and the request method (or path helper) is ready to be used!

## Opinionated Design
After using [settingslogic](https://github.com/settingslogic/settingslogic) for a long time, we learned some lessons, which are distilled in the following decisions:
- __Immutability:__ Once created settings can't be modified.
- __Fail-Fast:__ Settings are eagerly loaded when `source` is called.
- __No Optional Setings:__ Any optional setting can be modeled in a safer way, this library doesn't allow them.
- __Not Tied to a Source File:__ Useful to create multiple environment-specific files.
