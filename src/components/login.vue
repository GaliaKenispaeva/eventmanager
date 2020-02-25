<template>
  <div class="login">
    <form class="form-signin" @submit.prevent="login" @keyup="checkForm">
      <img class="mb-4" src="../assets/logo.png" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Login</h1>
      <label for="inputEmail">
        <div v-if="errors.length" style="color:red">
          <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
        </div>
      </label>
      <input
        v-model="username"
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required=""
        autofocus=""
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      >
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        v-model="password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required=""
      >
      <button
        class="btn btn-lg btn-primary btn-block"
        type="submit"
        :disabled="isDisabled"
      >Login</button>
      <div class="form-footer border-top">
        <p>Don't have account yet?</p>
        <router-link to="/signup">Sign up</router-link>
      </div>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import {isEmpty, validEmail} from '../utils/validators'

export default {
  name: 'login',
  data: () => ({
    username: '',
    password: '',
    errors: []
  }),
  computed: {
    isDisabled() {
      return !!this.errors.length || !this.username.length || !this.password.length;
    }
  },
  methods: {
    ...mapActions('auth',{
      signinRequest: 'signinRequest'}
    ),
    login: function () {
      const { username, password } = this;
      this.signinRequest({ login: username, password })
    },
    checkForm: function (e) {
      this.errors = [];

      if (isEmpty(this.username)) {
        this.errors.push('Required field.');
      } else if (!validEmail(this.username)) {
        this.errors.push('Login must be email.');
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}

.form-footer {
  margin-top: 1rem;
  text-align: left;
}

input {
  margin-bottom: 1rem;
}

p {
  margin: 0;
}
</style>