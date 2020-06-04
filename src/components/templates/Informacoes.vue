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
          <p> {{ atendimentoAtivo.informacoes.nome }} </p>
        </div>
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-file-alt"></i>
              Protocolo
            </span>
          </div>
          <p> {{ atendimentoAtivo.informacoes.Protocolo }} </p>
        </div>
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-user-clock"></i>
              Tempo Conectado
            </span>
          </div>
          <p> {{ atendimentoAtivo.informacoes.tempo_conectado }} </p>
        </div>
        <div class="info">
          <div>
            <hr>
            <span>
              <i class="fas fa-clock"></i>
              Tempo de Fila
            </span>
          </div>
          <p> {{ atendimentoAtivo.informacoes.tempo_fila }} </p>
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
      // informacoesAberto: 'getInformacoesAberto'
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}
</script>

<style>

</style>