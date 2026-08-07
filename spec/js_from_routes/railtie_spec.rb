# frozen_string_literal: true

require "vanilla/config/application"
require "vanilla/config/routes"

# The suite never calls Rails.application.initialize!, so the Railtie
# initializer doesn't run in specs. This example installs the same override
# the Railtie applies and asserts its effect on a real playground route.

RSpec.describe "js_from_routes required_default? override" do
  it "excludes :export from a route's required_defaults" do
    ActionDispatch::Journey::Route.prepend(Module.new do
      def required_default?(key) = (key == :export) ? false : super
    end)

    route = Rails.application.routes.routes.find { |r|
      r.defaults[:controller] == "video_clips" && r.defaults[:action] == "create"
    }
    route.instance_variable_set(:@required_defaults, nil) # bust memoization
    expect(route.required_default?(:export)).to be false
    expect(route.required_defaults).not_to include(:export)
    expect(route.required_defaults).to include(:controller, :action)
  end
end
