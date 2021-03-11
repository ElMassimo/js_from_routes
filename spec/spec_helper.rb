require "simplecov"
SimpleCov.start { add_filter "/spec/" }

require "rails"
require "js_from_routes"
require "rspec/given"
require "pry-byebug"

$LOAD_PATH.push File.expand_path("../playground", __dir__)
