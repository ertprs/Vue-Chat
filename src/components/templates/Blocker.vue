<template>
  <div blocker v-if="blocker" v-on:click="fecharBlocker()"></div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setBlocker']),
    fecharBlocker(){
      this.setBlocker(false)
    }
  },
  computed: {
    ...mapGetters({
      blocker: 'getBlocker'
    })
  }
}
</script>