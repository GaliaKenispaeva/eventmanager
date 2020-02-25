<template>
  <transition name="fade">
    <div class="wrap" @click.self="close" v-if="show">
      <div class="mask">
        <div class="modal-content">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type:Boolean,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.wrap {
	z-index: 1050;
	position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
	background-color: rgba(0, 0, 0, 0.52);
}

.mask {
	position: relative;
  width: auto;
  pointer-events: none;
	max-width: 500px;
  margin: 1.75rem auto;
}
</style>