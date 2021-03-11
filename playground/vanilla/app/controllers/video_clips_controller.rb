class VideoClipsController < ApplicationController
  def latest
    render json: [
      {title: "Smoke Signals", composer_name: "Dylan Ryche"},
      {title: "Camino Libre", composer_name: "Máximo Mussini"},
      {title: "Sin Querer", composer_name: "León Gieco"},
      {title: "Tabula Rasa", composer_name: "Calum Graham"},
      {title: "Raindance", composer_name: "Matteo Brenci"},
      {title: "Ragamuffin", composer_name: "Michael Hedges"},
      {title: "Vals Venezolano Nº 2", composer_name: "Antonio Lauro"},
      {title: "Xaranga do Vovô", composer_name: "Celso Machado"},
      {title: "Café 1930", composer_name: "Astor Piazzolla"},
      {title: "Milonga (Uruguay)", composer_name: "Jorge Cardoso"},
      {title: "Divagando", composer_name: "Domingos Semenzato"}
    ]
  end
end
