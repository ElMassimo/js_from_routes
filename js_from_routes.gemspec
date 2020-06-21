# coding: utf-8
require File.expand_path('../lib/js_from_routes/version', __FILE__)

Gem::Specification.new do |s|
  s.name = 'js_from_routes'
  s.version = JsFromRoutes::VERSION
  s.authors = ['Máximo Mussini']
  s.email = ['maximomussini@gmail.com']
  s.summary = 'Generate JS automatically from Rails routes.'
  s.description = 'js_from_routes allows to automatically generate path and API helpers from Rails route definitions, allowing you to save development effort and focus on the things that matter.'
  s.homepage = 'https://github.com/ElMassimo/js_from_routes'
  s.license = 'MIT'
  s.extra_rdoc_files = ['README.md']
  s.files = Dir.glob('{lib}/**/*.rb') + %w(README.md)
  s.test_files   = Dir.glob('{spec}/**/*.rb')
  s.require_path = 'lib'

  s.add_dependency 'railties'
  s.add_development_dependency 'bundler'
  s.add_development_dependency 'rake'
end
