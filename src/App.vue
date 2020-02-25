<template>
  <div id="app">
    <router-view class="view"></router-view>
    <notification-list />
    <div v-show="loading">
      <preloader />
    </div>
  </div>
</template>

<script>
import {axios} from './api/api';
import { mapState, mapActions, mapGetters } from 'vuex'
import NotificationList from './components/notifications/notificationList'
import Preloader from './components/shared/preloader'

export default {
  name: 'app',
  components: {
    NotificationList,
    Preloader
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      hasToken: 'auth/hasToken',
      authStatus: 'auth/authStatus',
    }),
    loading() {
      return this.authStatus === 'loading';
    }
  },
  created: function () {
    if (this.hasToken) {
      this.getUser();
    }
    axios.interceptors.response.use(function (response) {
      if (response.data.err === 'You are not authorized: invalid token') {
        this.addNotification({title: 'Error from server', text: response.data.err, type:'danger'});
        this.logout();
      }
      return response;
    });
  },
  methods: {
    ...mapActions('auth', {
      logout: 'logout',
      getUser: 'getUser',
    }),
    ...mapActions('notifications', {
      addNotification: 'addNotification'
    }),
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
    .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .wrapp {
    min-height: calc(100vh - 60px);
    display: flex;
  }

  .col {
    padding-top: 15px;
  }

  .tab-button {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background-color: #e9ecef;
    margin-bottom: -1px;
    width: 50%;
  }

  .tab-button:hover {
    background: #e0e0e0;
  }

  .tab-button.active {
    background: #798a9b;
    border-color: #798a9b;
  }

  .tab {
    border: 1px solid #ccc;
    padding: 10px;
  }
}
</style>

<style>
#app {
  margin-top: 60px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

label {
  float: left;
}

h2 {
  background-color: #e9ecef;
}
</style>
