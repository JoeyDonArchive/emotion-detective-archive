<template>
  <div class="modal" :class="{ 'show-modal': isModalOpen }">
    <div class="modal-content">
      <span class="close-button" @click="onModalClose">&times;</span>
      <h2>
        Export Data -
        <i>{{ videosData.length }} videos selected</i>
      </h2>

      <p class="label">
        1. Select the data output for the videos you have selected
      </p>
      <table>
        <tr>
          <th>Selected videos</th>
          <th>Project</th>
          <th>
            Transcript
          </th>
          <th>
            Emotion analysis
          </th>
        </tr>
        <tr v-for="(video, index) in videosData" :key="index">
          <td>{{ index + 1 }} . {{ video.name }}</td>
          <td>{{ video.project_name }}</td>
          <td class="td-checkbox">
            <input
              class="checkbox"
              type="checkbox"
              @change="changeHandler($event, index, 'transcribe')"
            />
          </td>
          <td class="td-checkbox">
            <input
              class="checkbox"
              type="checkbox"
              @change="changeHandler($event, index, 'rekognition')"
            />
          </td>
        </tr>
      </table>

      <p class="label">2. Know when your files are ready.</p>
      <p class="caption">
        As this can sometimes take a while, we will let you know when your
        result output is ready via email.
      </p>
      <p class="caption">
        Processing time varies from 5 - 30 minutes. You can't check the job
        status simply because that will require a lot of my time to implement.
      </p>

      <template v-if="!isLaunched">
        <p class="label align-right mb2">
          Email Address
          <input
            type="text"
            class="email"
            placeholder="Joey.don@clemenger.com.au"
            v-model="email"
          />
        </p>

        <button
          class="button float-right"
          @click="launchExport"
          :class="email ? '' : 'disabled'"
        >
          Launch Export
        </button>
      </template>

      <template v-else>
        <h1>
          Good luck, you successfully launched a job. You will receive the
          result in 5 - 30 minutes!
        </h1>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isModalOpen', 'selectedProjectsids'],

  data() {
    return {
      videosData: [],
      selectedTasks: [],
      email: null,
      isLaunched: false,
    }
  },
  watch: {
    isModalOpen: function(val) {
      // if open
      if (val) {
        this.selectedProjectsids.forEach(id => {
          let params = {
            id: id,
          }
          this.loadVideos(params)
          console.log(params)
        })
        // let params = {
        //   id: this.selectedProjectsids[0]
        // };
      }
    },
  },
  methods: {
    onModalClose() {
      this.videosData = []
      this.$emit('closeClicked', false)
    },
    async loadVideos(params) {
      let result = await this.$AppSync.query({
        query: this.$gql(this.$queries.listVideosByProjectId),
        variables: params,
      })

      console.log(result)
      result.data.listVideosByProjectId.items.forEach(video => {
        this.videosData.push(video)
      })
    },
    changeHandler(event, index, type) {
      if (event.target.checked) {
        let newTask = {
          type: type,
          videoId: this.videosData[index].id,
          videoName: this.videosData[index].name,
        }
        this.selectedTasks.push(newTask)
      } else {
        let videoIndex = this.selectedTasks.findIndex(
          x => x.videoId == this.videosData[index].id
        )

        this.selectedTasks.splice(videoIndex, 1)
      }
    },
    launchExport() {
      let params = { tasks: [...this.selectedTasks], email: this.email }
      console.log(params)
      this.$axios
        .post(process.env.VUE_APP_AWS_APIGATEWAY_ENDPOINT, params)
        .then(response => {
          console.log(response)
          this.isLaunched = true
        })
        .catch(function(error) {
          console.log(error)
        })
      console.log(params)
    },
  },
}
</script>

<style lang="scss" scoped>
.mb1 {
  margin-bottom: 1rem !important;
}
.mb2 {
  margin-bottom: 2rem !important;
}
.align-right {
  text-align: right;
}

.float-right {
  float: right;
}
.email {
  width: 18rem;
  outline: 0;
  border-width: 0 0 1px;
  border-color: black;
  font-size: 1rem;
}
.email:focus {
  border-color: grey;
}
.disabled {
  cursor: not-allowed;
  pointer-events: none;

  /*Button disabled - CSS color class*/
  color: #c0c0c0;
  background-color: #ffffff;
}
table {
  width: 100%;
  border: 1px solid black;
  margin-bottom: 1rem;

  th {
    text-align: center;
    border: 1px solid black;
    padding: 0.5rem;
  }
  td {
    border-right: 1px solid black;
    text-align: left;
    padding: 0.5rem;
    &.td-checkbox {
      text-align: center;
    }
  }

  .checkbox {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}
.modal-content {
  text-transform: none;
  text-align: left;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1rem 1.5rem;
  width: 60rem;

  .label {
    font-size: 1.3rem;
    margin-bottom: 0.3rem;
  }

  .caption {
    font-size: 1rem;
    margin: 0;
  }
}

.close-button {
  float: right;
  width: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: lightgray;
}
.close-button:hover {
  background-color: darkgray;
}
.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
</style>
