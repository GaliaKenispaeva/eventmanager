<template>
  <form class="addEventModal" @submit.prevent="submitEvent">
    <div class="modal-header">
      <h5 class="modal-title" id="modalTitle">Add event</h5>
      <button type="button" class="close" aria-label="Close" @click="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-6 pl-3">
          <label>Start:</label>
          <datepicker v-model="start" />
        </div>
        <div class="col-6 pl-3">
          <label>End:</label>
          <datepicker v-model="end" />
        </div>
        <div class="message">{{ validation.firstError('differenceBetweenDates') }}</div>
      </div>
      <div class="form-group">
        <label>Title:</label>
        <div class="message">{{ validation.firstError('title') }}</div>
        <input v-model="title" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>Description:</label>
        <div class="message">{{ validation.firstError('description') }}</div>
        <textarea v-model="description" class="form-control" />
      </div>
      <div class="form-group">
        <div class="row">
          <div class="col">
            <div>friends:</div>
            <div class="list border">
              <transition-group name="fade">
                <friend-item
                  v-for="id in uninvitedFriends"
                  :key="id"
                  :friend="friendsById[id]"
                  :haveBtnRemove="false"
                  :haveBtnPlus="true"
                  @add="inviteFriend(id)"
                />
              </transition-group>
            </div>
          </div>
          <div class="col">
            <div>invited friends:</div>
            <div class="list border">
              <transition-group name="fade">
                <friend-item
                  v-for="id in invitedFriends"
                  :key="id"
                  :friend="friendsById[id]"
                  @remove="uninviteFriend(id)"
                />
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="submit"
        class="btn btn-primary"
        @click="onSubmitClick"
      >Done</button>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker/dist/vuejs-datepicker.esm.js';
import FriendItem from '../friends/friendItem';
import { Validator } from 'simple-vue-validator'
const moment = require('moment');

export default {
  components: {
    Datepicker,
    FriendItem,
  },
  props: {
    day: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    start: null,
    end: null,
    title: '',
    description: '',
    invitedFriends: [],
    uninvitedFriends: [],
    submitted: false,
  }),
  computed: {
    ...mapState({
      userId: state => state.auth.user.id,
      friends: state => state.friends.friends,
    }),
    ...mapGetters({
      friendsById: 'friends/friendsById',
    }),
    fromDate() {
      if (!this.start) {
        return null;
      }
      return moment(this.start).startOf('day').format(); //utcOffset(0, true).
    },
    toDate() {
      if (!this.end) {
        return null;
      }
      return moment(this.end).endOf('day').format(); //utcOffset(0, true).
    },
    differenceBetweenDates() {
      if (this.toDate) {
        return moment(this.toDate).diff(this.fromDate);
      }
      return null;
    },
    isCorrect() {
      return this.differenceBetweenDates > 0 && this.title && this.description;
    }
  },
  created() {
    this.start = this.day.startOf('day').format();
    this.end = this.day.endOf('day').format();
    this.uninvitedFriends = this.friends.map((item) => { return item.id; });
  },
  methods: {
    ...mapActions('events', {
      setEvent: 'setEvent',
    }),
    close() {
      this.$emit('close');
    },
    inviteFriend(id) {
      this.invitedFriends.push(id);
      this.uninvitedFriends.splice(this.uninvitedFriends.indexOf(id), 1);
    },
    uninviteFriend(id) {
      this.uninvitedFriends.push(id);
      this.invitedFriends.splice(this.invitedFriends.indexOf(id), 1);
    },
    submitEvent() {
      if (!this.isCorrect) {
        return false;
      }

      this.setEvent({
        title: this.title, description: this.description,
        fromDate: this.fromDate,
        toDate: this.toDate,
        participants: this.invitedFriends.length ? this.invitedFriends : [this.userId]
      }).then(() => { this.close(); });
    },
    onSubmitClick: function () {
      this.submitted = true;
      this.$validate();
    },
  },
  validators: {
    title: function (value) {
      if (this.submitted || this.validation.isTouched('title')) {
        return Validator.value(value).required();
      }
    },
    description: function (value) {
      if (this.submitted || this.validation.isTouched('description')) {
        return Validator.value(value).required();
      }
    },
    differenceBetweenDates: function (value) {
      return Validator.value(value).greaterThan(0, 'Incorrect dates.');
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep input {
  display: block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  -webkit-transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
</style>
<style scoped>
.list {
  min-height: 150px;
  max-height: 150px;
  overflow-y: auto;
}

.message {
  text-align: right;
  margin-right: 11px;
  margin-left: 15px;
  color: red;
}

.modal-body {
  padding: 0 1rem;
}

.modal-header {
  padding: 0.7rem;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: transform 0.5s;
}

.row {
  min-height: 102px;
}
</style>