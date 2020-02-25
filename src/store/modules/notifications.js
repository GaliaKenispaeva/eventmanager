export default {
  namespaced: true,
  state: {
    newId: 0,
    notifications: [],
  },
  actions: {
    addNotification({commit, state}, {title, text, type}) {
      commit('addNotification', {id: state.newId, title, text, type});
      commit('incrementId');
    },
    removeNotification({commit}, id) {
      commit('removeNotification', id);
    },
    addNotificationCatchError({commit, state}) {
      commit('addNotification', {id: state.newId,
        title: 'Unknown error', text: 'Oops! Something went wrong.', type:'danger'});
      commit('incrementId');
    }
  },
  getters: {
    notificationStatus: state => !!state.notifications,
  },
  mutations: {
    incrementId(state) {
      state.newId++;
    },
    addNotification(state, newNotification) {
      state.notifications.push(newNotification);
    },
    removeNotification(state, id) {
      state.notifications = state.notifications.filter(item => item.id !== id);
    }
  }
}