<template>
  <div id="informacoes" class="resizable-content">
    <!-- Título -->
    <div class="informacoes-titulo tamanho-titulos" v-if="!atendimentoAtivo.informacoes || caso == 206 || caso == 400">
      <i class="fas fa-info-circle"></i>
      <h1 title="Informacoes"> Informacoes </h1>
    </div>
    <!-- Caso haja informacoes -->
    <div class="container-principal-informacoes" v-if="atendimentoAtivo.informacoes && (caso == 200 || caso == '')">
      <div class="informacoes-titulo tamanho-titulos" id="informacoes-titulo">
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
      <div class="iframe-msg-container" v-if="abrirMsgTipo2">
        <!-- Iframe do Caio -->
        <!-- {{ `${baseUrl}im/atdHumano/view/atd_valida.php?grupo=${grupo}&categoria=${categoria}&assunto=${assunto}&nro_chat=${nroChat}` }} -->
        <div class="informacoes-load-container" v-if="gif">
          <div class="load">
            <i class="fas fa-hourglass-end"></i>
            <p> Carregando </p>
          </div>
        </div>
        <iframe 
          :src="`${baseUrl}im/atdHumano/view/atd_valida.php?grupo=${grupo}&categoria=${categoria}&assunto=${assunto}&nro_chat=${nroChat}${teste}`" frameborder="0"
          @load="gif = false"
          @loadstart="gif = true"
          > </iframe> <!-- tipo_popup=AJ2& -->
      </div>
    </div>
    <!-- Iframe Chamar Cliente -->
    <!-- <div class="iframe-msg-container" v-if="iframeCttAtivo && caso !== 400">
      <div class="informacoes-load-container" v-if="gif">
        <div class="load">
          <i class="fas fa-hourglass-end"></i>
          <p> Carregando </p>
        </div>
      </div>
      <span v-if="!gif" class="btn-fechar-ctt-cliente" @click="fecharIframeCttAtivo()">
        <i class="fas fa-times-circle"></i>
      </span>
      <iframe 
        :src="`${baseUrl}im/atdHumano/view/atd_contato_atv.php`" frameborder="0"
        @load="gif = false"
        @loadstart="gif = true"
        > </iframe>
    </div> -->
    <!-- Caso não haja informacoes -->
    <div class="lista-informacoes-container-vazio" v-else-if="!atendimentoAtivo.informacoes || caso == 400 || caso == 206"> <!-- !iframeCttAtivo -->
      <div>
        <i class="far fa-folder-open"></i>
        <p>
          Sem informacoes para mostrar
        </p>
      </div>
    </div>
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
      teste: '',
      gif: true
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
      
      if(window.location.hostname == 'localhost'){
        this.baseUrl = 'https://linux03/'
        this.teste = `&teste=${window.location.origin}`
      }else{
        this.baseUrl = 'https://'+window.location.hostname+'/'
      }
    },
    fecharIframeCttAtivo(){
      this.$store.dispatch('setIframeCttAtivo', false)
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
      nroChat: 'getNroChat',
      iframeCttAtivo: 'getIframeCttAtivo'
    })
  },
}
</script>

<style>

</style>