<template>
  <svg
    :width="size"
    :height="size"
    :class="['app-icon', className]"
    :style="iconStyle"
    viewBox="0 0 256 256"
    fill="currentColor"
  >
    <slot />
  </svg>
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconStyle() {
      return {
        color: this.color
      }
    }
  }
}
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
