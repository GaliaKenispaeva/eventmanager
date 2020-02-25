<template>
  <div class="signup">
    <form class="form-signin" @submit.prevent="signup">
      <img class="mb-4" src="../assets/logo.png" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
      <label for="inputEmail">
        Email address
        <div v-if="errors.login.length" style="color:red">
          <p v-for="(error, index) in errors.login" :key="index">{{ error }}</p>
        </div>
      </label>
      <input
        id="inputEmail"
        v-model="login"
        type="email"
        class="form-control"
        placeholder="Email address"
        required=""
        autofocus=""
        @keyup="checkEmail"
      >
      <label for="firstName">
        First name
        <div v-if="errors.firstName.length" style="color:red">
          <p v-for="(error, index) in errors.firstName" :key="index">{{ error }}</p>
        </div>
      </label>
      <input
        id="firstName"
        v-model="firstname"
        type="text"
        class="form-control"
        placeholder="first name"
        required=""
        autofocus=""
        @keyup="checkInput"
      >
      <label for="lastName">
        Last name
        <div v-if="errors.lastName.length" style="color:red">
          <p v-for="(error, index) in errors.lastName" :key="index">{{ error }}</p>
        </div>
      </label>
      <input
        id="lastName"
        v-model="lastname"
        type="text"
        class="form-control"
        placeholder="last name"
        required=""
        autofocus=""
        @keyup="checkInput"
      >
      <label for="inputPassword">
        Password
        <div v-if="errors.password.length" style="color:red">
          <p v-for="(error, index) in errors.password" :key="index">{{ error }}</p>
        </div>
      </label>
      <input
        id="inputPassword"
        v-model="password"
        type="password"
        class="form-control"
        placeholder="Password"
        minlength="6"
        required=""
        title="Must be minimum 6 simbols"
        @keyup="validPassword"
      >
      <label for="confirmPassword">Confirm password</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        class="form-control"
        placeholder="Password"
        minlength="6"
        required=""
        title="Must be minimum 6 simbols"
        @keyup="validPassword"
      >
      <button class="btn btn-lg btn-primary btn-block" type="submit" :disabled="isDisabled">
        Sign up
      </button>
      <div class="form-footer border-top">
        <p>Already have account?</p>
        <router-link to="/login">Login</router-link>
      </div>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import {isEmpty, checkPassword, validEmail} from '../utils/validators'

export default {
  name: 'signup',
  data: () => ({
    login: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    errors: {
      login:[],
      firstName: [],
      lastName: [],
      password: []
    },
  }),
  computed: {
    isDisabled() {
      return Object.entries(this.errors).some(([key, value]) => !!value.length)
        || !this.login.length || !this.firstname.length || !this.lastname.length
        || !this.password.length;
    }
  },
  methods: {
    ...mapActions('auth',{
      signupRequest: 'signupRequest',
      signinRequest: 'signinRequest',
    }),
    signup: function () {
      const { firstname, lastname, login, password } = this;
      this.signupRequest({url:'/signup', data:{ firstname, lastname, login, password }})
    },
    checkEmail() {
      this.errors.login = [];
      if (isEmpty(this.login)) {
        this.errors.login.push('Required field.');
      } else if (!validEmail(this.login)) {
        this.errors.login.push('Login must be email.');
      }
    },
    checkInput(e) {
      this.errors[e.target.id] = [];
      if (isEmpty(e.target.value)) {
        this.errors[e.target.id].push('Required field.');
      }
    },
    validPassword() {
      this.errors.password = [];
      this.errors.password.push(...checkPassword(this.password, this.confirmPassword));
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
label {
  text-align: left;
}
</style>