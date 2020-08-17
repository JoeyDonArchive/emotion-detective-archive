<template>
  <div class="icon">
    <img class="img" :src="`${publicPath}icons/${name}.png`" :alt="name" />
  </div>
</template>

<script>
export default {
  props: ['name'],
  data() {
    return {
      publicPath: process.env.BASE_URL,
    }
  },
}
</script>

<style lang="scss" scoped>
.icon {
  height: 16px;
  display: inline-block;
  position: relative;

  .img {
    margin-top: -3px;
    position: relative;
    height: 100%;
  }
}
</style>
