import 'windi.css'

import { createApp } from 'vue'
import { Config, request } from '@js-from-routes/client'
import Videos from '~/Videos.vue'

// Example: Combine all exported routes in a single object.
import api from '~/ApiHelpers'

// Example: Expose it globally to the entire app (not recommended, prefer injection).
Object.assign(window, { api, request })

const app = createApp(Videos)
app.mount('#app')

// Example: Configure the fetch strategy.
const previousFetch = Config.fetch
Config.fetch = (...args) => {
  console.log('fetch', ...args)
  return previousFetch(...args)
}

// Example: Using the path helper, both path interpolation and request.
console.log({ path: api.videoClips.thumbnail.path({ id: 5, thumbnailId: 8 }) })
api.videoClips.latest().then((videos: any) => { console.log({ videos }) })
