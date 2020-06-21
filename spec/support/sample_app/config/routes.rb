Rails.application.routes.draw do
  root to: 'welcome#home'

  resources :welcome

  resources :video_clips, only: [:new, :edit, :create, :update, :destroy], export: true do
    get :download, on: :member, export: :path_only
    patch :add_to_playlist, on: :member
    patch :remove_from_playlist, on: :member
    get :trending, on: :collection

    resources :comments, only: [:show, :index], shallow: true, export: true

    get '/thumbnail/:thumbnail_id', as: :thumbnail, action: :thumbnail, on: :member
  end

  resources :user_preferences, only: [], export: true do
    patch :switch_to_classic_navbar, on: :collection
    get :switch_to_beta_navbar, on: :collection, export: false
    get '/switch_to_classic/:page', action: :switch_to_classic, on: :collection, export: :path_only
    get '/switch_to_beta/:page', action: :switch_to_beta, on: :collection, as: :switch_to_beta_page, export: :path_only
  end
end
