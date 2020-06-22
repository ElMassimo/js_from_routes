<script>
import VideoClipsRequests from '@requests/VideoClipsRequests'

export default {
  name: 'videos',
  data: function () {
    return {
      title: 'Trending Videos',
      videos: [],
      request: VideoClipsRequests.trending().then(videos => { this.videos = videos }),
    }
  },
}
</script>

<template>
  <div id="app">
    <p>{{ title }}</p>
    <ul>
      <li v-for="video in videos">{{ video.title }}</li>
    </ul>
  </div>
</template>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
