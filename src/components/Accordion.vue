<template>
  <div class="accordion" :class="{ '-open': isAccordionOpen }">
    <div class="header" @click="toggleAccordion">
      <div class="left">
        <icon class="chevron" name="arrow-button-circle-down-1" />
        <slot name="header" />
      </div>
      <div class="right">
        <slot name="headerRight" />
      </div>
    </div>
    <div class="body">
      <slot name="body" />
    </div>
    <div class="footer">
      <div class="left">
        <slot name="footer" />
      </div>
      <div class="right">
        <slot name="footerRight" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['default'],
  data() {
    return {
      isAccordionOpen: false,
    }
  },
  watch: {
    default: {
      handler: function() {
        if (typeof this.default !== undefined) {
          this.isAccordionOpen = this.default === 'open'
        }
      },
      immediate: true,
    },
  },
  methods: {
    toggleAccordion() {
      this.isAccordionOpen = !this.isAccordionOpen
    },
  },
}
</script>

<style lang="scss" scoped>
.accordion {
  margin: 1rem 0;

  .header {
    background-color: gainsboro;
    cursor: pointer;
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    padding: 0 10px;
    height: 60px;
    text-transform: uppercase;
    font-weight: bold;

    .right {
      text-align: right;
      font-weight: normal;
      text-transform: initial;
    }
  }

  .body {
    max-height: 0;
    display: block;
    overflow: hidden;
  }

  .footer {
    cursor: pointer;
    display: none;
    align-items: center;
    grid-template-columns: auto auto;
    padding: 0 10px;
    height: auto;
    text-transform: uppercase;
    font-weight: bold;

    .right {
      text-align: right;
    }
  }

  .chevron {
    transform: rotate(-90deg);
    margin-right: 0.5rem;
  }

  &.-open {
    .body {
      max-height: none;
      padding: 1rem;
    }

    .chevron {
      transform: rotate(0deg);
    }

    .footer {
      display: grid;
    }
  }
}
</style>
