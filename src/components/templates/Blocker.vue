<template>
  <div blocker v-if="blocker" @click="fecharBlocker()"
    :class="{
      'bg-blocker-padrao' : origemBlocker == 'btn-acoes',
      'bg-blocker-padrao' : origemBlocker == 'msg-formatada',
      'bg-blocker-padrao' : origemBlocker == 'atd-parado',
      'bg-blocker-padrao' : origemBlocker == 'visualizar-imagem',
      'bg-blocker-padrao' : origemBlocker == 'visualizar-iframe'
      }">
        <div v-if="origemBlocker == 'atd-parado'" class="atd-parado-container">
          <h3 v-text="dicionario.titulo_pausa"></h3>
          <h4 @click="emitirEventoMudarEstadoAtd()">
            <font-awesome-icon :icon="['fas', 'play']" />
            {{ dicionario.titulo_retornar_pausa }}
          </h4>
        </div>
        <div v-else-if="origemBlocker == 'visualizar-imagem'" class="container-visualizacao visualizar-imagem-container">
          <img :src="linkImagem" :alt="dicionario.alt_msg_img">
        </div>
        <div v-else-if="origemBlocker == 'visualizar-historico'" class="container-visualizacao visualizar-iframe-container">
          <iframe :src="linkIframe"></iframe>
        </div>
      </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { liberarEncerrar } from '@/services/atendimentos'

export default {
  data(){
    return{
      linkIframe: ""
    }
  },
  mounted(){
    this.$root.$on("abrir-iframe", link => {
      this.setLinkIframe(link)
    })
  },
  methods: {
    setLinkIframe(link){
      this.linkIframe = link
    },
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
