import {axios} from '../../api/api';

export default {
  namespaced: true,
  state: {
    status: '',
    statusSendRequest: '',
    friends: [],
    incomeRequests: [],
  },
  getters: {
    friendsById: state => {
      const obj = {};
      state.friends.forEach((item) => {
        obj[item.id] = item;
      });
      return obj;
    },
  },
  mutations: {
    setStatusSendRequest(state, payload) {
      state.statusSendRequest = payload;
    },
    setStatus(state, payload) {
      state.status = payload;
    },
    setFriends(state, data) {
      state.friends = data;
    },
    addFriend(state, {friend, index}) {
      state.friends.push(friend);
      state.incomeRequests.splice(index, 1);
    },
    deleteFriend(state, friendId) {
      state.friends = state.friends.filter(item => item.id !== friendId);
    },
    setIncomeRequests(state, data) {
      state.incomeRequests = data.map(function(obj) {
        return obj['friender'];
      });
    }
  },
  actions: {
    getFriends({commit, dispatch}) {
      commit('setStatus', 'loading');
      return axios.get('/friends').then(response => {
        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('setFriends', response.data.data);
          commit('setStatus', 'success');
        }
      })
        .catch(error => {
          commit('setStatus', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    friendRequestIncome({commit, dispatch}) {
      return axios.get('/friends/requests/income').then(response => {
        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('setIncomeRequests', response.data.data);
        }
      })
        .catch(error => {
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    searchUsers({commit, dispatch}, searchString) {
      return new Promise((resolve) => {
        axios.get('/users/search', {
          params: {
            q: searchString
          }
        }).then(response => {
          if (!response.data.success) {
            const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
            dispatch('notifications/addNotification', paramsErr, { root: true });
          } else {
            resolve(response);
          }
        })
          .catch(error => {
            dispatch('notifications/addNotificationCatchError', null, { root: true });
          })
      })
    },
    sendFriendRequest({commit, dispatch, state}, userId) {
      const data = {userIds: [userId]};
      commit('setStatusSendRequest', 'loading');
      return axios.post('/sendFriendRequests', JSON.stringify(data)).then(response => {
        if (!response.data.success) {
          commit('setStatusSendRequest', 'error');
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          if (response.data.data.length) {
            dispatch('searchUserById', response.data.data[0]).then((response) => {
              const index = state.incomeRequests.findIndex(
                item => item.id === response.data.data.id);

              if (index !== -1) {
                commit('addFriend', { friend: response.data.data, index});
                const paramsErr = {
                  title: 'New friend!', text: 'The user added to friends', type:'success'
                };
                dispatch('notifications/addNotification', paramsErr, { root: true });
              } else {
                const paramsErr = {title: 'Sent!', text: 'The friend request sent', type:'info'};
                dispatch('notifications/addNotification', paramsErr, { root: true });
              }
            })
          } else {
            const paramsErr = {title: 'Sent!', text: 'The friend request sent', type:'info'};
            dispatch('notifications/addNotification', paramsErr, { root: true });
          }
          commit('setStatusSendRequest', 'success');
        }
      })
        .catch(error => {
          commit('setStatusSendRequest', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    searchUserById({commit, dispatch}, userId) {
      return new Promise((resolve) => {
        axios.get(`/users/${userId}`).then(response => {
          if (!response.data.success) {
            const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
            dispatch('notifications/addNotification', paramsErr, { root: true });
          } else {
            if (response.data.data) {
              resolve(response);
            }
          }
        })
          .catch(error => {
            dispatch('notifications/addNotificationCatchError', null, { root: true });
          })
      })
    },
    deleteFriend({commit, dispatch}, userId) {
      const data = {userIds: [userId]};
      return axios.post('/deleteFriends', JSON.stringify(data)).then(response => {
        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          if (response.data.data.length) {
            commit('deleteFriend', response.data.data[0]);
          }
        }
      })
        .catch(error => {
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
  }
}