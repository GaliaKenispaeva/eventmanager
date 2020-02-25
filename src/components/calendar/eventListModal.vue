<template>
  <div class="eventInfoModal">
    <div class="modal-header">
      <h5 class="modal-title" id="modalTitle">Event list</h5>
      <button type="button" class="close" aria-label="Close" @click="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="list-group pl-3 mr-3">
        <button
          v-for="event in eventList"
          :key="event.id"
          type="button"
          class="list-group-item list-group-item-action"
          @click="onEventClick(event)"
        >{{event.title}}
        </button>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="submit"
        class="btn btn-primary"
        @click="close"
      >Ok</button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    eventList: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    onEventClick(event) {
      this.close();
      this.$emit('showEvent', event);
    },
  },
}
</script>

<style scoped>

</style>