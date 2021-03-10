<script setup lang="ts">
import VideoClipsRequests from '~/requests/VideoClipsRequests'
import { ref, onMounted } from 'vue'

const title = 'Trending Videos'
const videos = ref([])

onMounted(() => {
  VideoClipsRequests.trending().then(newVideos => { videos.value = newVideos })
})
</script>

<template>
  <div class="w-max mx-auto">
    <h1 class="title text-3xl mt-8 mb-4 text-center">{{ title }}</h1>
    <ul class="ml-6 text-lg list-decimal">
      <li v-for="video in videos" class="my-1">{{ video.title }}</li>
    </ul>
  </div>
</template>
