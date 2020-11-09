<template>
  <div :class="'mensagem-'+origem" v-if="origem">
    <div class="mensagem">
      <div v-if="anexo" class="mensagem-div-anexo">
        <img v-if="imgAnexo" @click="abrirVisualizacaoImg(imgAnexo)" :src="imgAnexo" alt="Imagem Anexada">
        <div class="anexos-links-container" v-if="imgAnexo">
          <a :href="imgAnexo" :download="`${nomeArquivo}`" target="_blank"> Baixar Imagem <i class="fas fa-download"></i> </a>
          <a href="#" @click="abrirVisualizacaoImg(imgAnexo)"> Visualizar Imagem <i class="fas fa-search-plus"></i> </a>
        </div>
        <div v-else-if="docAnexo" class="anexo-container">
          <template v-if="audio || video">
            <audio v-if="audio" :src="docAnexo" controls>
              <p> Seu navegador nao suporta o elemento audio <a :href="docAnexo" target="_blank">Clique para abrir o audio em outra janela</a> </p>
            </audio>
            <video v-if="video" :src="docAnexo" controls>
              <p> Seu navegador nao suporta o elemento video <a :href="docAnexo" target="_blank">Clique para abrir o video em outra janela</a> </p>
            </video>
          </template>
          <a v-else :href="docAnexo" target="_blank" :title="`${tipoDoc} - ${nomeArquivo}`">
            <i class="fas fa-file-alt"></i>
            <p> {{ nomeArquivo }} </p>
          </a>
        </div>
      </div>
      <p v-html="msg"></p>
      <span class="horario-envio"> {{ horario }} </span>
      
      <transition name="fade">
        <span class="check" v-if="status == 'D'"> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check preto" v-if="status == 'G'"> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check preto" v-if="status == 'E'"> <i class="fas fa-check-double"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check visualizado" v-if="status == 'L'"> <i class="fas fa-check-double"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check verde" v-if="status == 'Q'"> <i class="fas fa-clock"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check vermelho" v-if="status == 'C'"> <i class="fas fa-times-circle"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check vermelho" v-if="status == 'T'"> <i class="fas fa-hourglass"></i> </span>
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
export default {
  props: ["autor", "origem", "msg", "anexo", "imgAnexo", "horario", "status", "logo", "tipoDoc", "docAnexo", "nomeArquivo", "audio", "video"],
  methods: {
    abrirVisualizacaoImg(imagem){
      this.$store.dispatch("setLinkImagem", imagem)

      this.$store.dispatch("setBlocker", true)
      this.$store.dispatch("setOrigemBlocker", "visualizar-imagem")
    }
  }
}
</script>