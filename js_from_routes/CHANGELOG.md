# [4.0.0](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@3.0.2...js_from_routes@4.0.0) (2024-10-11)


### Features

* allow customizing the namespace for path helpers ([#50](https://github.com/ElMassimo/js_from_routes/issues/50)) ([9d38c83](https://github.com/ElMassimo/js_from_routes/commit/9d38c8312ef1275b3b8c18c1129bc936da08bcd0))



## [3.0.2](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@3.0.1...js_from_routes@3.0.2) (2024-09-25)


### Bug Fixes

* remove references to OpenStruct ([#49](https://github.com/ElMassimo/js_from_routes/issues/49)) ([6c0d8de](https://github.com/ElMassimo/js_from_routes/commit/6c0d8ded2bf82ccc2f8f35508dc256c3b301069a)), closes [#47](https://github.com/ElMassimo/js_from_routes/issues/47)



## [3.0.1](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@3.0.0...js_from_routes@3.0.1) (2023-10-09)


### Features

* allow rollup to tree-shake unused path helpers ([150ccd9](https://github.com/ElMassimo/js_from_routes/commit/150ccd9dd616ce448b50ae6c2807dd7f5678479d))



# [3.0.0](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.1.0...js_from_routes@3.0.0) (2023-10-09)


### Features

* add `export_if` to allow using custom `:export` values ([fd1776c](https://github.com/ElMassimo/js_from_routes/commit/fd1776cc91402f1e9a9003031cb9fd6c3a0d63f9))

* **breaking:** no longer map `index` to `list` and `show` to `get` ([5eb3f48](https://github.com/ElMassimo/js_from_routes/commit/5eb3f48de71fe38ee1c67d9b91a81d71a437e1a8))

If you want to preserve the old behavior:

```ruby
JsFromRoutes.config do |config|
  config.helper_mappings = {"index" => "list", "show" => "get"}
end
```

# [2.1.0](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.6...js_from_routes@2.1.0) (2023-02-07)


### Bug Fixes

* use relative paths in auto-generated files ([#36](https://github.com/ElMassimo/js_from_routes/issues/36)) ([0440c50](https://github.com/ElMassimo/js_from_routes/commit/0440c505b1b4d3cca6c390004234faacd10b9480)), closes [#35](https://github.com/ElMassimo/js_from_routes/issues/35)



## [2.0.6](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.5...js_from_routes@2.0.6) (2022-05-25)


### Bug Fixes

* should not attempt to export routes without controllers ([47f8f70](https://github.com/ElMassimo/js_from_routes/commit/47f8f70b0db98baa240470f8b2b891a730499518))



## [2.0.5](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.4...js_from_routes@2.0.5) (2021-09-02)


### Bug Fixes

* ensure :export is not added as a required default in routes ([40126ac](https://github.com/ElMassimo/js_from_routes/commit/40126ac27caeee33abef1c7067ba1db88ea03660))



## [2.0.4](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.3...js_from_routes@2.0.4) (2021-03-16)

### Features

* Allow importing individual helpers from "~/api" by adding exports ([2dfb8a2](https://github.com/ElMassimo/js_from_routes/commit/2dfb8a27d182376d75f0b037258bc772553e43f3)). Thanks @matias-capeletto!


## [2.0.3](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.2...js_from_routes@2.0.3) (2021-03-16)


### Bug Fixes

* Ensure changing the client library triggers code generation ([6cf2bdf](https://github.com/ElMassimo/js_from_routes/commit/6cf2bdf4896dafe0d1e80668551665c46bfcadc6))


### Features

* Allow passing JS_FROM_ROUTES_FORCE=true to ignore cache keys ([8a6d2a8](https://github.com/ElMassimo/js_from_routes/commit/8a6d2a807e0a9926c6b24e1fc9127f917ec0ed5d))



## [2.0.2](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.1...js_from_routes@2.0.2) (2021-03-14)

### Improvements

- Remove underscores from namespaced controllers in global file ([90fdcc2](https://github.com/ElMassimo/js_from_routes/commit/90fdcc2))

## [2.0.1](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.0...js_from_routes@2.0.1) (2021-03-14)

### Features ⚡️

- Enable generation of index combining and exporting all helpers (#9)

# [2.0.0](https://github.com/ElMassimo/js_from_routes/compare/v1.0.3...js_from_routes@2.0.0) (2021-03-13)

### Features ⚡️

- Path helpers now support both making a request or obtaining the path
- Auto-detect the folder where javascript files live (`frontend`, `packs`, `javascript`, or `assets`)
- The new default template is more flexible and can be easily customized using the `client_library` setting

### Breaking Changes 💥

- Created client libraries that provide the necessary functionality out of the box (optional)
- Changed the default template, now using `definePathHelper`
- Defaults for code generation have changed (`Requests` → `Api`)
- `path_only?` and `request_method?` have been removed from `Route` during code generation
  - You may still check for it in your custom templates, using `route.export == :path_only`

## 1.0.3 (2021-03-10) ##

*   Use `~/` instead of `@/` in the default template imports.


## 1.0.2 (2021-03-10) ##

*   Ensure a default `template.js.erb` ships with the gem.


## 1.0.1 (2020-06-21) ##

*   Expose `export_setting` in the `Route` API, to support custom workflows.


## 1.0.0 (2020-06-21) ##

*   Initial Release.
