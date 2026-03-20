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

  context "with helper_naming: :route_name" do
    before do
      JsFromRoutes.config do |config|
        config.helper_naming = :route_name
      end
    end

    after do
      JsFromRoutes.config do |config|
        config.helper_naming = :action
      end
    end

    it "uses route names for JS helper names" do
      JsFromRoutes.generate!

      video_clips_content = output_file_for("VideoClips").read

      # Named routes use the route name with controller prefix stripped and camelCased.
      # "download_video_clip" → strips "video_clips" (no match, singular) → "downloadVideoClip"
      expect(video_clips_content).to include("downloadVideoClip:")
      expect(video_clips_content).to include("addToPlaylistVideoClip:")
      expect(video_clips_content).to include("thumbnailVideoClip:")
      expect(video_clips_content).to include("newVideoClip:")
      expect(video_clips_content).to include("editVideoClip:")

      # "latest_video_clips" → strips "video_clips" → "latest"
      expect(video_clips_content).to include("latest:")

      # "video_clips" (create) → strips "video_clips" → empty → falls back to action name
      expect(video_clips_content).to include("create:")

      # Unnamed routes fall back to action-based naming.
      expect(video_clips_content).to include("destroy:")
    end

    it "handles namespaced controllers" do
      JsFromRoutes.generate!

      user_prefs_content = output_file_for("Settings/UserPreferences").read

      # "switch_to_classic_navbar_settings_user_preferences" → strips "settings_user_preferences" → "switch_to_classic_navbar"
      expect(user_prefs_content).to include("switchToClassicNavbar:")

      # "switch_to_beta_page_settings_user_preferences" → strips "settings_user_preferences" → "switch_to_beta_page"
      expect(user_prefs_content).to include("switchToBetaPage:")

      # Unnamed route falls back to action-based naming.
      expect(user_prefs_content).to include("switchToClassic:")
    end

    it "exposes route names via Route#name" do
      JsFromRoutes.generate!

      routes = Rails.application.routes.routes
      exported = routes.select { |r| r.defaults[:export] && r.requirements[:controller] == "video_clips" }
      download_route = exported.find { |r| r.requirements[:action] == "download" }
      expect(download_route.name).to eq("download_video_clip")

      presenter = JsFromRoutes::Route.new(download_route, mappings: {}, controller: "video_clips", naming: :route_name)
      expect(presenter.name).to eq("download_video_clip")
      expect(presenter.helper).to eq("downloadVideoClip")
    end

    it "invalidates cache when switching helper_naming" do
      # Generate with default :action naming first.
      JsFromRoutes.config { |c| c.helper_naming = :action }
      JsFromRoutes.generate!
      action_content = output_file_for("VideoClips").read

      # Now switch to :route_name and regenerate.
      JsFromRoutes.config { |c| c.helper_naming = :route_name }
      JsFromRoutes.generate!
      route_name_content = output_file_for("VideoClips").read

      # Cache keys differ so files are regenerated with different helper names.
      expect(action_content).not_to eq(route_name_content)
      expect(action_content).to include("download:")
      expect(route_name_content).to include("downloadVideoClip:")
    end
  end

  context "with per-route export: { name: :route_name } override" do
    before do
      # Ensure global naming is :action (default).
      JsFromRoutes.config do |config|
        config.helper_naming = :action
      end
    end

    it "uses route name for individually opted-in routes" do
      routes = Rails.application.routes.routes
      exported_video = routes.select { |r| r.defaults[:export] && r.requirements[:controller] == "video_clips" }
      download_route = exported_video.find { |r| r.requirements[:action] == "download" }

      # Simulate per-route override by creating a Route with export: { name: :route_name }.
      original_export = download_route.defaults[:export]
      begin
        download_route.defaults[:export] = {name: :route_name}

        presenter = JsFromRoutes::Route.new(download_route, mappings: {}, controller: "video_clips")
        expect(presenter.helper).to eq("downloadVideoClip")
      ensure
        download_route.defaults[:export] = original_export
      end
    end

    it "ignores per-route override when route has no name" do
      routes = Rails.application.routes.routes
      exported_video = routes.select { |r| r.defaults[:export] && r.requirements[:controller] == "video_clips" }
      destroy_route = exported_video.find { |r| r.requirements[:action] == "destroy" }

      # Unnamed route with per-route override falls back to action name.
      original_export = destroy_route.defaults[:export]
      begin
        destroy_route.defaults[:export] = {name: :route_name}

        presenter = JsFromRoutes::Route.new(destroy_route, mappings: {}, controller: "video_clips")
        expect(presenter.helper).to eq("destroy")
      ensure
        destroy_route.defaults[:export] = original_export
      end
    end
  end
end
