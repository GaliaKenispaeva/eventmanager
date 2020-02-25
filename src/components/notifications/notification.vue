<template>
  <div
    class="alert alert-dismissible"
    :class="`alert-${notificat.type}`"
    role="alert"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <p><strong>{{ notificat.title }}</strong></p>
    <p>{{ notificat.text }}</p>
    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
      @click="removeItem"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    notificat: {
      type: Object,
      required: true,
    },
  },
  data: ()=> ({
    timerId: 0,
  }),
  mounted: function () {
    this.startTimer();
  },
  methods: {
    removeItem: function() {
      this.$emit('remove');
    },
    startTimer() {
      this.timerId = setTimeout(() => {
        this.removeItem();
      }, 3000)
    },
    stopTimer() {
      clearTimeout(this.timerId);
    },
  },
}
</script>
<style scoped>
</style>