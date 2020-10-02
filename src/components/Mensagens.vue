<template>
  <div :class="'mensagem-'+origem">
    <div class="mensagem">
      <div v-if="anexo" class="mensagem-div-anexo">
        <img v-if="imgAnexo" :src="imgAnexo" alt="Imagem Anexada">
        <a v-if="imgAnexo" :href="imgAnexo" download> Baixar Imagem <i class="fas fa-download"></i> </a>
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
      
      <span class="check visualizado" v-if="status == 'L'"> visualizado <i class="fas fa-check-double"></i> </span>
      <span class="check" v-if="status == 'Q'"> enviando <i class="fas fa-clock"></i> </span>
      <span class="check" v-if="status == 'G' || status == 'D'"> enviado <i class="fas fa-check"></i> </span>
      <span class="check" v-if="status == 'E' || status == 'T'"> falha no envio <i class="fas fa-times-circle"></i> </span>

      <span class="autor-mensagem"> {{ autor }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["autor", "origem", "msg", "anexo", "imgAnexo", "horario", "status", "logo", "tipoDoc", "docAnexo", "nomeArquivo"]
}
</script>