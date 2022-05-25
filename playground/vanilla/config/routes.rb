Rails.application.routes.draw do
  root to: "welcome#home"

  defaults export: true do
    get "/hi" => redirect("/welcome")
  end

  resources :welcome

  resources :video_clips, only: [:new, :edit, :create, :update, :destroy], export: true do
    get :download, on: :member
    patch :add_to_playlist, on: :member
    patch :remove_from_playlist, on: :member
    get :latest, on: :collection
    get "/thumbnail/:thumbnail_id", as: :thumbnail, action: :thumbnail, on: :member

    resources :comments, only: [:show, :index], shallow: true
  end

  resources :user_preferences, only: [], export: true do
    patch :switch_to_classic_navbar, on: :collection
    get :switch_to_beta_navbar, on: :collection, export: false
    get "/switch_to_classic/:page", action: :switch_to_classic, on: :collection
    get "/switch_to_beta/:page", action: :switch_to_beta, on: :collection, as: :switch_to_beta_page
  end
end
