<template>
  <div class="friend pt-2 card">
    <span class="friend__name">{{ friend.firstname }} {{ friend.lastname }}</span>
    <a v-if="haveChat" class="px-2" href="#"><img src="../../assets/comment-discussion.svg"/></a>
    <button
      v-if="haveBtnPlus"
      class="plus close px-2 pb-1"
      type="button"
      aria-label="delete"
      @click="onAddClick"
    >
      <span aria-hidden="true">&plus;</span>
    </button>
    <button
      v-if="haveBtnRemove"
      class="close px-2 pb-1"
      type="button"
      aria-label="delete"
      @click="onDeleteClick"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>

export default {
  props: {
    friend: {
      type: Object,
      required: true,
    },
    haveBtnPlus: {
      type: Boolean,
      default: false,
    },
    haveBtnRemove: {
      type: Boolean,
      default: true,
    },
    haveChat: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onDeleteClick: function() {
      this.$emit('remove');
    },
    onAddClick() {
      this.$emit('add');
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.friend {
  display: flex;
  flex-flow: row nowrap;
}

.friend__name {
  flex-grow: 1;
  font-size: larger;
}

.plus {
  color: green;
}
</style>