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
      filtered = routes.reject { |route| route.requirements[:action] == "update" && route.verb == "PUT" }

      # Rails only names one route per path (e.g. `index` but not `create`,
      # `show` but not `update`/`destroy`). Borrow the named sibling on the same
      # path so a collision can be resolved with a meaningful prefix.
      names_by_path = filtered.each_with_object({}) { |route, map|
        map[Route.path_for(route)] ||= route.name if route.name
      }

      @routes = filtered
        .group_by { |route| route.requirements.fetch(:action) }
        .flat_map { |action, action_routes|
          action_routes.each_with_index.map { |route, index|
            Route.new(route, mappings: config.helper_mappings, index:, controller:, names_by_path:)
          }
        }

      ensure_unique_helpers!
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

    private

    # Internal: Guarantees helper names are unique within the file, so no route
    # is silently dropped when several resolve to the same controller#action
    # (e.g. a resource nested under two parents, see #42). Names that are already
    # unique are left untouched — only a genuine collision is escalated, to the
    # cleanest available alternative.
    def ensure_unique_helpers!
      seen = {}
      @routes.each do |route|
        name = route.helper
        if seen[name]
          name = route.alternate_helpers.find { |candidate| !seen[candidate] } || uniquify(name, seen)
          route.helper = name
        end
        seen[name] = true
      end
    end

    # Internal: Appends the smallest numeric suffix that makes `name` unique.
    def uniquify(name, seen)
      suffix = 2
      suffix += 1 while seen["#{name}#{suffix}"]
      "#{name}#{suffix}"
    end
  end

  # Internal: A presenter for an individual Rails action.
  class Route
    # Allows the collision pass in ControllerRoutes to override the helper name.
    attr_writer :helper

    def initialize(route, mappings:, controller:, index: 0, names_by_path: {})
      @route, @mappings, @controller, @index, @names_by_path =
        route, mappings, controller, index, names_by_path
    end

    # Internal: The path for a raw Journey route, without the format suffix.
    def self.path_for(route)
      route.path.spec.to_s.chomp("(.:format)")
    end

    # Public: The `export` setting specified for the action.
    def export
      @route.defaults[:export]
    end

    # Public: The HTTP verb for the action. Example: 'patch'
    def verb
      @route.verb.split("|").last.downcase
    end

    # Public: The path for the action. Example: '/users/:id/edit'
    def path
      self.class.path_for(@route)
    end

    # Public: The name of the JS helper for the action. Example: 'destroyAll'
    #
    # The first route for an action uses the plain action name (`index`, `show`,
    # `create`, ...); additional routes for the same action fall back to the
    # Rails route name. ControllerRoutes may override this (see `helper=`) only
    # when two routes would otherwise collide.
    def helper
      @helper ||= begin
        action = @route.requirements.fetch(:action)
        if @index > 0
          action = @route.name&.sub(@controller.tr(":/", "_"), "") || "#{action}#{verb.titleize}"
        end
        mapped(action.camelize(:lower))
      end
    end

    # Internal: Meaningful alternatives, cleanest first, used only to resolve a
    # helper-name collision. Prefers the full route name, then a named sibling on
    # the same path qualified by the action, then the action qualified by verb.
    def alternate_helpers
      action = @route.requirements.fetch(:action)
      [
        @route.name && mapped(@route.name.camelize(:lower)),
        (sibling = @names_by_path[path]) && mapped("#{sibling}_#{action}".camelize(:lower)),
        mapped("#{action}_#{verb}".camelize(:lower))
      ].compact
    end

    # Internal: Useful as a cache key for the route, and for debugging purposes.
    def inspect
      "#{verb} #{helper} #{path}"
    end

    private

    def mapped(name)
      @mappings.fetch(name, name)
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

  class TemplateConfig
    attr_reader :cache_key, :filename, :helpers

    def initialize(cache_key:, filename:, helpers: nil)
      @cache_key = cache_key
      @filename = filename
      @helpers = helpers
    end
  end

  # Public: A generator instance with its own configuration. Allows generating
  # routes separately for different sub-apps in a Rails monolith.
  #
  # Example:
  #   JsFromRoutes.config(:admin) do |config|
  #     config.output_folder = Rails.root.join("app/javascript/admin/api")
  #     config.export_if = ->(route) { route.defaults[:export] == :admin }
  #   end
  #
  #   JsFromRoutes.config(:public) do |config|
  #     config.output_folder = Rails.root.join("app/javascript/public/api")
  #     config.export_if = ->(route) { route.defaults[:export] == :public }
  #   end
  class Instance
    attr_reader :name, :config

    def initialize(name, config)
      @name = name
      @config = config
    end

    # Public: Generates code for the specified routes with { export: true }.
    def generate!(app_or_routes = Rails.application)
      raise ArgumentError, "A Rails app must be defined, or you must specify a custom `output_folder`" if config.output_folder.to_s.blank?
      rails_routes = app_or_routes.is_a?(::Rails::Engine) ? app_or_routes.routes.routes : app_or_routes
      generate_files(exported_routes_by_controller(rails_routes))
    end

    private

    def generate_files(exported_routes)
      template = Template.new(config.template_path)
      generate_file_for_all exported_routes.filter_map { |controller, routes|
        next unless controller
        ControllerRoutes.new(controller, routes, config).tap do |routes|
          template.write_if_changed routes
        end
      }
    end

    def generate_file_for_all(routes)
      return unless config.all_helpers_file && !routes.empty?

      preferred_extension = File.extname(config.file_suffix)
      index_file = (config.all_helpers_file == true) ? "index#{preferred_extension}" : config.all_helpers_file

      Template.new(config.template_all_path).write_if_changed TemplateConfig.new(
        cache_key: routes.map(&:import_filename).join + File.read(config.template_all_path),
        filename: config.output_folder.join("all#{preferred_extension}"),
        helpers: routes,
      )
      Template.new(config.template_index_path).write_if_changed TemplateConfig.new(
        cache_key: File.read(config.template_index_path),
        filename: config.output_folder.join(index_file),
      )
    end

    def namespace_for_route(route)
      if (export = route.defaults[:export]).is_a?(Hash)
        export[:namespace]
      end || route.requirements[:controller]
    end

    # Internal: Returns exported routes grouped by controller name.
    def exported_routes_by_controller(routes)
      routes
        .select { |route| config.export_if.call(route) }
        .group_by { |route| namespace_for_route(route)&.to_s }
    end
  end

  class << self
    # Public: Configuration of the code generator.
    #
    # Without a name, returns/yields the default global configuration:
    #   JsFromRoutes.config do |config|
    #     config.file_suffix = "Api.ts"
    #   end
    #
    # With a name, defines a named generator instance with its own configuration,
    # allowing separate route generation for different sub-apps:
    #   JsFromRoutes.config(:admin) do |config|
    #     config.output_folder = Rails.root.join("app/javascript/admin/api")
    #     config.export_if = ->(route) { route.defaults[:export] == :admin }
    #   end
    def config(name = nil)
      if name
        root = ::Rails.root || Pathname.new(Dir.pwd)
        new_config = Configuration.new(root)
        yield(new_config) if block_given?
        instances[name] = Instance.new(name, new_config)
      else
        @config ||= Configuration.new(::Rails.root || Pathname.new(Dir.pwd))
        if block_given?
          @config_customized = true
          yield(@config)
        end
        @config
      end
    end

    # Public: Returns all registered named instances.
    def instances
      @instances ||= {}
    end

    # Public: Generates code for the specified routes with { export: true }.
    #
    # Runs every named instance, plus the default global config whenever it was
    # explicitly configured (or when no named instances exist at all). This keeps
    # mixed usage working: adding a named instance never silently disables the
    # global config that an existing app already relies on.
    def generate!(app_or_routes = Rails.application)
      runnable = instances.values
      runnable.unshift(Instance.new(:default, config)) if @config_customized || runnable.empty?
      runnable.each { |inst| inst.generate!(app_or_routes) }
    end
  end
end
