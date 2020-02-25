import {axios} from '../../api/api';
import {connect} from '../../api/socket';
import {setToken, getToken, resetToken} from '../../utils/token';
import router from '../../router'

export default {
  namespaced: true,
  state: {
    status: '',
    token: getToken() || '',
    user: {
      id: null,
      login: '',
      firstname: '',
      lastname: ''
    },
  },
  getters: {
    hasToken: state => !!state.token,
    authStatus: state => state.status,
    userId: state => state.user.id,
  },
  mutations: {
    statusLoading(state) {
      state.status = 'loading';
    },
    statusSuccess(state) {
      state.status = 'success';
    },
    authError(state) {
      state.status = 'error';
    },
    storeToken(state, token) {
      state.token = token;
    },
    setUser(state, data) {
      state.user.id = data.id;
      state.user.login = data.login;
      state.user.firstname = data.firstname;
      state.user.lastname = data.lastname;
    },
    logout(state) {
      state.token = '';
    }
  },
  actions: {
    signupRequest({commit, dispatch}, {url, data}) {
      commit('statusLoading');
      return axios.post(url, JSON.stringify(data)).then(response => {

        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
          throw new Error(response.data.err);
        }
        dispatch('signinRequest', {login: data.login, password: data.password});
      })
        .catch(error => {
          commit('authError');
        })
    },
    signinRequest({commit, dispatch}, data) {
      commit('statusLoading');
      return axios.post('/signin', JSON.stringify(data)).then(response => {
        if (!response.data.success) {
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
          commit('authError');
          throw new Error(response.data.err);
        }
        const token = response.data.data.token;
        setToken(token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        commit('setUser', response.data.data);
        commit('storeToken', token);
        commit('statusSuccess');
        connect();
        router.push({ name: 'main' });
      })
        .catch(error => {
          commit('authError');
          resetToken();
        })
    },
    getUser({commit, dispatch}) {
      commit('statusLoading');
      return axios.get('/whoami').then(response => {
        if (!response.data.success) {
          dispatch('logout');
          const paramsErr = {title: 'Error from server', text: response.data.err, type:'danger'};
          dispatch('notifications/addNotification', paramsErr, { root: true });
          commit('authError');
        } else {
          commit('setUser', response.data.data);
          commit('statusSuccess');
          connect();
        }
      })
        .catch(error => {
          commit('authError');
          dispatch('logout');
        })
    },
    logout({commit}) {
      console.log('logout');
      commit('logout');
      resetToken();
      axios.get('/logout');
      router.push({ name: 'login' });
    }
  }
}