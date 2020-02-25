<template>
  <div class="wrapp">
    <my-menu />
    <div class="container">
      <div class="col-4 border">
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
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-button', { active: currentTab === tab }]"
          @click="onClickTab(tab)"
        >{{ tab }}</button>

        <div v-if="users.length" class="user-list">
          <friend-item
            v-for="user in users"
            :key="user.id"
            :friend="user"
            :haveBtnRemove="false"
          />
        </div>
        <div v-else-if="searchString" class="pt-2">
          <preloader v-if="loading" />
          <span v-else>no search results</span>
        </div>
        <keep-alive>
          <component
            :is="currentTabComponent"
            class="tab"
            @setChat="setChat"
          />
        </keep-alive>
      </div>
      <div class="col-8 border">
        <chat-window
          :chat="currentChat"
          @close="closeChatWindow"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyMenu from '../shared/myMenu'
import Preloader from '../shared/preloader'
import SearchForm from '../shared/searchForm'
import FriendItem from '../friends/friendItem'
import ChatWindow from './chatWindow'
import ChatList from './chatList'
import FriendList from './friendList'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  components: {
    MyMenu,
    Preloader,
    SearchForm,
    FriendItem,
    ChatWindow,
    ChatList,
    FriendList,
  },
  data: () => ({
    loading: true,
    currentTab: 'ChatList',
    tabs: ['ChatList', 'FriendList'],
    searchString: '',
    users: [],
    currentChat: {},
  }),
  computed: {
    ...mapState({
      friends: state => state.friends.friends,
      chats: state => state.chats.chats,
    }),
    ...mapGetters({
      chatsByParticipantId: 'chats/chatsByParticipantId',
    }),
    friendIdList() {
      return [...this.friends.map((friend) => { return friend.id; })]
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
      searchUsers: 'searchUsers',
      getFriends: 'getFriends',

    }),
    ...mapActions('chats', {
      createChat: 'createChat',
    }),
    search() {
      clearTimeout(this.timerId);
      this.loading = true;
      if (this.searchString !== '') {
        if (this.currentTabComponent === 'FriendList') {
          this.timerId = setTimeout(() => { this.searchUsers(this.searchString)
            .then((response) => { this.users = response.data.data.filter((user) => {
              return this.friendIdList.includes(user.id);
            }) }).then(() => { this.loading = false; });
          }, 1200);
        } else {
          this.timerId = setTimeout(() => { this.searchUsers(this.searchString)
            .then((response) => { this.users = response.data.data.filter((user) => {
              return user.id in this.chatsByParticipantId;
            }) }).then(() => { this.loading = false; });
          }, 1200);
        }
      } else this.users = [];
    },
    onClickTab(tab) {
      this.currentTab = tab;
      this.users = [];
      this.search();
    },
    openChat(friendId) {
      this.createChat(friendId);
    },
    setChat(chat) {
      this.currentChat = chat;
    },
    closeChatWindow() {
      this.currentChat = {};
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  display: flex;
  align-self: stretch;
}
::v-deep {
  .card {
    padding-bottom: 1rem;
    border: 0;
    text-align: left;
  }

  .card:hover {
    background: #f2f6fa;
  }
}
</style>