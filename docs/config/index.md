---
outline: deep
---

[default template library]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/template.js.erb#L3
[template all]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/template_all.js.erb
[template index]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/template_index.js.erb
[default template]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/template.js.erb
[config options]: https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/lib/js_from_routes/generator.rb#L178-L189
[generate TypeScript]: https://github.com/ElMassimo/js_from_routes/blob/main/playground/vanilla/config/initializers/js_from_routes.rb
[jQuery]: https://gist.github.com/ElMassimo/cab56e64e20ff797f3054b661a883646
[ping]: https://github.com/ElMassimo/pingcrm-vite

[client]: /client/
[codegen]: /guide/codegen
[client_library]: /config/#client-library
[different template]: /guide/codegen.html#using-a-different-template

# Configuration Reference

The following section contains references to all configuration options in the provided libraries.

## Code Generation

In order to customize code generation, you can add an initializer to your Rails app:

```ruby
# config/initializers/js_from_routes.rb
if Rails.env.development?
  JsFromRoutes.config do |config|
    ...
  end
end
```

You can fully customize how code is generated, which [client libraries][client] to use,
whether to [generate TypeScript], target [jQuery], or [adapt to your framework of choice][ping].

The following [config options] are available:

### `all_helpers_file`

  Whether to generate a file that exports all available helpers.

  You can specify a different name for the file, or pass `false` to disable it.
  
  __Default__: `true`, will output `index.js` in the <kbd>[output_folder][config options]</kbd>

  ```ruby
  config.all_helpers_file = false # Don't generate the file
  ```

### `client_library`

  The [library][client] from which to [import `definePathHelper`][default template library] in the [default template](#template-path).
  
  Read more about it in [_Code Generation_][codegen].

  __Default__: `@js-from-routes/client`

  ```ruby
  config.client_library = '~/services/ApiService'
  ```

### `export_if`

  Allows to configure which routes should be exported.

  Enables advanced usages, such as exporting different routes to different paths,
  which is helpful for monoliths with several apps inside them.

  __Default__: `->(route) { route.defaults.fetch(:export, nil) }`

  ```ruby
  config.export_if = ->(route) { route.defaults[:export] == :main }
  ```

### `file_suffix`
  
  This suffix is added by default to all generated files. You can modify it if
  you [are using TypeScript][generate TypeScript], or want to use a different convention.

  __Default__: `Api.js`

  ```ruby
  config.file_suffix = 'Api.ts'
  ```

### `filename_style`
  
  Allows to configure filename style for the generated files. You can modify it if you want to use a different filename convention. 
  
  `:kebab` - Converts the controller name to kebab-case and appends the file suffix in lowercase.
  
  `:camel` - Converts the controller name to CamelCase and appends the file suffix.

  __Default__: `:camel`

  ```ruby
  config.filename_style = :kebab
  ```

### `helper_mappings`
  
  Defines how to obtain a path helper name from the name of a route (controller action).
  
  __Default__: `{"index" => "list", "show" => "get"}`

  ```ruby
  config.helper_mappings = {"edit" => "infoForUpdate"}
  ```

### `output_folder`
  
  The directory where the generated files are created.

  By default it will use the first of the following directories that exists.

  __Default__: `app/{frontend,javascript,packs,assets}/api`

  ```ruby
  config.output_folder = Rails.root.join('app', 'path_helpers')
  ```

### `template_path`

  The path of an ERB template that will be used to generate a helpers file.

  Read more about it in [_Code Generation_][different template].

  [__Default__][default template]

  ```ruby
  config.template_path = Rails.root.join('custom_js_from_routes.js.erb')
  ```

### `template_all_path`

  The path of an ERB template that will be used to export all helper files.

  You can provide a path to a custom template if the default conventions don't suit your needs.

  [__Default__][template all]

  ```ruby
  config.template_all_path = Rails.root.join('custom_all_helpers.js.erb')
  ```

### `template_index_path`

  Similar to the above, it re-exports all helpers, but also combines them in a default export allowing you to use a single object to access all the helpers.

  You can provide a path to a custom template if the default conventions don't suit your needs.

  [__Default__][template index]

  ```ruby
  config.template_index_path = Rails.root.join('custom_index_helpers.js.erb')
  ```

## Client Configuration

Coming soon...

For now, check the [_Client Libraries_](/client/#configuring-requests-⚙%EF%B8%8F) section.

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
