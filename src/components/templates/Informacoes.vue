<template>
  <div id="informacoes">
    <template v-if="informacoesAberto">
      <div class="titulo-informacoes">
        <h1> Informacoes </h1>
      </div>
    </template>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      informacoesAberto: 'getInformacoesAberto'
    })
  }
}
</script>

<style>

</style>