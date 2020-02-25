<template>
  <div class="eventInfoModal">
    <div class="modal-header">
      <h5 class="modal-title" id="modalTitle">{{event.title}}</h5>
      <button type="button" class="close" aria-label="Close" @click="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group pl-3">
        <label class="name">Start:</label>
        <div class="date">{{start}}</div>
      </div>
      <div class="form-group pl-3">
        <label class="name">End:</label>
        <div class="date border-bottom">{{end}}</div>
      </div>
      <div class="form-group pl-3">
        <label class="name">Owner:</label>
        <div class="owner border-bottom">
          <span v-show="!isOwner">{{event.owner.login}}</span>
          <span v-show="isOwner">You</span>
        </div>
      </div>
      <div class="form-group pl-3">
        <div class="name">Description:</div>
        <div class="description border-bottom">{{event.description}}</div>
      </div>
      <div class="form-group pl-3">
        <div class="name">Participants:</div>
        <div class="border">
          <template v-if="invitedFriends.length">
            <friend-item
              v-for="friend in invitedFriends"
              :key="friend.id"
              :friend="friend"
              :haveBtnRemove="false"
            />
          </template>
          <div v-else>nobody's invited.</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        v-show="isOwner"
        type="submit"
        class="btn btn-danger"
        @click="removeEvent(event.id)"
      >Remove event</button>
      <button
        type="submit"
        class="btn btn-primary"
        @click="close"
      >Ok</button>
    </div>
  </div>
</template>

<script>
import FriendItem from '../friends/friendItem';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

export default {
  components: {
    FriendItem,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    invitedFriends: [],
    start: null,
    end: null,
    isOwner: null,
  }),
  computed: {
    ...mapGetters({
      userId: 'auth/userId',
    }),
  },
  created() {
    this.invitedFriends = this.event.participants.filter(item => item.id !== this.userId);
    this.start = moment(this.event.fromDate).format("ddd, MMMM Do YYYY");
    this.end = moment(this.event.toDate).format("ddd, MMMM Do YYYY");
    this.isOwner = this.event.owner.id === this.userId;
  },
  methods: {
    ...mapActions('events', {
      deleteEvent: 'deleteEvent',
    }),
    close() {
      this.$emit('close');
    },
    removeEvent(id) {
      this.deleteEvent(id).then(() => { this.close(); });
    }
  },
}
</script>

<style scoped>
.name {
  font-weight: bold;
}
.owner {
  padding-right: 3.5rem;
}
</style>