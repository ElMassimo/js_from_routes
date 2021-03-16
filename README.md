<h1 align="center">
  <a href="https://js-from-routes.netlify.app/">
    <img src="https://raw.githubusercontent.com/ElMassimo/js_from_routes/main/docs/public/logo-with-text.svg" width="240px"/>
  </a>

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
[client libraries]: https://js-from-routes.netlify.app/client/
[codegen]: https://js-from-routes.netlify.app/guide/codegen
[export false]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L18
[rails bytes]: https://railsbytes.com/templates/X6ksgn
[website]: https://js-from-routes.netlify.app
[guides]: https://js-from-routes.netlify.app/guide/
[guide]: https://js-from-routes.netlify.app/guide/#usage-🚀
[configuration reference]: https://js-from-routes.netlify.app/config/
[introduction]: https://js-from-routes.netlify.app/guide/introduction

_[JS From Routes][website]_ generates path helpers and API methods from your Rails routes, allowing you to be more productive and prevent routing-related errors.

Since code generation is fully customizable it can be used in very diverse scenarios.

## Why? 🤔

Path helpers in Rails make it easy to build URLs, while avoiding typos and mistakes.

With _[JS From Routes][website]_, it's possible the enjoy the same benefits in JS, and even more if using TypeScript.

Read more about it in the [blog announcement](https://maximomussini.com/posts/js-from-routes/).

## Features ⚡️

- 🚀 Path and Request Helpers
- 🔁 Serialization / Deserialization
- ✅ Prevent Routing Errors
- 🤖 Automatic Generation
- 🛠 Customizable Generation
- And [more][introduction]!

## Documentation 📖

Visit the [documentation website][website] to check out the [guides] and searchable [configuration reference].

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

There are more [client libraries] available.

## Getting Started 🚀

The following is a short excerpt from the [guide].

### Specify the routes you want

Use the `export` attribute to determine which [routes] should be taken into account when generating JS.

```ruby
Rails.application.routes.draw do
  resources :video_clips, export: true do
    get :download, on: :member
  end
end
```

### Use the path helpers in your JS application

Path helpers will be [automatically generated][codegen] when refreshing the page.

```js
import api from '~/api'

const video = await api.videoClips.get({ id: 'oHg5SJYRHA0' })

const downloadPath = api.videoClips.download.path(video)
```

Check the [documentation website][guide] for more information.
