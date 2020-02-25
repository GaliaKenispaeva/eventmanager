import {axios} from '../../api/api';
import {getRangeByDates} from '../../utils/dates';
import moment from 'moment';

export default {
  namespaced: true,
  state: {
    status: '',
    events: [],
  },
  getters: {
    eventsByDate: state => {
      const obj = {};
      state.events.forEach((event) => {
        const start = moment(event.fromDate);
        const end = moment(event.toDate);
        if (start.isSame(end, 'day')) {
          const date = start.format("YYYY-MM-DD");

          if (!obj[date]) {
            obj[date] = [];
          }
          obj[date].push(event);
        } else {
          const dateArray = getRangeByDates(start, end);
          dateArray.forEach((date) => {
            const dateString = moment(date).format("YYYY-MM-DD");

            if (!obj[dateString]) {
              obj[dateString] = [];
            }
            obj[dateString].push(event);
          });
        }
      });
      return obj;
    },
  },
  mutations: {
    setStatus(state, payload) {
      state.status = payload;
    },
    setEvents(state, data) {
      state.events = data;
    },
    addEvent(state, newEvent) {
      state.events.push(newEvent);
    },
    deleteEvent(state, id) {
      state.events = state.events.filter(item => item.id !== id);
    }
  },
  actions: {
    getEvents({commit, dispatch}, {from, to}) {
      commit('setStatus', 'loading');
      return axios.get('/events', {
        params: {
          from_date: from,
          to_date: to
        }
      }).then(response => {
        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('setEvents', response.data.data);
          commit('setStatus', 'success');
        }
      })
        .catch(error => {
          commit('setStatus', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    setEvent({commit, dispatch}, data = {title, description, fromDate, toDate, participants})
    {
      commit('setStatus', 'loading');
      return axios.post('/events', JSON.stringify(data)).then(response => {
        if (!response.data.success) {
          commit('setStatus', 'error');
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('addEvent', response.data.data);
          const paramsErr = {
            title: 'Success!', text: 'Created a new event.', type:'success'
          };
          dispatch('notifications/addNotification', paramsErr, { root: true });
        }
      })
        .catch(error => {
          commit('setStatus', 'error');
          dispatch('notifications/addNotificationCatchError', null, { root: true });
        })
    },
    deleteEvent({commit, dispatch}, eventId) {
      commit('setStatus', 'loading');
      return axios.delete(`/events/${eventId}`).then(response => {
        if (!response.data.success) {
          commit('setStatus', 'error');
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
        } else {
          commit('deleteEvent', eventId);
          commit('setStatus', 'success');
          const paramsErr = {
            title: 'Success!', text: 'Removed the event.', type:'success'
          };
          dispatch('notifications/addNotification', paramsErr, { root: true });
        }
      })
        .catch(error => {
          dispatch('notifications/addNotificationCatchError', null, { root: true });
          commit('setStatus', 'error');
        })
    },
  },
}