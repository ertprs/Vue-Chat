<template>
  <div blocker v-if="blocker" v-on:click="fecharBlocker()" 
    :class="{
      'bg-blocker-padrao' : origemBlocker == 'btn-acoes' || 
      origemBlocker == 'msg-formatada' ||
      origemBlocker == 'atd-parado' || origemBlocker == 'visualizar-imagem'
      }">
        <div v-if="origemBlocker == 'atd-parado'" class="atd-parado-container">
          <h3> Atendimento em pausa </h3>
          <h4 @click="emitirEventoMudarEstadoAtd()">
            <i class="fas fa-play"></i>
            Clique aqui para voltar
          </h4>
        </div>
        <div v-else-if="origemBlocker == 'visualizar-imagem'" class="visualizar-imagem-container">
          <img :src="linkImagem" alt="Preview imagem">
        </div>
      </div> <!--  || origemBlocker == 'encerramento' -->
</template>

<script>
import { mapGetters } from 'vuex'
import { liberarEncerrar } from '../../services/atendimentos'

export default {
  methods: {
    fecharBlocker(){
      if(this.origemBlocker == "atd-parado"){
        return
      }

      liberarEncerrar()
      this.$store.dispatch('setBlocker', false)
      if(this.abrirPopup){
        this.$store.dispatch('setAbrirPopup', false)
      }
    },
    emitirEventoMudarEstadoAtd(){
      this.$root.$emit("mudarEstadoAtd")
    }
  },
  watch: {
    linkImagem(){
      console.log("linkImagem: ", this.linkImagem)
    }
  },
  computed: {
    ...mapGetters({
      blocker: 'getBlocker',
      origemBlocker: 'getOrigemBlocker',
      abrirPopup: 'getAbrirPopup',
      linkImagem: 'getLinkImagem'
    })
  }
}
</script>