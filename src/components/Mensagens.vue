<template>
  <div :class="'mensagem-'+origem">
    <div class="mensagem">
      <p v-if="!anexo"> {{ msg }} </p>
      <div v-else class="mensagem-div-anexo">
        <img :src="imgAnexo" alt="Imagem Anexada">
      </div>
      <span class="horario-envio"> {{ horario }} </span>
      <span :class="'check ' + status"> <!-- usar :class -->
        <template v-if="status == 'enviado'">
          enviado
          <i class="fas fa-check"></i>
        </template>
        <template v-else-if="status == 'recebido'">
          recebido
          <i class="fas fa-check-double"></i>
        </template>
        <template v-else-if="status == 'visualizado'">
          visualizado
          <i class="fas fa-check-double"></i>
        </template>

        <template v-else> </template>

      </span>
      <span class="autor-mensagem"> {{ autor }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["autor", "origem", "msg", "anexo", "imgAnexo", "horario", "status", "logo"]
}
</script>