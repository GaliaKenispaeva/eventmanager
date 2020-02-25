<template>
  <div class="wrapp">
    <my-menu />
    <div class="container">
      <div v-show="loading" class="loader">
        <preloader />
      </div>
      <div class="col border">
        <friend-list />
      </div>
      <div class="col border">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-button', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >{{ tab }}</button>

        <keep-alive>
          <component
            :is="currentTabComponent"
            class="tab"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import FriendList from './friendList'
import SearchFriends from './searchFriends'
import IncomeRequests from './incomeRequestList'
import MyMenu from '../shared/myMenu'
import Preloader from '../shared/preloader'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    MyMenu,
    Preloader,
    FriendList,
    SearchFriends,
    IncomeRequests,
  },
  data: () => ({
    currentTab: 'IncomeRequests',
    tabs: ['IncomeRequests', 'SearchFriends'],
  }),
  computed: {
    ...mapState({
      statusSendRequest: state => state.friends.statusSendRequest,
    }),
    loading() {
      return this.statusSendRequest === 'loading';
    },
    currentTabComponent() {
      return this.currentTab;
    },
  },
  created() {
    this.getFriends();
  },
  methods: {
    ...mapActions('friends', {
      getFriends: 'getFriends',
    }),
  },
}
</script>

<style scoped>
.container {
  display: flex;
  align-self: stretch;
}
</style>