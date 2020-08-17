<template>
  <div class="container dashboard">
    <uploaded-videos />
    <clients-projects />
  </div>
</template>

<script>
import ClientsProjects from '@/partials/ClientsProjects.vue'
import UploadedVideos from '@/partials/UploadedVideos.vue'

export default {
  components: {
    'clients-projects': ClientsProjects,
    'uploaded-videos': UploadedVideos,
  },
}
</script>
