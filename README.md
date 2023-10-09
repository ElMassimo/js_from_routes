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

[routes]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/routes.rb#L6
[client libraries]: https://js-from-routes.netlify.app/client/
[codegen]: https://js-from-routes.netlify.app/guide/codegen
[rails bytes]: https://railsbytes.com/templates/X6ksgn
[website]: https://js-from-routes.netlify.app
[guides]: https://js-from-routes.netlify.app/guide/
[guide]: https://js-from-routes.netlify.app/guide/#usage-🚀
[configuration reference]: https://js-from-routes.netlify.app/config/
[introduction]: https://js-from-routes.netlify.app/guide/introduction
[ping]: https://github.com/ElMassimo/pingcrm-vite

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
group :development, :test do
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

  # Or:
  defaults export: true do
    # All routes defined inside this block will be exported.
  end
end
```

### Use the path helpers in your JS application

Path helpers will be [automatically generated][codegen] when refreshing the page.

```js
import { videoClips } from '~/api'

const video = await videoClips.show({ id: 'oHg5SJYRHA0' })

const downloadPath = videoClips.download.path(video)
```

Check the [documentation website][guide] for more information.

For a working example, check [this repo][ping].
