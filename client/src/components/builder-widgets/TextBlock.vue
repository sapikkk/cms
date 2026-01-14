<template>
  <section class="text-block" :class="`align-${alignment}`">
    <div class="text-content" v-html="content"></div>
  </section>
</template>

<script>
export default {
  name: 'TextBlock',
  props: {
    content: {
      type: String,
      default: '<p>Your content here...</p>'
    },
    alignment: {
      type: String,
      default: 'left', // 'left', 'center', 'right'
      validator: (value) => ['left', 'center', 'right'].includes(value)
    }
  }
}
</script>

<style scoped>
.text-block {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

.text-content {
  font-size: 16px;
  line-height: 1.7;
  color: #374151;
}

.text-content :deep(h1),
.text-content :deep(h2),
.text-content :deep(h3),
.text-content :deep(h4) {
  color: #111827;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.text-content :deep(h1) {
  font-size: 2.25em;
}

.text-content :deep(h2) {
  font-size: 1.875em;
}

.text-content :deep(h3) {
  font-size: 1.5em;
}

.text-content :deep(p) {
  margin-bottom: 1em;
}

.text-content :deep(a) {
  color: #8B4513;
  text-decoration: underline;
}

.text-content :deep(a:hover) {
  color: #A0522D;
}

.text-content :deep(ul),
.text-content :deep(ol) {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.text-content :deep(blockquote) {
  border-left: 4px solid #8B4513;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: #6b7280;
}

.text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
}
</style>
