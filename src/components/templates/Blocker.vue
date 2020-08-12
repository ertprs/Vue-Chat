<template>
  <div blocker v-if="blocker" v-on:click="fecharBlocker()" :class="{'bg-blocker-padrao' : origemBlocker == 'btn-acoes'}"></div>
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
      blocker: 'getBlocker',
      origemBlocker: 'getOrigemBlocker'
    })
  }
}
</script>