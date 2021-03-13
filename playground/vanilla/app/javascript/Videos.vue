<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VideoClipsApi from '~/api/VideoClipsApi'
import { useApi } from '~/composables/api'

const videos = ref([])

onMounted(() => {
  VideoClipsApi.latest()
    .then((newVideos) => { videos.value = newVideos })
})

// NOTE: This is a contrived example, no need to use this if importing directly.
const api = useApi()
</script>

<template>
  <div class="w-max mx-auto text-gray-600">
    <h1 class="title text-3xl mt-8 mb-4 font-bold text-center text-gray-800">Latest Videos</h1>
    <ul class="pl-24 text-base list-decimal text-sm">
      <li v-for="video in videos" :key="video.title" class="my-1">
        <a class="text-lg text-cyan-600 hover:underline" :href="api.videoClips.download.path(video)" download title="Download">
          {{ video.title }}
        </a>
        <span class="text-sm"> by {{ video.composerName }}</span>
      </li>
    </ul>
  </div>
</template>
