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

  def expect_templates
    expect_any_instance_of(JsFromRoutes::Template)
  end

  def be_rendered
    receive(:render_template)
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
      config.all_helpers_file = false
      config.output_folder = output_dir
      config.template_path = original_template_path
    end
  end

  # NOTE: We do a manual snapshot test for now, more tests coming in the future.
  it "should generate the files as expected" do
    expect_templates.to be_rendered.exactly(3).times.and_call_original
    JsFromRoutes.generate!

    # It does not generate routes that don't have `export: true`.
    expect(output_file_for("Welcome").exist?).to eq false

    # It generates one file per controller with exported routes.
    controllers_with_exported_routes.each do |file_name|
      expect(output_file_for(file_name).read).to eq sample_file_for(file_name).read
    end

    # It does not render if generating again.
    JsFromRoutes.generate!
  end

  context "changing the template" do
    before do
      JsFromRoutes.generate!

      JsFromRoutes.config do |config|
        config.template_path = different_template_path
      end
    end

    it "detects changes and re-renders" do
      expect_templates.to be_rendered.exactly(3).times.and_call_original
      JsFromRoutes.generate!

      # These files should no longer match the sample ones.
      controllers_with_exported_routes.each do |file_name|
        expect(output_file_for(file_name).read).not_to eq sample_file_for(file_name).read
      end

      # It should not rewrite the files if the cache key has not changed.
      JsFromRoutes.generate!
    end
  end

  context "when generating all_helpers_file" do
    before do
      JsFromRoutes.generate!

      JsFromRoutes.config do |config|
        config.all_helpers_file = true
      end
    end

    it "generates a file with all helpers" do
      JsFromRoutes.generate!
      expect(output_dir.join("all.ts").exist?).to eq true
      expect(output_dir.join("index.ts").exist?).to eq true

      # Should not trigger another render.
      expect_templates.not_to be_rendered
      JsFromRoutes.generate!
    end
  end

  it "should have a rake task available" do
    Rails.application.load_tasks
    expect_templates.to be_rendered.exactly(3).times
    expect { Rake::Task["js_from_routes:generate"].invoke }.not_to raise_error
  end
end
