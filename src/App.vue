<template>
  <div id="app">
    <navigation-bar />
    <router-view />
  </div>
</template>

<script>
import NavigationBar from '@/partials/NavigationBar.vue'

export default {
  components: {
    'navigation-bar': NavigationBar,
  },
}
</script>

<style lang="scss">
@include pickle-once;

html,
body {
  padding: 0;
  margin: 0;
}

body {
  background-color: #f7f4ed;
}

.button-group {
  .button {
    margin: 0 0.25rem;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}

.button {
  border-radius: 0.3rem;
  padding: 0.5rem 2rem;
  border: 2px solid #000;
  background-color: transparent;
  border-bottom: 4px solid #000;
  font-weight: bold;
  color: #000;

  &.-small {
    padding: 0.25rem 1rem;
    font-size: 0.95em;
  }

  &.-transparent {
    padding: 0rem;
    border: 0px solid #000;
  }

  &:disabled {
    border: 2px solid grey;
    border-bottom: 4px solid grey;
    color: grey;
  }
}

.container {
  margin: auto;
  max-width: 990px;
  width: 90%;
}

.ml1 {
  margin-left: 0.3rem;
}
</style>
