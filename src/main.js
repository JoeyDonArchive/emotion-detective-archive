import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import mixin from '@/globalMixin.js'
import '@/registerServiceWorker'
import moment from 'moment'
import axios from 'axios'
import AppSync from '@/services/initAppSyncClient.js'
import gql from 'graphql-tag'
import queries from '@/services/graphql/queries.js'
import mutations from '@/services/graphql/mutations.js'
import subscriptions from '@/services/graphql/subscriptions.js'

// Add some global libraries
Vue.prototype.$moment = moment
Vue.prototype.$axios = axios

// Add GraphQL related
Vue.prototype.$gql = gql
Vue.prototype.$AppSync = AppSync
Vue.prototype.$queries = queries
Vue.prototype.$mutations = mutations
Vue.prototype.$subscriptions = subscriptions

// vue settings
Vue.config.productionTip = false

// Global mixin
Vue.mixin(mixin)

// new vue instance
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
