<template>
  <div class="main">
    <my-menu />
    <calendar />
  </div>
</template>

<script>
import MyMenu from './shared/myMenu'
import Calendar from './calendar'

export default {
  name: 'main',
  components: {
    MyMenu,
    Calendar,
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>