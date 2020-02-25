import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/auth'
import notifications from './modules/notifications'
import friends from './modules/friends'
import events from './modules/events'
import chats from './modules/chats'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    notifications,
    friends,
    events,
    chats,
  }
});