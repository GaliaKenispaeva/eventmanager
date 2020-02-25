<template>
  <div class="chats">
    <template v-if="chats.length">
      <chat-item
        v-for="chat in chats"
        :key="chat.id"
        :chat="chat"
        @openChat="openChat(chat)"
      />
    </template>
    <span v-else-if="!loading">You don't have chats yet</span>
    <preloader v-if="loading" />
  </div>
</template>

<script>
import Preloader from '../shared/preloader'
import ChatItem from './chatItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Preloader,
    ChatItem,
  },
  data: () => ({
  }),
  computed: {
    ...mapState({
      chats: state => state.chats.chats,
      status: state => state.chats.status,
    }),
    loading() {
      return this.status === 'loading';
    }
  },
  created() {
    this.getChats();
  },
  methods: {
    ...mapActions('chats', {
      getChats: 'getChats',
      createChat: 'createChat',
    }),
    openChat(chat) {
      this.createChat(chat.participants[0].id);
      this.$emit('setChat', chat);
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>