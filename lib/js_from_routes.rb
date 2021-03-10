# frozen_string_literal: true

# Splitting the generator file allows consumers to skip the Railtie if desired:
#  - gem 'js_from_routes', require: false
#  - require 'js_from_routes/generator'
require "js_from_routes/generator"
require "js_from_routes/railtie"
