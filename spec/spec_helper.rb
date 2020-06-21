require 'simplecov'
require 'coveralls'
SimpleCov.start { add_filter '/spec/' }
Coveralls.wear!

require 'js_from_routes'
require 'rspec/given'
require 'pry-byebug'
