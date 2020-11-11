<template>
  <div blocker v-if="blocker" @click="fecharBlocker()" 
    :class="{
      'bg-blocker-padrao' : origemBlocker == 'btn-acoes' || 
      origemBlocker == 'msg-formatada' ||
      origemBlocker == 'atd-parado' || origemBlocker == 'visualizar-imagem'
      }">
        <div v-if="origemBlocker == 'atd-parado'" class="atd-parado-container">
          <h3> {{ dicionario.titulo_pausa }} </h3>
          <h4 @click="emitirEventoMudarEstadoAtd()">
            <i class="fas fa-play"></i>
            {{ dicionario.titulo_retornar_pausa }}
          </h4>
        </div>
        <div v-else-if="origemBlocker == 'visualizar-imagem'" class="visualizar-imagem-container">
          <img :src="linkImagem" :alt="dicionario.alt_msg_img">
        </div>
      </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { liberarEncerrar } from '@/services/atendimentos'

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
      this.$root.$emit("mudar-estado-atd")
    }
  },
  computed: {
    ...mapGetters({
      blocker: "getBlocker",
      origemBlocker: "getOrigemBlocker",
      abrirPopup: "getAbrirPopup",
      linkImagem: "getLinkImagem",
      dicionario: "getDicionario"
    })
  }
}
</script>