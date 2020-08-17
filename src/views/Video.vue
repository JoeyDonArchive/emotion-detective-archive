<template>
  <div>
    <h3 class="align-center">{{ video.name }}</h3>
    <div class="flex-container">
      <div class="flex-item flex-video-container">
        <video ref="player" playsinline controls>
          <source :src="videoSrc" type="video/mp4" />
        </video>
      </div>

      <div class="flex-item flex-comments-container">
        <template v-if="!isAnnotationsEnabled" class="center">
          <h3>Tags/Sessions are Still loading</h3>
          <Loading></Loading>
        </template>
        <template v-else>
          <h4>Comments</h4>
          <div class="controller-container">
            <div>
              No comments yet
            </div>

            <br />
          </div>
        </template>
      </div>
    </div>

    <link rel="stylesheet" href="https://cdn.plyr.io/3.5.6/plyr.css" />
  </div>
</template>

<script>
import Plyr from 'plyr'
import PlyrAnnotate from '../services/playrAnnotate/index'

export default {
  components: {
    Loading: require('@/components/Loading').default,
  },
  data() {
    return {
      player: false,
      annotations: [],
      isAnnotationsEnabled: false,
      video: false, // The video object including id, projectId, name, annotations
    }
  },
  async mounted() {
    await this.getVideo()
    this.initPlyrAnnotate()
  },
  watch: {
    annotations: {},
  },
  computed: {
    videoSrc() {
      return `${process.env.VUE_APP_VIDEO_BUCKET}/${this.$route.params.id}.mp4`
    },
  },
  methods: {
    async getVideo() {
      let params = {
        id: this.$route.params.id,
      }

      let fetchResult = await this.$AppSync.query({
        query: this.$gql(this.$queries.getOneVideoById),
        variables: params,
      })

      this.video = fetchResult.data.getOneVideoById
      console.log(this.video)
    },
    setCurrentTime(annotationStart) {
      this.player.currentTime = annotationStart
    },
    formatSeconds(time) {
      let minutes = Math.floor(time / 60)
      let seconds = Math.floor(time - minutes * 60)

      return `${String(minutes).length < 2 ? '0' + minutes : minutes}:${
        String(seconds).length < 2 ? '0' + seconds : seconds
      }`
    },
    addTag() {
      this.player.annotate.add({
        start: this.player.currentTime,
        data: '#',
      })
    },
    addSection() {
      this.player.annotate.add({
        start: this.player.currentTime,
        end: this.player.currentTime + 30,
      })
    },
    activateAnnotation(id) {
      this.deactivateAnnotations()
      this.player.annotate.highlight(id)
    },
    deactivateAnnotations() {
      this.player.annotate.deemphasize()
    },
    deleteAnnotation(id) {
      this.player.annotate.delete(id)
    },
    initPlyrAnnotate() {
      const plyr = new Plyr(this.$refs.player, {
        hideControls: false,
      })
      this.player = new PlyrAnnotate(plyr)

      this.player.on('annotationschange', event => {
        let player = event.detail.plyr
        this.annotations = player.annotations
      })

      this.player.on('ready', event => {
        let player = event.detail.plyr
        player.play()

        setTimeout(() => {
          this.video.annotations && player.annotate.add(this.video.annotations)
          this.isAnnotationsEnabled = true
        }, 3500)
      })
    },
  },
}
</script>

<style lang="scss">
@import '../services/playrAnnotate/styles.scss';

.flex-container {
  display: flex;
}

.flex-item {
  border: 3px solid #333;
  width: 20%;
}

.flex-video-container {
  flex-grow: 1;
  min-height: 600px;
}

.flex-comments-container {
  padding: 1rem;
  min-height: 600px;
}

.blob {
  display: inline-block;
  width: 30px;
  height: 20px;
  margin-right: 0.5rem;
}

.annotation-container {
  margin-bottom: 0.5rem;
}

.timecode {
  width: 60px;
}

.align-center {
  text-align: center;
}
</style>
