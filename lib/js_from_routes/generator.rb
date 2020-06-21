# frozen_string_literal: true

require 'digest'
require 'erubi'
require 'fileutils'

# Public: Automatically generates JS for Rails routes with { export: true }.
# Generates one file per controller, and one function per route.
module JsFromRoutes
  # Internal: Helper class used as a presenter for the routes template.
  class Routes
    attr_reader :routes

    def initialize(routes, config)
      @config = config
      @routes = routes
        .uniq { |route| route.requirements.fetch(:action) }
        .map { |route| Route.new(route, config.helper_mappings) }
    end

    # Public: Used to check whether the file should be generated again, changes
    # based on the configuration, and route definition.
    def cache_key
      Digest::MD5.hexdigest(routes.map(&:inspect).join + [File.read(@config.template_path), @config.helper_mappings.inspect].join)
    end

    # Internal: By performing the evaluation here, we ensure only "routes" is
    # exposed to the ERB template as a local variable.
    def evaluate(compiled_template)
      instance_eval(compiled_template)
    end
  end

  # Internal: A presenter for an individual Rails action.
  class Route
    def initialize(route, mappings = {})
      @route, @mappings = route, mappings
    end

    # Public: Whether it should export only the path.
    def path_only?
      @route.defaults[:export] == :path_only
    end

    # Public: Whether it should export only the path.
    def request_method?
      !path_only?
    end

    # Public: The HTTP verb for the action. Example: 'patch'
    def verb
      @route.verb.downcase
    end

    # Public: The path for the action. Example: '/users/:id/edit'
    def path
      @route.path.spec.to_s.chomp('(.:format)')
    end

    # Public: The name of the JS helper for the action. Example: 'destroyAll'
    def helper
      action = @route.requirements.fetch(:action).camelize(:lower)
      name = @mappings.fetch(action, action)
      path_only? ? "#{ name }Path" : name
    end

    # Internal: Useful as a cache key for the route, and for debugging purposes.
    def inspect
      "#{ verb } #{ helper } #{ path }"
    end
  end

  class << self
    # Public: Configuration of the code generator.
    def config
      @config ||= OpenStruct.new(
        file_suffix: 'Requests.js',
        output_folder: ::Rails.root&.join('app', 'javascript', 'requests'),
        template_path: File.expand_path('template.js.erb', __dir__),
        helper_mappings: { 'index' => 'list', 'show' => 'get' },
      )
      yield(@config) if block_given?
      @config
    end

    # Public: Generates code for the specified routes with { export: true }.
    def generate!(app_or_routes = Rails.application)
      raise ArgumentError, 'A Rails app must be defined, or you must specify a custom `output_folder`' if config.output_folder.blank?
      rails_routes = app_or_routes.is_a?(::Rails::Engine) ? app_or_routes.routes.routes : app_or_routes
      @compiled_template = nil # Clear on every code reload in case the template changed.
      exported_routes_by_controller(rails_routes).each do |controller, controller_routes|
        routes = Routes.new(controller_routes, config)
        write_if_changed(filename_for(controller), routes.cache_key) { render_template(routes) }
      end
    end

  private

    # Internal: Returns exported routes grouped by controller name.
    def exported_routes_by_controller(routes)
      routes.select { |route|
        route.defaults.fetch(:export, false)
      }.group_by { |route|
        route.requirements.fetch(:controller)
      }
    end

    # Internal: Name of the JS file with helpers for the the given controller.
    def filename_for(controller)
      config.output_folder.join("#{ controller.camelize }#{ config.file_suffix }".tr_s(':', '/'))
    end

    # Internal: Returns a String with the JS generated for a controller's routes.
    def render_template(routes)
      routes.evaluate(compiled_template)
    end

    # Internal: Returns the compiled ERB to generate JS from a set of routes.
    def compiled_template
      @compiled_template ||= begin
        template = File.read(config.template_path)
        Erubi::Engine.new(template, filename: config.template_path).src
      end
    end

    # Internal: Writes if the file does not exist or the cache key has changed.
    # The cache strategy consists of a comment on the first line of the file.
    #
    # Yields to receive the rendered file content when it needs to.
    def write_if_changed(name, cache_key)
      FileUtils.mkdir_p(name.dirname)
      cache_key_comment = "// JsFromRoutes CacheKey #{ cache_key }\n"
      File.open(name, 'a+') { |file|
        if file.gets != cache_key_comment
          file.truncate(0)
          file.write(cache_key_comment)
          file.write(yield)
        end
      }
    end
  end
end
