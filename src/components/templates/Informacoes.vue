<template>
  <div id="informacoes">
    <template>
      <div class="titulo-informacoes">
        <h1 title="Informacoes">
          <i class="fas fa-info-circle"></i>
           <!-- Informacoes -->
        </h1>
        <div v-if="atendimentoAtivo.informacoes">
          <div v-if="atendimentoAtivo.informacoes.nome">
            <div>
              <i class="fas fa-user"></i>
              <p> Contato </p>
            </div>
            <p> {{ formataNome(atendimentoAtivo.informacoes.nome) }} / {{ formataTelefone(atendimentoAtivo.id) }} </p>
          </div>
          <div v-if="atendimentoAtivo.informacoes.tempo_conectado">
            <div>
              <i class="fas fa-user-clock"></i>
              <p> Tempo Conectado </p>
            </div>
            <p> {{ formataHorario(atendimentoAtivo.informacoes.tempo_conectado) }} </p>
          </div>
          <div v-if="atendimentoAtivo.informacoes.tempo_fila">
            <div>
              <i class="fas fa-clock"></i>
              <p> Tempo de Fila </p>
            </div>
            <p> {{ formataHorario(atendimentoAtivo.informacoes.tempo_fila) }} </p>
          </div>
        </div>
      </div>
      <div class="lista-informacoes-container" v-if="atendimentoAtivo.informacoes">
        <div class="container-acoes">
          <BotoesAcoes />
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

import BotoesAcoes from '../BotoesAcoes'

export default {
  components: {
    BotoesAcoes
  },
  methods: {
    formataNome(nome){
      nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, function(capitalize) { return capitalize.toUpperCase() })
      return nome
    },
    formataTelefone(telefone){
      telefone = "+"+telefone.slice(0,2)+" ("+telefone.slice(2,4)+") "+telefone.slice(4, 9)+"-"+telefone.slice(9, telefone.length)
      return telefone
    },
    formataHorario(hora){
      if(hora[0] && hora[1] == '0'){
        return hora.slice(3,5)+' minutos'
      }else{
        return hora.slice(0,2)+'horas e '+hora.slice(3,5)+' minutos'
      }
      return hora
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  },
}
</script>

<style>

</style>