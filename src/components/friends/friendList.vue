<template>
  <div class="friends">
    <h2>My Friends</h2>
    <template v-if="friends.length">
      <friend-item
        v-for="friend in friends"
        :key="friend.id"
        :friend="friend"
        :haveChat="true"
        @remove="confirmBeforeDelete(friend.id, `${friend.firstname} ${friend.lastname}`)"
      />
    </template>
    <span v-else-if="!loading">You don't have friends yet</span>
    <preloader v-if="loading" />
  </div>
</template>

<script>
import Preloader from '../shared/preloader'
import FriendItem from './friendItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Preloader,
    FriendItem
  },
  data: () => ({
  }),
  computed: {
    ...mapState({
      friends: state => state.friends.friends,
      status: state => state.friends.status,
    }),
    loading() {
      return this.status === 'loading';
    }
  },
  methods: {
    ...mapActions('friends', {
      deleteFriend: 'deleteFriend',
    }),
    confirmBeforeDelete(id, name) {
      if (confirm(`Are you sure you want to remove ${name} as your friend?`)) {
        this.deleteFriend(id);
      }
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>