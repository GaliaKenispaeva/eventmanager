<template>
	<div class="calendar__day" @click.self="onDayClick">
		<div class="date" @click.self="onDayClick">{{day.date()}}</div>
    <template v-if="shownEvents.length">
      <div
        v-for="event in shownEvents"
        :key="event.id"
        class="shown-event"
        data-toggle="tooltip"
        :title="event.title"
        @click="onEventClick(event)"
      >{{event.title}}
      </div>
    </template>
    <div
      v-if="haveShowMore > 0"
      class="show-more"
      @click="onShowMoreClick"
    >+{{haveShowMore}} more</div>
	</div>
</template>

<script>
const countToDisplay = 2;

export default {
  props: {
    day: {
      type: Object,
      required: true,
    },
    eventList: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    shownEvents() {
      return this.eventList.slice(0, countToDisplay);
    },
    haveShowMore() {
      return this.eventList.length - countToDisplay;
    },
  },
  methods: {
    onDayClick: function() {
      this.$emit('addEvent');
    },
    onEventClick(event) {
      this.$emit('showEvent', event);
    },
    onShowMoreClick() {
      this.$emit('showEventList', this.eventList);
    },
  }
}
</script>

<style scoped>
.today .date {
  border-radius: 100%;
  background-color: rgba(127, 255, 212, 0.486);
}

.date {
	width: 2rem;
}

.show-more {
  font-size: small;
  cursor: pointer;
}

.shown-event {
  background-color: peachpuff;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  height: 23px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  padding-left: 12px;
  cursor: pointer;
}
</style>