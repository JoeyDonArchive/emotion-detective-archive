<template>
  <accordion default="open">
    <template #header>
      Uploaded videos ({{ videosWaitingList.length }})</template
    >

    <template #headerRight> Upload video via SFTP(Alpha)</template>

    <template #body>
      <div v-if="videosWaitingList.length < 1" class="loading">
        <Loading></Loading>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Project</th>
            <th>Upload date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(video, index) in videosWaitingList" :key="video.id">
            <td>{{ index + 1 }}. {{ video.name }}</td>
            <td>
              <select
                v-model="video.project_id"
                @change="assignProject(video, $event)"
              >
                <option
                  v-for="option in projectsOptions"
                  :key="option.id"
                  :value="option.id"
                  :label="option.name"
                ></option>
              </select>
            </td>
            <td>
              {{
                $moment(new Date(parseInt(video.created_at, 10))).format(
                  'DD/MM/YYYY'
                )
              }}
            </td>
            <td>
              <template v-if="video.isVideoReady">
                <router-link
                  tag="button"
                  class="button -small"
                  :to="{
                    name: 'video',
                    params: { id: video.id },
                  }"
                  >Review Video</router-link
                >
              </template>
              <template v-else>
                <icon class="loader" name="loading-circle-2" />Processing video,
                please wait...
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </accordion>
</template>

<script>
import Accordion from '@/components/Accordion.vue'

export default {
  data() {
    return {
      videosWaitingList: [],
      projectsOptions: [],
    }
  },
  components: {
    accordion: Accordion,
    Loading: require('@/components/Loading').default,
  },
  async mounted() {
    // Fetch Videos
    let params = {
      limit: 10,
    }
    let videosResult = await this.$AppSync.query({
      query: this.$gql(this.$queries.listVideos),
      variables: params,
    })

    console.log(videosResult)

    this.videosWaitingList = videosResult.data.listVideos.items
    // Fetch Project Names
    let projectsResult = await this.$AppSync.query({
      query: this.$gql(this.$queries.listProjects),
      variables: params,
    })

    this.projectsOptions = projectsResult.data.listProjects.items

    // Subscription
    this.$AppSync
      .subscribe({
        query: this.$gql(this.$subscriptions.NewVideoSub),
      })
      .subscribe({
        next: data => {
          this.videosWaitingList.push(data.data.createdVideo)
          console.log(data)
        },
        error: error => {
          console.warn(error)
        },
      })

    // Subscription
    this.$AppSync
      .subscribe({
        query: this.$gql(this.$subscriptions.UpdateVideoSub),
      })
      .subscribe({
        next: data => {
          let updatedVideo = data.data.updatedVideo
          let index = this.videosWaitingList
            .map(video => {
              return video.id
            })
            .indexOf(updatedVideo.id)

          this.videosWaitingList.splice(index, 1, updatedVideo)
        },
        error: error => {
          console.warn(error)
        },
      })
  },
  methods: {
    async assignProject(video, event) {
      let selectedProject = this.projectsOptions[event.target.selectedIndex]
      let updateParam = {
        updateVideo: {
          id: video.id,
          project_id: selectedProject.id,
          project_name: selectedProject.name,
        },
      }

      let updateJobGQL = await this.$AppSync.mutate({
        mutation: this.$gql(this.$mutations.updateVideo),
        variables: updateParam,
      })

      console.log(updateJobGQL)
    },
  },
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;

  tr,
  td {
    text-align: left;
    height: 2.25rem;
  }
}

.loading {
  text-align: center;
}
</style>
