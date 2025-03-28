describe JsFromRoutes::ControllerRoutes do
  # Array of controller paths to be tested
  let(:controllers) { %w[comments settings/user_preferences video_clips some/deeply/nested/controller] }
  # Array of expected filenames in kebab-case format for each controller
  let(:basenames_kebab) { %w[comments-api.js settings/user-preferences-api.js video-clips-api.js some/deeply/nested/controller-api.js] }
  # Array of expected filenames in CamelCase format for each controller
  let(:basenames_camel) { %w[CommentsApi.js Settings/UserPreferencesApi.js VideoClipsApi.js Some/Deeply/Nested/ControllerApi.js] }
  let(:routes) { [] }
  let(:config) { JsFromRoutes::Configuration.new(::Rails.root || Pathname.new(Dir.pwd)) }

  describe "#basename" do
    context "when filename_style is kebab" do
      it "returns the correct basename" do
        config.filename_style = :kebab

        controllers.each_with_index do |controller, index|
          controller_routes = described_class.new(controller, routes, config)
          expect(controller_routes.send(:basename)).to eq(basenames_kebab[index])
        end
      end
    end

    context "when filename_style is camel" do
      it "returns the correct basename" do
        config.filename_style = :camel

        controllers.each_with_index do |controller, index|
          controller_routes = described_class.new(controller, routes, config)
          expect(controller_routes.send(:basename)).to eq(basenames_camel[index])
        end
      end
    end

    context "when filename_style is default" do
      it "returns the correct basename" do
        controllers.each_with_index do |controller, index|
          controller_routes = described_class.new(controller, routes, config)
          expect(controller_routes.send(:basename)).to eq(basenames_camel[index])
        end
      end
    end
  end
end
