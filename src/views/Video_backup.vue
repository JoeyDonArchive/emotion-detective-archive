<template>
  <div>
    Video ID: {{ $route.params.id }}

    <div class="flex-container video">
      <div class="flex-item video-container">
        <div class="video-player"></div>
        <div class="video-info">
          <span class="video-name">{{ video.name }}</span>
          <icon name="pencil" />
          <icon name="bin-paper-2" />
          <h3>
            {{
              $moment(new Date(parseInt(video.created_at, 10))).format(
                'DD/MM/YYYY'
              )
            }}
          </h3>
        </div>
      </div>
      <div class="flex-item comments-container">Comments</div>
    </div>
  </div>
</template>

<script>
import Plyr from 'plyr'
import PlyrAnnotate from '../services/PlayrAnnotate'

export default {
  data() {
    return {
      video: false,

      player: false,
      annotations: [],
      isAnnotationsEnabled: false,
    }
  },
  async mounted() {
    let params = {
      id: this.$route.params.id,
    }

    let fetchResult = await this.$AppSync.query({
      query: this.$gql(this.$queries.getOneVideoById),
      variables: params,
    })

    this.video = fetchResult.data.getOneVideoById
    console.log(this.video)

    this.initPlyrAnnotate()
  },
  methods: {
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

        player.embed.on('loaded', event => {
          console.log(event)
          player.annotate.add([
            {
              start: 43,
              end: 122,
              data: 'glut',
            },
            {
              start: 100,
              end: 255,
              data: 'glut 2',
            },
            {
              start: 315,
              data: 'glut 3',
            },
          ])
          this.isAnnotationsEnabled = true

          // setTimeout(() => {
          //     this.player.destroy()
          // }, 5000)
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}

h3 {
  margin: 5px 0;
}

.icon {
  height: 20px;
  margin-left: 15px;
}

.flex-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.flex-item {
  width: 500px;
}

.video-container {
  min-height: 600px;
}

.comments-container {
  border: 3px solid #333;

  min-height: 600px;
}
.video-player {
  height: 500px;
}

.video-name {
  font-size: 2rem;
}
</style>
