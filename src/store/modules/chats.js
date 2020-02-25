import {axios} from '../../api/api';
import {joinChat} from '../../api/socket';

export default {
  namespaced: true,
  state: {
    status: '',
    chats: [],
  },
  getters: {
    chatsByParticipantId: state => {
      const obj = {};
      state.chats.forEach((item) => {
        const key = item.participants ? item.participants[0].id : item.userTwo;
        obj[key] = item;
      });
      return obj;
    },
  },
  mutations: {
    setStatus(state, payload) {
      state.status = payload;
    },
    setChats(state, data) {
      state.chats = data;
    },
    addChat(state, newChat) {
      if (!state.chats.some(item => item.id === newChat.id)) {
        state.chats.push(newChat);
      }
    },
  },
  actions: {
    getChats({commit, dispatch}) {
      commit('setStatus', 'loading');
      return axios.get('/personalChats').then(response => {
        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('setChats', response.data.data);
          const chatIdList = response.data.data.map(item => item.id);
          console.log(chatIdList);
          chatIdList.forEach(chatId => joinChat(chatId));
          commit('setStatus', 'success');
        }
      })
        .catch(error => {
          commit('setStatus', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    createChat({commit, dispatch}, userId)
    {
      commit('setStatus', 'loading');
      return axios.put(`/personalChat/${userId}`)
        .then(response => {
          if (!response.data.success) {
            commit('setStatus', 'error');
            const paramsErr = {title: 'Error from server',
              text: response.data.err, type:'danger'};
            dispatch('notifications/addNotification', paramsErr, { root: true });
          } else {
            commit('addChat', response.data.data);
            joinChat(response.data.data.id);
            commit('setStatus', 'success');
            /*const paramsErr = {
              title: 'Success!', text: 'Created a new chat.', type:'success'
            };
            dispatch('notifications/addNotification', paramsErr, { root: true });*/
          }
        })
        .catch(error => {
          commit('setStatus', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    sendMessage({commit, dispatch}, data = {message, chatId}) {
      commit('setStatus', 'loading');
      return axios.post('/message', JSON.stringify(data)).then(response => {
        if (!response.data.success) {
          commit('setStatus', 'error');
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('setStatus', 'success');
        }
      })
        .catch(error => {
          commit('setStatus', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    getMessages({commit, dispatch}, {chatId, limit, date}) {
      return new Promise((resolve) => {
        commit('setStatus', 'loading');
        axios.get('/messages', {params: { chatId, limit, date }})
          .then(response => {
            if (!response.data.success) {
              const paramsErr = {title: 'Error from server',
                text: response.data.err, type:'danger'};
              dispatch('notifications/addNotification', paramsErr, { root: true });
            } else {
              commit('setStatus', 'success');
              resolve(response);
            }
          })
          .catch(error => {
            commit('setStatus', 'error');
            dispatch('notifications/addNotificationCatchError', null, { root: true });
          })
      })
    },
  },
}