<template>
  <div class="calendar container">
    <div v-show="loading" class="loader">
      <preloader />
    </div>
    <div class="calendar__header">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group">
          <button type="button" class="btn btn-secondary" @click="previousMonth">
            <img src="../../assets/triangle-left.svg">
          </button>
          <button type="button" class="btn btn-secondary" @click="nextMonth">
            <img src="../../assets/triangle-right.svg">
          </button>
        </div>
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-secondary" @click="returnToToday">today</button>
        </div>
      </div>
      <div class="calendar__month">
        <h2>{{monthStr}} {{year}}</h2>
      </div>
      <div class="input-year">
        <input :value="year" type="number" min="1970" @input="onChangeYear">
        <span class="validity" />
      </div>
    </div>
    <div class="calendar__main">
      <div class="calendar__head">
        <div v-for="(day, index) in weekdays" :key="index" class="calendar__weekday">{{day}}</div>
      </div>
      <div class="calendar__body">
        <calendar-day
          v-for="(day, index) in days"
          :key="index"
          :day="day"
          :event-list="eventsByDate[day.format('YYYY-MM-DD')]"
          :class="{
            'other-month': day.month()!== month,
            today: day.isSame(today, 'day'),
          }"
          @addEvent="addEvent(day)"
          @showEvent="showEvent"
          @showEventList="showEventList"
        />
      </div>
    </div>
    <modal-window
      :show="showAddEventModal"
      @close="closeModal"
    >
      <add-event-modal
        :day="clickedDay"
        @close="closeModal"
      />
    </modal-window>
    <modal-window
      :show="showEventInfoModal"
      @close="closeModal"
    >
      <event-info-modal
        :event="clickedEvent"
        @close="closeModal"
      />
    </modal-window>
    <modal-window
      :show="showEventListModal"
      @close="closeModal"
    >
      <event-list-modal
        :eventList="clickedEventList"
        @close="closeModal"
        @showEvent="showEvent"
      />
    </modal-window>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import {getRangeByDates} from '../../utils/dates';
import CalendarDay from './calendarDay';
import AddEventModal from './addEventModal';
import EventInfoModal from './eventInfoModal';
import EventListModal from './eventListModal';
import ModalWindow from './modalWindow';
import Preloader from '../shared/preloader';
import moment from 'moment';

export default {
  components: {
    CalendarDay,
    AddEventModal,
    EventInfoModal,
    EventListModal,
    ModalWindow,
    Preloader,
  },
  data: () => ({
    loading: true,
    month: moment().month(),
    year: moment().format('YYYY'),
    weekdays: moment.weekdaysShort(),
    showAddEventModal: false,
    showEventInfoModal: false,
    showEventListModal: false,
    clickedDay: moment(),
    clickedEvent: null,
    clickedEventList: null,
  }),
  computed: {
    ...mapState({
      events: state => state.events.events,
    }),
    ...mapGetters({
      eventsByDate: 'events/eventsByDate',
    }),
    today() { return moment(); },
    start() { return moment([this.year, this.month, 1]).startOf('month').startOf('week'); },
    end() { return moment([this.year, this.month, 1]).endOf('month').endOf('week'); },
    monthStr() { return moment().month(this.month).format('MMMM'); },
    days() { return getRangeByDates(this.start, this.end); },
  },
  watch: {
    days() {
      this.loading = true;
      this.getEvents({from: this.start.format(), to: this.end.format()})
        .then(() => this.loading = false);
    },
  },
  created() {
    this.getFriends();
    this.getEvents({from: this.start.format(), to: this.end.format()})
      .then(() => this.loading = false);
  },
  methods: {
    ...mapActions('friends', {
      getFriends: 'getFriends',
    }),
    ...mapActions('events', {
      getEvents: 'getEvents',
    }),
    onChangeYear(e) {
      if (e.target.value >= 1970) {
        this.year = e.target.value;
      }
    },
    returnToToday() {
      this.month = moment().month();
      this.year = moment().format('YYYY');
    },
    previousMonth() {
      this.month = (this.month + 11) % 12;
      if (this.month === 11) {
        this.year--;
      }
    },
    nextMonth() {
      this.month = (this.month + 1) % 12;
      if (this.month === 0) {
        this.year++;
      }
    },
    closeModal() {
      this.showAddEventModal = false;
      this.showEventInfoModal = false;
      this.showEventListModal = false;
    },
    addEvent(day) {
      this.clickedDay = day;
      this.showAddEventModal = true;
    },
    showEvent(event) {
      this.clickedEvent = event;
      this.showEventInfoModal = true;
    },
    showEventList(eventList) {
      this.clickedEventList = eventList;
      this.showEventListModal = true;
    },
  },
}
</script>

<style scoped>
.calendar__header,
.calendar__head,
.calendar__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row wrap;
}

.calendar__main {
  width: 100%;
}

.calendar__day,
.calendar__weekday {
  width: calc(100%/7);
  padding: 5px; /* Поля вокруг текста */
  border: 1px solid #ddd; /* Рамка вокруг ячеек */
}

.calendar__day {
  height: 6rem;
  cursor: pointer;
}

.other-month {
  color: rgba(108, 117, 125, 0.3);
}

.calendar__day > div {
  width: 2rem;
}

input:invalid+span:after {
  content: '✖';
  padding-left: 5px;
}

input:valid+span:after {
  content: '✓';
  padding-left: 5px;
}
</style>