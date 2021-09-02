require "rails_helper"

RSpec.describe VideoClipsController, type: :controller do
  describe "GET /" do
    it "should make a request" do
      get :new
      expect(response).to render_template(:new)
    end
  end
end
