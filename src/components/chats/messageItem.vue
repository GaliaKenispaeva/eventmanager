<template>
  <div class="message clearfix">
    <div class="card-text" :class="{'your-message': isYourMessage}">
      <xmp>{{message.message}}</xmp>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      userId: 'auth/userId',
    }),
    isYourMessage() {
      return this.message.from.id === this.userId;
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.clearfix:after {
	visibility: hidden;
	display: block;
	font-size: 0;
	content: " ";
	clear: both;
	height: 0;
}

xmp {
	margin: 0;
	text-align: left;
}

.message {
	width: 100%;
	padding-bottom: 5px;
}
.card-text {
	float: left;
	padding: 5px;
	max-width: 80%;
	width: fit-content;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	font-size: 1rem;
	background-color: rgba(95, 158, 160, 0.466);
}

.your-message {
	float: right;
	background-color:rgba(128, 128, 128, 0.411);
}

.card-title {
	margin-bottom: 0;
	font-size: 0.8rem;
	color: darkblue;
}
</style>