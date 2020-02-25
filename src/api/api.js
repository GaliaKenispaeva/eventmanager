import {getToken} from '../utils/token';

const axios = require('axios');
axios.defaults.baseURL = 'http://event-manager.burningbuttons.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(function (config) {
  const token = getToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export {axios}