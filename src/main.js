import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import SimpleVueValidation from 'simple-vue-validator'

Vue.config.productionTip = false
Vue.use(SimpleVueValidation);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
