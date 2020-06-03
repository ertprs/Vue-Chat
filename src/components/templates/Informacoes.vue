<template>
  <div id="informacoes">
    <template>
      <div class="titulo-informacoes">
        <h1> Informacoes </h1>
      </div>
      <div>
        <p>Info aqui</p>
        <p>{{this.informacoesDoCliente}}</p>
      </div>
    </template>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      // informacoesAberto: 'getInformacoesAberto'
      informacoesDoCliente: 'getInformacoesDoCliente'
    })
  }
}
</script>

<style>

</style>