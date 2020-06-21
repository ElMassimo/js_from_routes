<script>
import VideoClipsRequests from '@requests/VideoClipsRequests'

export default {
  name: 'App',
  data: function () {
    return {
      message: 'Hello!',
      videos: [],
      request: VideoClipsRequests.trending(),
    }
  }
}
</script>

<template>
  <div id="app">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
