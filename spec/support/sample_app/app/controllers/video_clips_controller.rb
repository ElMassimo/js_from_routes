class VideoClipsController < ApplicationController
  def trending
    render json: [
      {title: "Smoke Signals"},
      {title: "Camino Libre"},
      {title: "Sin Querer"},
      {title: "Tabula Rasa"},
      {title: "Raindance"},
      {title: "Ragamuffin"},
      {title: "Vals Venezolano Nº 2"},
      {title: "Xaranga do Vovô"},
      {title: "Café 1930"},
      {title: "Milonga (Uruguay)"},
      {title: "Divagando"}
    ]
  end
end
