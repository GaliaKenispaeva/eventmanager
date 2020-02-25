<template>
  <div>
    <search-form>
      <input
        v-model="searchString"
        class="form-control form-control-sm"
        type="text"
        placeholder="Search..."
        aria-label="Search"
        @keyup="search"
      >
    </search-form>
    <div v-if="users.length" class="user-list">
      <friend-item
        v-for="user in users"
        :key="user.id"
        :friend="user"
        :haveBtnRemove="false"
        :haveBtnPlus="true"
        @add="sendFriendRequest(user.id)"
      />
    </div>
    <div v-else-if="searchString" class="pt-2">
      <preloader v-if="loading" />
      <span v-else>no search results</span>
    </div>
  </div>
</template>
<script>
import FriendItem from './friendItem'
import Preloader from '../shared/preloader'
import SearchForm from '../shared/searchForm'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Preloader,
    SearchForm,
    FriendItem,
  },
  data: () => ({
    searchString: '',
    users: [],
    loading: true,
  }),
  computed: {
    ...mapGetters({
      userId: 'auth/userId',
    }),
    ...mapState({
      friends: state => state.friends.friends,
    }),
    friendList() {
      return [this.userId, ...this.friends.map((friend) => { return friend.id; })]
    },
  },
  methods: {
    ...mapActions('friends', {
      searchUsers: 'searchUsers',
      sendFriendRequest: 'sendFriendRequest',
    }),
    search() {
      clearTimeout(this.timerId);
      this.loading = true;
      if (this.searchString !== '') {
        this.timerId = setTimeout(() => { this.searchUsers(this.searchString)
          .then((response) => { this.users = response.data.data.filter((user) => {
            return !this.friendList.includes(user.id);
          }) }).then(() => { this.loading = false; });
        }, 1200);
      } else this.users = [];
    },
  }
}
</script>

<style scoped>
.user-list {
  max-height: 80vh;
  overflow-y: auto;
}
</style>