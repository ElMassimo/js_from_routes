require "vanilla/config/application"
require "vanilla/config/routes"

describe JsFromRoutes do
  original_template_path = JsFromRoutes.config.template_path

  let(:output_dir) { Pathname.new File.expand_path("../support/generated", __dir__) }
  let(:sample_dir) { Rails.root.join("app", "javascript", "api") }
  let(:different_template_path) { File.expand_path("../support/jquery_template.js.erb", __dir__) }
  let(:controllers_with_exported_routes) { %w[Comments Settings/UserPreferences VideoClips] }

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

  def expect_no_rewrites
    mtimes = output_dir.glob("**/*.ts").to_h { |file| [file, file.mtime] }
    yield
    expect(output_dir.glob("**/*.ts").to_h { |file| [file, file.mtime] }).to eq(mtimes)
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

  after do
    JsFromRoutes.instances.clear
  end

  # NOTE: We do a manual snapshot test for now, more tests coming in the future.
  it "should generate the files as expected" do
    JsFromRoutes.generate!

    # It generates one file per controller with exported routes, and nothing else.
    expect(output_dir.glob("**/*.ts")).to match_array(controllers_with_exported_routes.map { |name| output_file_for(name) })

    # It generates one file per controller with exported routes.
    controllers_with_exported_routes.each do |file_name|
      expect(output_file_for(file_name).read).to eq sample_file_for(file_name).read
    end

    # It does not write files whose content did not change.
    expect_no_rewrites { JsFromRoutes.generate! }
  end

  it "rewrites files whose content no longer matches" do
    JsFromRoutes.generate!

    comments_file = output_file_for("Comments")
    comments_file.write("// edited by hand\n")

    JsFromRoutes.generate!
    expect(comments_file.read).to eq sample_file_for("Comments").read
  end

  context "changing the template" do
    before do
      JsFromRoutes.generate!

      JsFromRoutes.config do |config|
        config.template_path = different_template_path
      end
    end

    it "detects changes and re-renders" do
      JsFromRoutes.generate!

      # These files should no longer match the sample ones.
      controllers_with_exported_routes.each do |file_name|
        expect(output_file_for(file_name).read).not_to eq sample_file_for(file_name).read
      end

      # It does not write files whose content did not change.
      expect_no_rewrites { JsFromRoutes.generate! }
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

      # It does not write files whose content did not change.
      expect_no_rewrites { JsFromRoutes.generate! }
    end
  end

  context "with multiple named instances" do
    let(:admin_output_dir) { output_dir.join("admin") }
    let(:public_output_dir) { output_dir.join("public") }

    before do
      [admin_output_dir, public_output_dir].each do |dir|
        expect(dir.to_s).to start_with(output_dir.to_s)
        FileUtils.rm_rf(dir)
      end

      JsFromRoutes.config(:admin) do |config|
        config.output_folder = admin_output_dir
        config.all_helpers_file = false
        config.file_suffix = "Api.ts"
        config.export_if = ->(route) { route.defaults[:export] == true && route.requirements[:controller]&.start_with?("settings/") }
      end

      JsFromRoutes.config(:public) do |config|
        config.output_folder = public_output_dir
        config.all_helpers_file = false
        config.file_suffix = "Api.ts"
        config.export_if = ->(route) { route.defaults[:export] == true && !route.requirements[:controller]&.start_with?("settings/") }
      end
    end

    it "generates only matching route subsets for each instance" do
      JsFromRoutes.generate!

      expect(file_for(admin_output_dir, "Settings/UserPreferences").exist?).to be true
      expect(file_for(admin_output_dir, "Comments").exist?).to be false
      expect(file_for(admin_output_dir, "VideoClips").exist?).to be false

      expect(file_for(public_output_dir, "Settings/UserPreferences").exist?).to be false
      expect(file_for(public_output_dir, "Comments").exist?).to be true
      expect(file_for(public_output_dir, "VideoClips").exist?).to be true
    end

    it "still generates the explicitly configured global config alongside named instances" do
      JsFromRoutes.generate!

      # Registering named instances must not silently disable a global config
      # the app already relies on: its output is still generated to output_dir.
      controllers_with_exported_routes.each do |file_name|
        expect(output_file_for(file_name).exist?).to be true
      end
    end
  end

  context "with only named instances and an untouched global config" do
    let(:only_output_dir) { output_dir.join("only") }

    before do
      expect(only_output_dir.to_s).to start_with(output_dir.to_s)
      FileUtils.rm_rf(only_output_dir)

      JsFromRoutes.config(:only) do |config|
        config.output_folder = only_output_dir
        config.all_helpers_file = false
        config.file_suffix = "Api.ts"
        config.export_if = ->(route) { route.defaults[:export] == true }
      end
    end

    it "does not generate the default global config when it was never explicitly configured" do
      # The shared setup customizes the global config, so simulate an app that
      # only ever registered named instances by resetting that flag.
      JsFromRoutes.instance_variable_set(:@config_customized, false)

      JsFromRoutes.generate!

      # The named instance generates its own output...
      expect(file_for(only_output_dir, "Comments").exist?).to be true

      # ...but no stray default output is written to the global output_folder.
      controllers_with_exported_routes.each do |file_name|
        expect(output_file_for(file_name).exist?).to be false
      end
    end
  end

  describe "generate_if_changed" do
    let(:routes_file) { Rails.root.join("config/routes.rb").to_s }

    before do
      JsFromRoutes.instance_variable_set(:@routes_watcher, nil)
      Rails.application.routes_reloader.paths.push(routes_file) unless Rails.application.routes_reloader.paths.include?(routes_file)
    end

    it "generates on the first call, then only when a routes file changes" do
      expect_templates.to be_rendered.exactly(3).times.and_call_original
      JsFromRoutes.generate_if_changed
      expect(output_file_for("Comments").exist?).to eq true

      expect_templates.not_to be_rendered
      JsFromRoutes.generate_if_changed
    end

    it "regenerates after a routes file was modified" do
      JsFromRoutes.generate_if_changed

      FileUtils.touch(routes_file)
      expect_templates.to be_rendered.exactly(3).times.and_call_original
      JsFromRoutes.generate_if_changed
    end

    it "regenerates after a template was modified" do
      JsFromRoutes.generate_if_changed

      FileUtils.touch(JsFromRoutes.config.template_path)
      expect_templates.to be_rendered.exactly(3).times.and_call_original
      JsFromRoutes.generate_if_changed
    end
  end

  it "should have a rake task available" do
    Rails.application.load_tasks
    expect(JsFromRoutes).to receive(:generate!).with(Rails.application).at_least(:once).and_call_original
    expect { Rake::Task["js_from_routes:generate"].invoke }.not_to raise_error

    controllers_with_exported_routes.each do |file_name|
      expect(output_file_for(file_name).exist?).to be true
    end
  end
end
