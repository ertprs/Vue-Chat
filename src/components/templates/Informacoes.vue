<template>
  <div id="informacoes">
    <template>
      <div class="titulo-informacoes">
        <h1>
          <i class="fas fa-info-circle"></i>
           Informacoes
        </h1>
      </div>
      <div class="lista-informacoes-container" v-if="atendimentoAtivo.informacoes">
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-portrait"></i>
              Nome
            </span>
          </div>
          <p v-if="atendimentoAtivo.informacoes.nome"> {{ atendimentoAtivo.informacoes.nome }} </p>
          <p v-else> --- </p>
        </div>
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-file-alt"></i>
              Protocolo
            </span>
          </div>
          <p v-if="atendimentoAtivo.informacoes.Protocolo"> {{ atendimentoAtivo.informacoes.Protocolo }} </p>
          <p v-else> --- </p>
        </div>
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-user-clock"></i>
              Tempo Conectado
            </span>
          </div>
          <p v-if="atendimentoAtivo.informacoes.tempo_conectado"> {{ atendimentoAtivo.informacoes.tempo_conectado }} </p>
          <p v-else> --- </p>
        </div>
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-clock"></i>
              Tempo de Fila
            </span>
          </div>
          <p v-if="atendimentoAtivo.informacoes.tempo_fila"> {{ atendimentoAtivo.informacoes.tempo_fila }} </p>
          <p v-else> --- </p>
        </div>
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