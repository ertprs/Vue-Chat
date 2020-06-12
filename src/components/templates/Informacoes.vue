<template>
  <div id="informacoes">
    <template>
      <div class="titulo-informacoes">
        <h1>
          <i class="fas fa-info-circle"></i>
           Informacoes
        </h1>
        <div v-if="atendimentoAtivo.informacoes">
          <div v-if="atendimentoAtivo.informacoes.nome">
            <div>
              <i class="fas fa-user"></i>
              <p> Nome </p>
            </div>
            <p> {{ atendimentoAtivo.informacoes.nome }} </p>
          </div>
          <div v-if="atendimentoAtivo.informacoes.tempo_conectado">
            <div>
              <i class="fas fa-user-clock"></i>
              <p> Tempo Conectado </p>
            </div>
            <p> {{ atendimentoAtivo.informacoes.tempo_conectado }} </p>
          </div>
          <div v-if="atendimentoAtivo.informacoes.tempo_fila">
            <div>
              <i class="fas fa-clock"></i>
              <p> Tempo de Fila </p>
            </div>                
            <p> {{ atendimentoAtivo.informacoes.tempo_fila }} </p>
          </div>
        </div>
      </div>
      <div class="lista-informacoes-container" v-if="atendimentoAtivo.informacoes">
        
      </div>
      <div class="lista-informacoes-container-vazio" v-else>
        <div>
          <i class="far fa-folder-open"></i>
          <p> Sem Informacoes para mostrar </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}
</script>

<style>

</style>