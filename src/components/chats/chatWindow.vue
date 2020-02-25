<template>
  <div class="chatWindow">
    <div v-if="isEmpty">Open chat with any user</div>
    <div v-else class="chat">
      <div class="head">
        {{chat.participants[0].firstname}} {{chat.participants[0].lastname}}
        <button type="button" class="close" aria-label="Close" @click="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="content border mb-2">
        <div class="messages" v-if="chat.lastMessages.length">
          <message-item
            v-for="message in reversedMessages"
            :key="message.id"
            :message="message"
          />
        </div>
      </div>
      <form class="send-message" @submit.prevent="send">
        <textarea
          v-model="message"
          class="form-control mb-3"
          placeholder="Type your message"
          rows="3"
          @keypress.13.exact="send"
        />
        <button class="send-btn" type="submit">SEND</button>
      </form>
    </div>
  </div>
</template>

<script>
import MessageItem from './messageItem';
import { mapActions } from 'vuex';
import {sendMessage} from '../../api/socket';

export default {
  components: {
    MessageItem,
  },
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
  data:() => ({
    message: '',
  }),
  computed: {
    isEmpty() {
      return Object.keys(this.chat).length === 0;
    },
    reversedMessages() {
      const arr = [...this.chat.lastMessages];
      return arr.reverse();
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    send() {
      if (this.message) {
        sendMessage({message: this.message, chatId: this.chat.id});
        this.message = '';
      }
    },
  }
}
</script>

<style lang="scss" scoped>
$blue: #94C2ED;

.chatWindow {
  height: 100%;
}
.chat {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
.content {
  flex-grow: 1;
}

.send-btn {
  float: right;
  color: $blue;
  font-size: 16px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: #F2F5F8;

  &:hover {
    color: darken($blue, 7%);
  }
}
</style>