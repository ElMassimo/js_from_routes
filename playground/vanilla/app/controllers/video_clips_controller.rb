class VideoClipsController < ApplicationController
  def download
    render body: "", status: 204
  end

  def latest
    render json: [
      {id: 11, title: "Smoke Signals", composer_name: "Dylan Ryche"},
      {id: 10, title: "Camino Libre", composer_name: "Máximo Mussini"},
      {id: 9, title: "Sin Querer", composer_name: "León Gieco"},
      {id: 8, title: "Tabula Rasa", composer_name: "Calum Graham"},
      {id: 7, title: "Raindance", composer_name: "Matteo Brenci"},
      {id: 6, title: "Ragamuffin", composer_name: "Michael Hedges"},
      {id: 5, title: "Vals Venezolano Nº 2", composer_name: "Antonio Lauro"},
      {id: 4, title: "Xaranga do Vovô", composer_name: "Celso Machado"},
      {id: 3, title: "Café 1930", composer_name: "Astor Piazzolla"},
      {id: 2, title: "Milonga (Uruguay)", composer_name: "Jorge Cardoso"},
      {id: 1, title: "Divagando", composer_name: "Domingos Semenzato"}
    ]
  end
end
