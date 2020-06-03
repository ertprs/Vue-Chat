<template>
  <div id="informacoes">
    <template>
      <div class="titulo-informacoes">
        <h1>
          <i class="fas fa-info-circle"></i>
           Informacoes 
        </h1>
      </div>
      <div>
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