<template>
  <div blocker v-if="blocker" v-on:click="fecharBlocker()" :class="{'bg-blocker-padrao' : origemBlocker == 'btn-acoes' || origemBlocker == 'msg-formatada'}"></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    fecharBlocker(){
      this.$store.dispatch('setBlocker', false)
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