import Vue from 'vue'
import Videos from '../Videos'

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    render: h => h(Videos)
  }).$mount()
  document.body.appendChild(app.$el)
})
