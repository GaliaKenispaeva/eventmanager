<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <router-link class="navbar-brand" :to="{name: 'main'}">Event manager</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div id="navbarNav" class="collapse navbar-collapse justify-content-end">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'main'}">
            <img src="../../assets/calendar.svg">
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'friends'}">My friends</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'chats'}">Messages</router-link>
        </li>
        <li class="nav-item">
          <a><span class="nav-link" @click="logout">Log out</span></a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  methods: {
    ...mapActions('auth', {
      logout: 'logout',
    }),
  }
}
</script>
<style scoped>
</style>