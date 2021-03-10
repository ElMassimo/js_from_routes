# frozen_string_literal: true

# NOTE: Not strictly required, but it helps to simplify the setup.
class JsFromRoutes::Railtie < Rails::Railtie
  railtie_name :js_from_routes

  if Rails.env.development?
    # Allows to automatically trigger code generation after updating routes.
    initializer "js_from_routes.reloader" do |app|
      app.config.to_prepare do
        JsFromRoutes.generate!(app)
      end
    end
  end

  # Suitable when triggering code generation manually.
  rake_tasks do |app|
    namespace :js_from_routes do
      desc "Generates JavaScript files from Rails routes, one file per controller, and one function per route."
      task generate: :environment do
        JsFromRoutes.generate!(app)
      end
    end
  end
end
