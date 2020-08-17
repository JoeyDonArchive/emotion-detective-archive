<template>
  <div class="modal" :class="{ 'show-modal': isModalOpen }">
    <div class="modal-content">
      <span class="close-button" @click="onModalClose">&times;</span>
      <span class="confirm-button" @click="confirm">Delete</span>
      <template v-if="editItem.editType === 'Delete'">
        <h2>
          Do you confirm to DELETE
          {{ `${editItem.itemType} ${editItem.itemParams.name}` }}
        </h2>
        <p class="caption">
          Your data will not be able to recovered!
        </p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isModalOpen', 'editItem'],

  data() {
    return {
      selectedTasks: [],
    }
  },
  watch: {
    isModalOpen: function(val) {
      // if open
      if (val) {
        console.log('inwatch ' + val)
      }
    },
  },
  computed: {},
  methods: {
    confirm() {
      console.log('confirm')
      this.deleteClient()
      this.onModalClose()
    },
    onModalClose() {
      this.$emit('closeClicked', false)
    },
    async deleteClient() {
      let deleteParam = {
        deleteClient: {
          id: this.editItem.itemParams.id,
        },
      }

      let deleteJobGQL = await this.$AppSync.mutate({
        mutation: this.$gql(this.$mutations.deleteClient),
        variables: deleteParam,
      })

      console.log(deleteJobGQL)
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
.mt2 {
  margin-top: 2rem !important;
}
.align-right {
  text-align: right;
}

.float-right {
  float: right;
}
.input-text {
  width: 18rem;
  outline: 0;
  border-width: 0 0 1px;
  border-color: black;
  font-size: 1rem;
  margin-left: 1rem;
}
.input-text:focus {
  border-color: grey;
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

.confirm-button {
  float: right;
  width: 4rem;
  margin-right: 1rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: rgba(255, 88, 88, 0.795);
  color: white;
}
.confirm-button:hover {
  background-color: rgb(255, 0, 0);
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;

  /*Button disabled - CSS color class*/
  color: #c0c0c0;
  background-color: #ffffff;
}

.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
</style>
