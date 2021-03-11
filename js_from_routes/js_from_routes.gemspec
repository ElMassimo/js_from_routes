require File.expand_path("../lib/js_from_routes/version", __FILE__)

Gem::Specification.new do |s|
  s.name = "js_from_routes"
  s.version = JsFromRoutes::VERSION
  s.authors = ["Máximo Mussini"]
  s.email = ["maximomussini@gmail.com"]
  s.summary = "Generate JS automatically from Rails routes."
  s.description = "js_from_routes helps you by automatically generating path and API helpers from Rails route definitions, allowing you to save development effort and focus on the things that matter."
  s.homepage = "https://github.com/ElMassimo/js_from_routes"
  s.license = "MIT"
  s.extra_rdoc_files = ["README.md"]
  s.files = Dir.glob("{lib}/**/*.{rb,erb}") + %w[README.md CHANGELOG.md]
  s.test_files = Dir.glob("{spec}/**/*.rb")
  s.require_path = "lib"

  s.add_dependency "railties", ">= 5.1", "< 8"

  s.add_development_dependency "bundler", "~> 2"
  s.add_development_dependency "listen", "~> 3.2"
  s.add_development_dependency "pry-byebug", "~> 3.9"
  s.add_development_dependency "rake", "~> 13"
  s.add_development_dependency "rspec-given", "~> 3.8"
  s.add_development_dependency "simplecov", "< 0.18"
  s.add_development_dependency "standard", "~> 1.0"
end
