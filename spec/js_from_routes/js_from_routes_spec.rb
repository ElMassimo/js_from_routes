require "vanilla/config/application"
require "vanilla/config/routes"

describe JsFromRoutes do
  original_template_path = JsFromRoutes.config.template_path

  let(:output_dir) { Pathname.new File.expand_path("../support/generated", __dir__) }
  let(:sample_dir) { Rails.root.join("app", "javascript", "api") }
  let(:different_template_path) { File.expand_path("../support/jquery_template.js.erb", __dir__) }
  let(:controllers_with_exported_routes) { %w[Comments UserPreferences VideoClips] }

  def file_for(dir, name)
    dir.join("#{name}Api.ts")
  end

  def sample_file_for(name)
    file_for(sample_dir, name)
  end

  def output_file_for(name)
    file_for(output_dir, name)
  end

  before do
    # Sanity checks
    expect(sample_dir.exist?).to eq true
    expect(Rails.application.routes.routes).to be_present

    # Remove directory from a previous test run.
    begin
      FileUtils.remove_dir(output_dir)
    rescue
      nil
    end

    # Change the configuration to use a different directory.
    JsFromRoutes.config do |config|
      config.file_suffix = "Api.ts"
      config.output_folder = output_dir
      config.template_path = original_template_path
    end
  end

  # NOTE: We do a manual snapshot test for now, more tests coming in the future.
  it "should generate the files as expected" do
    expect(JsFromRoutes).to receive(:render_template).exactly(3).times.and_call_original
    JsFromRoutes.generate!

    # It does not generate routes that don't have `export: true`.
    expect(output_file_for("Welcome").exist?).to eq false

    # It generates one file per controller with exported routes.
    controllers_with_exported_routes.each do |file_name|
      expect(output_file_for(file_name).read).to eq sample_file_for(file_name).read
    end

    # It detects changes to the template, and regenerates the files.
    JsFromRoutes.config do |config|
      config.template_path = different_template_path
    end
    expect(JsFromRoutes).to receive(:render_template).exactly(3).times.and_call_original
    JsFromRoutes.generate!

    # These files should no longer match the sample ones.
    controllers_with_exported_routes.each do |file_name|
      expect(output_file_for(file_name).read).not_to eq sample_file_for(file_name).read
    end

    # It should not rewrite the files if the cache key has not changed.
    expect(JsFromRoutes).not_to receive(:render_template)
    JsFromRoutes.generate!
  end

  it "should have a rake task available" do
    Rails.application.load_tasks
    expect(JsFromRoutes).to receive(:render_template).exactly(3).times
    expect { Rake::Task["js_from_routes:generate"].invoke }.not_to raise_error
  end
end
