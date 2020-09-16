<template>
  <div :class="'mensagem-'+origem">
    <div></div>
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
      <p> {{ msg }} </p>
      <span class="horario-envio"> {{ horario }} </span>
      <span class="check" :class="{'visualizado' : status == 'L'}">
        <template v-if="status == 'G' || status=='D'">
          enviado
          <i class="fas fa-check"></i>
        </template>
        <template v-else-if="status == 'Q'">
          enviando
          <i class="fas fa-clock"></i>
        </template>
        <template v-else-if="status == 'L'">
          visualizado
          <i class="fas fa-check-double"></i>
        </template>
        <template v-else-if="status == 'E' || status == 'T'">
          falha no envio
          <i class="fas fa-times-circle"></i>
        </template>
      </span>
      <span class="autor-mensagem"> {{ autor }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["autor", "origem", "msg", "anexo", "imgAnexo", "horario", "status", "logo", "tipoDoc", "docAnexo", "nomeArquivo"]
}
</script>