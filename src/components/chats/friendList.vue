<template>
  <div class="friends">
    <template v-if="friends.length">
      <div
        v-for="friend in friends"
        :key="friend.id"
        class="card"
        @click="openChat(friend.id)"
      >
        {{friend.firstname}} {{friend.lastname}}
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  computed:{
    ...mapState({
      friends: state => state.friends.friends,
    }),
    ...mapGetters({
      chatsByParticipantId: 'chats/chatsByParticipantId',
    }),
  },
  methods: {
    ...mapActions('chats', {
      createChat: 'createChat',
    }),
    openChat(id) {
      this.createChat(id);
      const chat = this.chatsByParticipantId[id];
      this.$emit('setChat', chat);
    },
  }
}
</script>