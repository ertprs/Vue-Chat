<template>
  <div :class="'mensagem-'+origem">
    <div class="mensagem">
      <div v-if="anexo" class="mensagem-div-anexo">
        <img v-if="imgAnexo" :src="imgAnexo" alt="Imagem Anexada">
        <a v-if="imgAnexo" :href="imgAnexo" download target="_blank"> Baixar Imagem <i class="fas fa-download"></i> </a>
        <div v-if="tipoDoc" class="anexo-container">
          <a :href="docAnexo" target="_blank" :title="`${tipoDoc} - ${nomeArquivo}`">
            <i class="fas fa-file-alt"></i>
            <p> {{ nomeArquivo }} </p>
          </a>
          <!-- <embed :src="docAnexo" :type="tipoDoc"> -->
        </div>
      </div>
      <p v-html="msg"></p>
      <span class="horario-envio"> {{ horario }} </span>
      
      <transition name="fade">
        <span class="check" v-if="status == 'G'"> <i class="fas fa-clock"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check laranja" v-if="status == 'Q'"> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check" v-if="status == 'E'"> <i class="fas fa-check"></i> </span>
      </transition>
      <transition name="fade">
        <span class="check visualizado" v-if="status == 'L'"> <i class="fas fa-check-double"></i> </span>
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
  props: ["autor", "origem", "msg", "anexo", "imgAnexo", "horario", "status", "logo", "tipoDoc", "docAnexo", "nomeArquivo"]
}
</script>