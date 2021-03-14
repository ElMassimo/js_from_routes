## [2.0.2](https://github.com/ElMassimo/js_from_routes/compare/js_from_routes@2.0.1...js_from_routes@2.0.2) (2021-03-14)



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
