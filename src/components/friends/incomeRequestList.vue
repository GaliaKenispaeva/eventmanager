<template>
  <div class="incomeRequests">
    <preloader v-if="loading" />
    <template v-if="users.length">
      <friend-item
        v-for="user in users"
        :key="user.id"
        :friend="user"
        :haveBtnPlus="true"
        @add="sendFriendRequest(user.id)"
        @remove="deleteIncomeRequest(user.id)"
      />
    </template>
    <div v-else-if="!loading">
      no incoming friend requests
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import FriendItem from './friendItem'
import Preloader from '../shared/preloader'

export default {
  components: {
    Preloader,
    FriendItem
  },
  data: () => ({
    loading: true,
  }),
  computed: {
    ...mapState({
      users: state => state.friends.incomeRequests,
    })
  },
  created() {
    this.friendRequestIncome().then(() => { this.loading = false; })
  },
  methods: {
    ...mapActions('friends', {
      friendRequestIncome: 'friendRequestIncome',
      sendFriendRequest: 'sendFriendRequest',
      deleteFriend: 'deleteFriend',
    }),
    deleteIncomeRequest(id) {
      this.deleteFriend(id).then(() => { this.friendRequestIncome(); });
    },
  }
}
</script>