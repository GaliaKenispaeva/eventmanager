<template>
  <div class="notifications">
    <transition-group name="fade">
      <notification
        v-for="notificat in notifications"
        :key="notificat.id"
        :notificat="notificat"
        @remove="removeNotification(notificat.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Notification from './notification'

export default {
  components: {
    Notification
  },
  data: ()=> ({
  }),
  computed: {
    ...mapState({
      notifications: state => state.notifications.notifications,
    })
  },
  methods: {
    ...mapActions('notifications',{
      removeNotification: 'removeNotification'
    }),
  }
}
</script>
<style scoped>
.notifications {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 350px;
  z-index: 2000;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: transform 0.5s;
}
</style>