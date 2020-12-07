<template>
  <div :class="'mensagem-'+origem" v-if="origem">
    <div class="mensagem">
      <div v-if="anexo" class="mensagem-div-anexo">
        <img v-if="imgAnexo" @click="abrirVisualizacaoImg(imgAnexo)" :src="imgAnexo" :alt="dicionario.alt_msg_img">
        <div class="anexos-links-container" v-if="imgAnexo">
          <a href="#" @click="abrirVisualizacaoImg(imgAnexo)"> {{ dicionario.titulo_visualizar_img }} <font-awesome-icon :icon="['fas', 'search-plus']" /> </a>
        </div>
        <div v-else-if="docAnexo" class="anexo-container">
          <template v-if="audio || video">
            <audio v-if="audio" :src="docAnexo" controls :title="`${tipoDoc} - ${nomeArquivo}`">
              <p> {{ dicionario.msg_erro_audio }} <a :href="docAnexo" target="_blank"> {{ dicionario.msg_abrir_audio }} </a> </p>
            </audio>
            <video v-if="video" :src="docAnexo" controls :title="`${tipoDoc} - ${nomeArquivo}`">
              <p> {{ dicionario.msg_erro_video }} <a v-if="tipoDoc != 'erro'" :href="docAnexo" target="_blank"> {{ dicionario.msg_abrir_video }} </a> </p>
            </video>
          </template>
          <template v-else>
            <a v-if="tipoDoc != 'erro'" :href="hrefAnexo" target="_blank" :title="`${tipoDoc} - ${nomeArquivo}`">
              <font-awesome-icon :icon="['fas', 'file-alt']" />
              <p v-text="nomeArquivo"></p>
            </a>
            <p v-else :title="`${tipoDoc} - ${nomeArquivo}`" class="arquivo-erro">
              <font-awesome-icon :icon="['fas', 'file-alt']" />
              {{ nomeArquivo }}
            </p>
          </template>
        </div>
        <a :href="imgAnexo" :download="`${nomeArquivo}`" target="_blank"> {{ dicionario.titulo_baixar_img }} <font-awesome-icon :icon="['fas', 'download']" /> </a>
      </div>
      <p v-text="msg"></p>
      <span class="horario-envio" v-text="horario"></span>

      <transition name="fade" mode="out-in">
        <span class="check" v-if="status == 'D'" :content="contentTooltip" v-tippy key="check-padrao"> <font-awesome-icon :icon="['fas', 'check']" /> </span>
        <span class="check cinza" v-else-if="status == 'Q'" :content="contentTooltip" v-tippy key="check-cinza"> <font-awesome-icon :icon="['fas', 'check']" /> </span>
        <span class="check preto" v-else-if="status == 'G'" :content="contentTooltip" v-tippy key="check-preto"> <font-awesome-icon :icon="['fas', 'check']" /> </span>
        <span class="check preto" v-else-if="status == 'E'" :content="contentTooltip" v-tippy key="double-check-preto"> <font-awesome-icon :icon="['fas', 'check-double']" /> </span>
        <span class="check visualizado" v-else-if="status == 'L'" :content="contentTooltip" v-tippy key="double-check-visualizado"> <font-awesome-icon :icon="['fas', 'check-double']" /> </span>
        <span class="check vermelho" v-else-if="status == 'C'" :content="contentTooltip" v-tippy key="times-circle"> <font-awesome-icon :icon="['fas', 'times-circle']" /> </span>
        <span class="check vermelho" v-else-if="status == 'T'" :content="contentTooltip" v-tippy key="hourglass"> <font-awesome-icon :icon="['fas', 'hourglass']" /> </span>
      </transition>

      <span class="autor-mensagem" v-text="autor"></span>
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
      strTooltipAux: "",
      linkAux: ""
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
