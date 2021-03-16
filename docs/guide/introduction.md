[library]: https://github.com/ElMassimo/js_from_routes
[motivation]: /motivation
[rails]: http://rubyonrails.org/
[blog post]: https://maximomussini.com/posts/js-from-routes/
[path helpers]: https://guides.rubyonrails.org/routing.html#path-and-url-helpers

[codegen]: /guide/codegen
[client]: /client/
[config]: /config/
[paths]: /client/#passing-parameters
[requests]: /client/#submitting-data
[case conversion]: /client/#disabling-case-conversion
[responseAs]: /config/#responseAs

# Introduction

[__JS From Routes__][library] is a library to generate JS from routes defined in your [Rails] application.

## Why JS From Routes? 🤔

[Path helpers] in Rails make it easy to build URLs, while avoiding typos and mistakes.

Frontend code in Rails typically receives URLs from the server through JSON or HTML templates, or hardcodes paths of any endpoints that need to be accessed. Both approaches are fragile and cumbersome, and don't scale well.

[JS From Routes][library] provides path helpers in JS, generating them from your Rails routes, so that you can make requests without manually handling paths, parameter interpolation, or HTTP verbs.

Interested in hearing more? Read the original [blog post].

## Features ⚡️

### 🚀 Path and Request Helpers

  Use the controller and action name to [obtain paths][paths] or [make requests][requests]. No need to use URLs or manually interpolate parameters, preventing mistakes and saving development time.

### 🔁 Serialization / Deserialization

  Consuming JSON APIs works out of the box, but you can easily consume [other types of media][responseAs].

  [Case conversion] between Ruby and JS is handled for you, but you can also [opt-out][case conversion].

### ✅ Safety

  Prevents routing mistakes when renaming or removing an action.

  Path helpers are fully typed, and client libraries are entirely written in TypeScript.

### 🤖 Automatic Generation

  Path helpers are [generated automatically][codegen] whenever Rails reload is triggered.

  Add a route, refresh the page, and start using the path helper!

### 🛠 Customizable Generation

  Select a [client library][client] that uses `fetch` or `axios`, or use your [own code][client].

  Choose different conventions by [customizing][codegen] how code is generated.
