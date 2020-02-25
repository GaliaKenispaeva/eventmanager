<template>
  <div class="card" @click="onClick(chat.participants[0].id)">
    <h5 class="card-title">
      {{chat.participants[0].firstname}} {{chat.participants[0].lastname}}
    </h5>
    <p class="card-text">
      <span v-if="!chat.lastMessages.length" class="have-not-message">you haven't chatted yet</span>
      <span v-else>
        <span v-if="isYourMessage">You: </span>
        {{chat.lastMessages[0].message}}
      </span>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
  computed:{
    ...mapGetters({
      userId: 'auth/userId',
    }),
    isYourMessage() {
      return this.chat.lastMessages[0].from.id === this.userId;
    },
  },
  methods: {
    onClick(id) {
      this.$emit('openChat', id);
    }
  }
}
</script>

<style lang="scss" scoped>
.card-title {
	margin: 0;
	color: black;
}

.card-text {
	color:#698192;
	font-size: 0.85rem;
}

.card-title,
.card-text {
	text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.have-not-message {
  color: #789269;
}
</style>