<template>
  <div :class="'mensagem-'+origem" v-if="origem">
    <div class="mensagem">
      <div v-if="anexo" class="mensagem-div-anexo">
        <img v-if="imgAnexo" @click="abrirVisualizacaoImg(imgAnexo)" :src="imgAnexo" :alt="dicionario.alt_msg_img">
        <div class="anexos-links-container" v-if="imgAnexo">
          <a :href="imgAnexo" :download="`${nomeArquivo}`" target="_blank"> {{ dicionario.titulo_baixar_img }} <i class="fas fa-download"></i> </a>
          <a href="#" @click="abrirVisualizacaoImg(imgAnexo)"> {{ dicionario.titulo_visualizar_img }} <i class="fas fa-search-plus"></i> </a>
        </div>
        <div v-else-if="docAnexo" class="anexo-container">
          <template v-if="audio || video">
            <audio v-if="audio" :src="docAnexo" controls>
              <p> {{ dicionario.msg_erro_audio }} <a :href="docAnexo" target="_blank"> {{ dicionario.msg_abrir_audio }} </a> </p>
            </audio>
            <video v-if="video" :src="docAnexo" controls>
              <p> {{ dicionario.msg_erro_video }} <a :href="docAnexo" target="_blank"> {{ dicionario.msg_abrir_video }} </a> </p>
            </video>
          </template>
          <template v-else>
            <a :href="hrefAnexo" target="_blank" :title="`${tipoDoc} - ${nomeArquivo}`">
              <i class="fas fa-file-alt"></i>
              <p> {{ nomeArquivo }} </p>
            </a>
          </template>
        </div>
      </div>
      <a :href="msg" v-if="link" target="_blank">{{ msg }}</a>
      <p v-if="!link" v-html="msg"></p>
      <span class="horario-envio"> {{ horario }} </span>

      <transition name="fade">
        <span class="check" v-if="status == 'D'" :content="contentTooltip" v-tippy> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check cinza" v-if="status == 'Q'" :content="contentTooltip" v-tippy> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check preto" v-if="status == 'G'" :content="contentTooltip" v-tippy> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check preto" v-if="status == 'E'" :content="contentTooltip" v-tippy> <i class="fas fa-check-double"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check visualizado" v-if="status == 'L'" :content="contentTooltip" v-tippy> <i class="fas fa-check-double"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check vermelho" v-if="status == 'C'" :content="contentTooltip" v-tippy> <i class="fas fa-times-circle"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check vermelho" v-if="status == 'T'" :content="contentTooltip" v-tippy> <i class="fas fa-hourglass"></i> </span>
      </transition>

      <span class="autor-mensagem"> {{ autor }} </span>
    </div>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

<script>
import { mapGetters } from "vuex"

export default {
  props: ["autor", "origem", "msg", "link", "anexo", "imgAnexo", "horario", "status", "logo", "tipoDoc", "docAnexo", "nomeArquivo", "audio", "video", "msgTooltip"],
  data(){
    return{
      strTooltipAux: ""
    }
  },
  computed: {
    ...mapGetters({
      dicionario: "getDicionario"
    }),
    hrefAnexo(){
      if(this.docAnexo){
        if(this.tipoDoc == "erro"){
          return this.hrefAnexo = "#"
        }else{
          return this.docAnexo
        }
      }
    },
    contentTooltip: {
      get(){
        if(this.status && !this.msgTooltip){
          const msgStatus = "msg_status_"+this.status
          return this.strTooltipAux = this.dicionario[msgStatus]
        }else if(this.status && this.msgTooltip){
          return this.strTooltipAux = this.msgTooltip
        }
      },
      set(msg){
        return this.contentTooltip = msg
      }
    }
  },
  methods: {
    abrirVisualizacaoImg(imagem){
      this.$store.dispatch("setLinkImagem", imagem)

      this.$store.dispatch("setBlocker", true)
      this.$store.dispatch("setOrigemBlocker", "visualizar-imagem")
    }
  },
}
</script>
