# frozen_string_literal: true

require "digest"
require "erubi"
require "fileutils"
require "pathname"

# Public: Automatically generates JS for Rails routes with { export: true }.
# Generates one file per controller, and one function per route.
module JsFromRoutes
  # Internal: Helper class used as a presenter for the routes template.
  class ControllerRoutes
    attr_reader :routes

    def initialize(controller, routes, config)
      @controller, @config = controller, config
      @routes = routes
        .uniq { |route| route.requirements.fetch(:action) }
        .map { |route| Route.new(route, config.helper_mappings) }
    end

    # Public: Used to check whether the file should be generated again, changes
    # based on the configuration, and route definition.
    def cache_key
      routes.map(&:inspect).join + [File.read(@config.template_path), @config.helper_mappings.inspect, @config.client_library].join
    end

    # Public: Exposes the preferred import library to the generator.
    def client_library
      @config.client_library
    end

    # Internal: Name of the JS file with helpers for the the given controller.
    def filename
      @config.output_folder.join(basename)
    end

    # Public: Name of the JS file with helpers for the the given controller.
    def import_filename
      filename.relative_path_from(@config.output_folder).to_s.sub(/\.\w+$/, "")
    end

    # Public: Name of the file as a valid JS variable.
    def js_name
      @controller.camelize(:lower).tr(":", "")
    end

    # Internal: The base name of the JS file to be written.
    def basename
      "#{@controller.camelize}#{@config.file_suffix}".tr_s(":", "/")
    end
  end

  # Internal: A presenter for an individual Rails action.
  class Route
    def initialize(route, mappings = {})
      @route, @mappings = route, mappings
    end

    # Public: The `export` setting specified for the action.
    def export
      @route.defaults[:export]
    end

    # Public: The HTTP verb for the action. Example: 'patch'
    def verb
      @route.verb.downcase
    end

    # Public: The path for the action. Example: '/users/:id/edit'
    def path
      @route.path.spec.to_s.chomp("(.:format)")
    end

    # Public: The name of the JS helper for the action. Example: 'destroyAll'
    def helper
      action = @route.requirements.fetch(:action).camelize(:lower)
      @mappings.fetch(action, action)
    end

    # Internal: Useful as a cache key for the route, and for debugging purposes.
    def inspect
      "#{verb} #{helper} #{path}"
    end
  end

  # Internal: Represents a compiled template that can write itself to a file.
  class Template
    def initialize(template_path)
      # NOTE: The compiled ERB template, used to generate JS code.
      @compiled_template = Erubi::Engine.new(File.read(template_path), filename: template_path).src
    end

    # Public: Checks if the cache is fresh, or renders the template with the
    # specified variables, and writes the updated result to a file.
    def write_if_changed(object)
      write_file_if_changed(object.filename, object.cache_key) { render_template(object) }
    end

    private

    # Internal: Returns a String with the generated JS code.
    def render_template(object)
      object.instance_eval(@compiled_template)
    end

    # Internal: Returns true if the cache key has changed since the last codegen.
    def stale?(file, cache_key_comment)
      ENV["JS_FROM_ROUTES_FORCE"] || file.gets != cache_key_comment
    end

    # Internal: Writes if the file does not exist or the cache key has changed.
    # The cache strategy consists of a comment on the first line of the file.
    #
    # Yields to receive the rendered file content when it needs to.
    def write_file_if_changed(name, cache_key)
      FileUtils.mkdir_p(name.dirname)
      cache_key_comment = "// JsFromRoutes CacheKey #{Digest::MD5.hexdigest(cache_key)}\n"
      File.open(name, "a+") { |file|
        if stale?(file, cache_key_comment)
          file.truncate(0)
          file.write(cache_key_comment)
          file.write(yield)
        end
      }
    end
  end

  class Configuration
    attr_accessor :all_helpers_file, :client_library, :export_if, :file_suffix,
      :helper_mappings, :output_folder, :template_path,
      :template_all_path, :template_index_path

    def initialize(root)
      dir = %w[frontend packs javascript assets].find { |dir| root.join("app", dir).exist? }
      @all_helpers_file = true
      @client_library = "@js-from-routes/client"
      @export_if = ->(route) { route.defaults.fetch(:export, nil) }
      @file_suffix = "Api.js"
      @helper_mappings = {}
      @output_folder = root.join("app", dir, "api")
      @template_path = File.expand_path("template.js.erb", __dir__)
      @template_all_path = File.expand_path("template_all.js.erb", __dir__)
      @template_index_path = File.expand_path("template_index.js.erb", __dir__)
    end
  end

  class << self
    # Public: Configuration of the code generator.
    def config
      @config ||= Configuration.new(::Rails.root || Pathname.new(Dir.pwd))
      yield(@config) if block_given?
      @config
    end

    # Public: Generates code for the specified routes with { export: true }.
    def generate!(app_or_routes = Rails.application)
      raise ArgumentError, "A Rails app must be defined, or you must specify a custom `output_folder`" if config.output_folder.blank?
      rails_routes = app_or_routes.is_a?(::Rails::Engine) ? app_or_routes.routes.routes : app_or_routes
      generate_files exported_routes_by_controller(rails_routes)
    end

    private

    def generate_files(exported_routes)
      template = Template.new(config.template_path)
      generate_file_for_all exported_routes.map { |controller, routes|
        ControllerRoutes.new(controller, routes, config).tap do |routes|
          template.write_if_changed routes
        end
      }
    end

    def generate_file_for_all(routes)
      return unless config.all_helpers_file && !routes.empty?

      preferred_extension = File.extname(config.file_suffix)
      index_file = (config.all_helpers_file == true) ? "index#{preferred_extension}" : config.all_helpers_file

      Template.new(config.template_all_path).write_if_changed OpenStruct.new(
        cache_key: routes.map(&:import_filename).join + File.read(config.template_all_path),
        filename: config.output_folder.join("all#{preferred_extension}"),
        helpers: routes,
      )
      Template.new(config.template_index_path).write_if_changed OpenStruct.new(
        cache_key: File.read(config.template_index_path),
        filename: config.output_folder.join(index_file),
      )
    end

    # Internal: Returns exported routes grouped by controller name.
    def exported_routes_by_controller(routes)
      routes.select { |route|
        config.export_if.call(route) && route.requirements[:controller]
      }.group_by { |route|
        route.requirements.fetch(:controller)
      }
    end
  end
end
