import 'windi.css'

import { createApp } from 'vue'
import { Config } from '@js-from-routes/axios'
import Videos from '~/Videos.vue'

// Example: Combine all exported routes in a single object.
import api from '~/Routes'

createApp(Videos).mount('#app')

// Example: Expose it globally to the entire app (not recommended, prefer imports).
Object.assign(window, { api })

// Example: Configure the fetch strategy.
const previousFetch = Config.fetch
Config.fetch = (...args) => {
  console.log('fetch', ...args)
  return previousFetch(...args)
}

// Example: Use on how to configure the fetch strategy.
api.VideoClips.latest().then((videos: any) => { console.log({ videos }) })
