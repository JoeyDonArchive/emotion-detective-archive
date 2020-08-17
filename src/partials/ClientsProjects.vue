<template>
  <accordion default="open" ref="projects">
    <template #header
      >Clients ({{ clientsList.length }})
    </template>

    <template #headerRight>
      <button class="button" @click.stop="addClient">
        <icon name="add-bold" />Add client
      </button>
    </template>

    <template #body>
      <div v-if="clientsList.length < 1" class="loading">
        <Loading></Loading>
      </div>
      <div class="projects">
        <div v-for="clientProjects in clientsList" :key="clientProjects.name">
          {{ clientProjects.name }}
          <icon name="pencil" />
          <button
            class="button -transparent ml1"
            @click="deleteClient(clientProjects)"
          >
            <icon name="delete" class="delete-icon" />
          </button>
          <div class="folders">
            <div
              class="folder project"
              v-for="project in clientProjects.projects"
              :key="project.id"
              :data-id="project.id"
            >
              <div>
                <icon class="folder-icon" name="folder-1" />
                {{ project.name }}
              </div>
            </div>

            <div class="folder -add" @click="addProject(clientProjects)">
              <div>+</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footerRight>
      <div class="button-group">
        <button
          class="button"
          :disabled="selectedProjectsids.length < 1"
          @click.prevent.stop="exportSelectedProjects"
        >
          Export selected ({{ selectedProjectsids.length }})
        </button>
        <button class="button" @click.prevent.stop="exportAllProjects" disabled>
          Export all projects
        </button>
      </div>

      <exportModal
        :isModalOpen="exportModalOpen"
        :selectedProjectsids="selectedProjectsids"
        @closeClicked="onModalClose"
      />
      <newItemModal
        :isModalOpen="newItemModalOpen"
        :newItem="newItem"
        @closeClicked="onModalClose"
      />
      <editItemModal
        :isModalOpen="editItemModalOpen"
        :editItem="editItem"
        @closeClicked="onModalClose"
      />
    </template>
  </accordion>
</template>

<script>
import Accordion from '@/components/Accordion.vue'
import ExportModal from '@/components/ExportModal.vue'
import NewItemModal from '@/components/NewItemModal.vue'
import EditItemModal from '@/components/EditItemModal.vue'
import DragSelect from 'dragselect'

export default {
  components: {
    Loading: require('@/components/Loading').default,
    accordion: Accordion,
    exportModal: ExportModal,
    newItemModal: NewItemModal,
    editItemModal: EditItemModal,
  },
  data() {
    return {
      clientsList: [],
      dragSelect: false,
      selectedProjectsids: [],
      exportModalOpen: false,
      newItemModalOpen: false,
      editItemModalOpen: false,
      newItem: {
        itemType: '', // Enum ['Project','Client']
        itemParams: null, // The object of current item
      },
      editItem: {
        itemType: '', // Enum ['Project','Client']
        itemParams: null,
        editType: '', // Enum ['Delete','Edit']
      },
    }
  },
  async mounted() {
    await this.initClients()
    // Subscription
    await this.initSubscription()

    this.$nextTick(() => {
      if (!this.dragSelect) {
        this.dragSelect = new DragSelect({
          selectables: this.$refs.projects.$el.getElementsByClassName(
            'project'
          ),
          area: this.$refs.projects.$el.getElementsByClassName('projects')[0],
          onElementSelect: element => {
            console.log('you clicked on')
            console.log(element)
            element.classList.add('-selected')

            if (!this.selectedProjectsids.includes(element.dataset.id))
              this.selectedProjectsids.push(element.dataset.id)
          },
          onElementUnselect: element => {
            element.classList.remove('-selected')

            let index = this.selectedProjectsids.findIndex(
              el => el === element.dataset.id
            )
            if (index > -1) this.selectedProjectsids.splice(index, 1)
          },
        })
      }
    })
  },
  beforeDestroy() {
    this.dragSelect.stop()
  },
  methods: {
    async initClients() {
      let params = {
        limit: 10,
      }

      let {
        data: {
          listClients: { items: clientsArray },
        },
      } = await this.$AppSync.query({
        query: this.$gql(this.$queries.listClients),
        variables: params,
      })
      this.clientsList = clientsArray
    },

    async initSubscription() {
      this.$AppSync
        .subscribe({
          query: this.$gql(this.$subscriptions.NewClientSub),
        })
        .subscribe({
          next: data => {
            console.log('Subscription: New client created')
            // TODO: not creating the array for projects. Maybe a bug in future.
            this.clientsList.push(data.data.createdClient)
          },
          error: error => {
            console.warn(error)
          },
        })

      this.$AppSync
        .subscribe({
          query: this.$gql(this.$subscriptions.DeleteClientSub),
        })
        .subscribe({
          next: data => {
            console.log('Subscription: A client deleted')
            // TODO: Delete projects as well
            this.clientsList = this.clientsList.filter(client => {
              return client.id != data.data.deletedClient.id
            })
          },
          error: error => {
            console.warn(error)
          },
        })

      this.$AppSync
        .subscribe({
          query: this.$gql(this.$subscriptions.NewProjectSub),
        })
        .subscribe({
          next: data => {
            console.log('Subscription: A project created')
            // TODO: Delete projects as well
            console.log(data)
            let createdProject = data.data.createdProject

            this.clientsList.forEach(client => {
              if (client.id === createdProject.client_id) {
                delete createdProject.client_id
                client.projects.push(createdProject)
              }
            })
          },
          error: error => {
            console.warn(error)
          },
        })
    },

    onModalClose() {
      // Receive from child Component Modal.vue
      this.exportModalOpen = false
      this.newItemModalOpen = false
      this.editItemModalOpen = false
    },
    addClient() {
      this.newItem.itemType = 'Client'
      this.newItemModalOpen = !this.newItemModalOpen
      console.log(`Add new client.`)
    },
    addProject(currentClient) {
      this.newItem.itemType = 'Project'
      this.newItem.itemParams = currentClient
      this.newItemModalOpen = !this.newItemModalOpen
      console.log(`Add new project.`)
    },
    deleteClient(currentClient) {
      this.editItem.editType = 'Delete'
      this.editItem.itemType = 'Client'
      this.editItem.itemParams = currentClient
      this.editItemModalOpen = !this.editItemModalOpen
    },
    exportAllProjects() {
      let ids = []
      this.clientsList.forEach(client => {
        client.projects.forEach(project => {
          ids.push(project.id)
        })
      })

      console.log(`Export project ids: ${ids.join(', ')}`)
    },
    exportSelectedProjects() {
      this.exportModalOpen = !this.exportModalOpen
      console.log(`Export project ids: ${this.selectedProjectsids.join(', ')}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.projects {
  user-select: none;
}

.header-cta {
  float: right;
}

.folders {
  margin: 1rem 0.5rem;

  .folder {
    border: 2px solid #000;
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: inline-grid;
    grid-template-columns: auto;
    justify-items: center;
    align-items: center;
    margin: 0 0.5rem;

    &:first-of-type {
      margin-left: 0;
    }

    &:last-of-type {
      margin-right: 0;
    }

    &.-add {
      border-style: dashed;
    }

    &.-selected {
      background-color: aquamarine;
    }

    .folder-icon {
      margin-right: 0.15rem;
    }
  }
}

.loading {
  text-align: center;
}
</style>
