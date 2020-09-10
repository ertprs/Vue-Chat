<template>
  <div blocker v-if="blocker" v-on:click="fecharBlocker()" :class="{'bg-blocker-padrao' : origemBlocker == 'btn-acoes' || origemBlocker == 'msg-formatada'}"></div> <!--  || origemBlocker == 'encerramento' -->
</template>

<script>
import { mapGetters } from 'vuex'
import { liberarEncerrar } from '../../services/atendimentos'

export default {
  methods: {
    fecharBlocker(){
      // if(this.origemBlocker == "encerramento"){
      //   console.log('entrou')
      //   return
      // }

      liberarEncerrar()
      this.$store.dispatch('setBlocker', false)
      if(this.abrirPopup){
        this.$store.dispatch('setAbrirPopup', false)
      }
    }
  },
  computed: {
    ...mapGetters({
      blocker: 'getBlocker',
      origemBlocker: 'getOrigemBlocker',
      abrirPopup: 'getAbrirPopup'
    })
  }
}
</script>