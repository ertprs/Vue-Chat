<template>
  <div id="informacoes" class="resizable-content">
    <template>
      <!-- Título -->
      <div class="informacoes-titulo" v-if="!atendimentoAtivo.informacoes || caso == 206 || caso == 404">
        <i class="fas fa-info-circle"></i>
        <h1 title="Informacoes"> Informacoes </h1>
      </div>
      <!-- Caso haja informacoes -->
      <div class="container-principal-informacoes" v-if="atendimentoAtivo.informacoes && (caso == 200 || caso == '')">
        <div class="informacoes-titulo" id="informacoes-titulo">
          <i class="fas fa-info-circle"></i>
          <!-- Lista de Informacoes Superiores -->
          <div class="informacoes-superiores-container">
            <!-- ID -->
            <div v-if="atendimentoAtivo.id" class="informacoes-item">
              <div class="informacoes-item-titulo">
                <i class="fas fa-phone-alt"></i>
                <p> Telefone </p>
              </div>
              <p> {{ formataTelefone(atendimentoAtivo.id) }} </p>
            </div>
            <!-- Repre -->
            <div v-if="atendimentoAtivo.representante" class="informacoes-item">
              <div class="informacoes-item-titulo">
                <i class="fas fa-tag"></i>
                <p> Representante </p>
              </div>
              <p> {{ atendimentoAtivo.representante }} </p>
            </div>
            <!-- Tempo Conectado -->
            <div v-if="atendimentoAtivo.hora_cliente_ini" class="informacoes-item">
              <div class="informacoes-item-titulo">
                <i class="fas fa-user-clock"></i>
                <p> Tempo Conectado </p>
              </div>
              <p> {{ formataHorario(atendimentoAtivo.tempo_conectado) }} </p>
            </div>
            <!-- Tempo de Fila -->
            <div v-if="atendimentoAtivo.hora_fila_ini" class="informacoes-item">
              <div class="informacoes-item-titulo">
                <i class="fas fa-clock"></i>
                <p> Tempo de Fila </p>
              </div>
              <p> {{ formataHorario(atendimentoAtivo.fila_diff) }} </p>
            </div>
          </div>
        </div>
        <!-- Corpo informacoes -->
        <div class="lista-informacoes-container">
          <div class="iframe-informacoes">
            <IframeTemplate v-if="atendimentoAtivo.url" />
          </div>
        </div>
        <!-- Iframe Msg Tipo 2 -->
        <div id="iframe-msg-container" v-if="abrirMsgTipo2">
          <!-- Iframe do Caio -->
          <!-- {{ `${baseUrl}im/atdHumano/view/atd_valida.php?grupo=${grupo}&categoria=${categoria}&assunto=${assunto}&nro_chat=${nroChat}` }} -->
          <iframe :src="`${baseUrl}im/atdHumano/view/atd_valida.php?grupo=${grupo}&categoria=${categoria}&assunto=${assunto}&nro_chat=${nroChat}${teste}`" frameborder="0"></iframe> <!-- tipo_popup=AJ2& -->
        </div>
        <!-- Rodape - Botoes Acoes -->
        <!-- <div class="container-acoes">
          <BotoesAcoes />
        </div> -->
      </div>
      <!-- Caso não haja informacoes -->
      <div class="lista-informacoes-container-vazio" v-else-if="!atendimentoAtivo.informacoes || caso == 400 || caso == 206">
        <div>
          <i class="far fa-folder-open"></i>
          <p>
            Sem informacoes para mostrar
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import BotoesAcoes from '../BotoesAcoes'
import IframeTemplate from './IframeTemplate'

export default {
  data(){
    return{
      baseUrl: '',
      teste
    }
  },
  components: {
    BotoesAcoes,
    IframeTemplate
  },
  methods: {
    formataNome(nome){
      if(!nome){ return '' }

      nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, function(capitalize) { return capitalize.toUpperCase() })
      return nome
    },
    formataTelefone(telefone){
      if(!telefone){ return '' }

      telefone = "+"+telefone.slice(0,2)+" ("+telefone.slice(2,4)+") "+telefone.slice(4, 9)+"-"+telefone.slice(9, telefone.length)
      return telefone
    },
    formataHorario(horas){
      if(!horas){ return '' }
      let date = new Date(0);
      date.setMinutes(horas.i)
      date.setSeconds(horas.s)
      let timeString = date.toISOString().substr(11, 8);
      timeString = timeString.replace(/\d+:/, horas.h.toString().padStart(2, 0) + ':')
      return timeString
    },
    getBaseUrl(){
      this.teste = `&teste=${window.location.hostname}`

      if(window.location.hostname == 'localhost'){
        this.baseUrl = 'https://linux03/'
      }else{
        this.baseUrl = 'https://'+window.location.hostname+'/'
      }
    }
  },
  mounted(){
    this.getBaseUrl()
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
      caso: 'getCaso',
      abrirMsgTipo2: 'getAbrirMsgTipo2',
      grupo: 'getGrupo',
      categoria: 'getCategoria',
      assunto: 'getAssunto',
      nroChat: 'getNroChat'
    })
  },
}
</script>

<style>

</style>