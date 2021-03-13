if Rails.env.development?
  # Example: Generate TypeScript files.
  JsFromRoutes.config do |config|
    config.file_suffix = "Api.ts"
  end
end
