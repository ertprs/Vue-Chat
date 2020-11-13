<template>
  <div id="informacoes" :class="{'d-none' : semIframe}">
    <!-- Ti­tulo -->
    <div class="informacoes-titulo tamanho-titulos" v-if="!atendimentoAtivo.informacoes || caso == 206 || caso == 400">
      <i class="fas fa-info-circle"></i>
      <h1 :title="dicionario.titulo_informacoes"> {{ dicionario.titulo_informacoes }} </h1>
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
              <p> {{ dicionario.sub_titulo_telefone }} </p>
            </div>
            <p> {{ formataTelefone(atendimentoAtivo.id) }} </p>
          </div>
          <!-- Tempo Conectado -->
          <div v-if="atendimentoAtivo.hora_cliente_ini" class="informacoes-item">
            <div class="informacoes-item-titulo">
              <i class="fas fa-user-clock"></i>
              <p> {{ dicionario.sub_titulo_tempo_conectado }} </p>
            </div>
            <p> {{ formataHorario(atendimentoAtivo.tempo_conectado) }} </p>
          </div>
          <!-- Tempo de Fila -->
          <div v-if="atendimentoAtivo.hora_fila_ini" class="informacoes-item">
            <div class="informacoes-item-titulo">
              <i class="fas fa-clock"></i>
              <p> {{ dicionario.sub_titulo_tempo_fila }} </p>
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
        <div class="informacoes-load-container" v-if="gif">
          <div class="load">
            <i class="fas fa-hourglass-end"></i>
            <p> {{ dicionario.titulo_carregando }} </p>
          </div>
        </div>
        <iframe 
          :src="`${this.dominio}/im/atdHumano/view/atd_valida.php?grupo=${grupo}&categoria=${categoria}&assunto=${assunto}&nro_chat=${nroChat}&${this.reqTeste}`" frameborder="0"
          @load="gif = false"
          @loadstart="gif = true"
          > </iframe> <!-- tipo_popup=AJ2& -->
      </div>
    </div>
    <!-- Caso nao haja informacoes -->
    <div class="lista-informacoes-container-vazio" v-else-if="!atendimentoAtivo.informacoes || caso == 400 || caso == 206"> <!-- !iframeCttAtivo -->
      <div>
        <i class="far fa-folder-open"></i>
        <p>
          {{ dicionario.msg_sem_informacoes }}
        </p>
      </div>
    </div>
    <!-- Iframe Chamar Cliente -->
    <div class="iframe-msg-container" v-if="iframeCttAtivo">
      <div class="informacoes-load-container" v-if="gif">
        <div class="load">
          <i class="fas fa-hourglass-end"></i>
          <p> {{ dicionario.titulo_carregando }} </p>
        </div>
      </div>
      <span v-if="!gif" class="btn-fechar-ctt-cliente" @click="fecharIframeCttAtivo()">
        <i class="fas fa-times-circle"></i>
      </span>
      <iframe 
        :src="`${this.dominio}/im/atdHumano/view/atd_contato_atv.php`" frameborder="0"
        @load="gif = false"
        @loadstart="gif = true"
        > </iframe>
    </div>
  </div>
</template>

<script>
import { gerenciarCores } from "@/services/gerenciarCores"
import { mapGetters } from 'vuex'
import BotoesAcoes from '../BotoesAcoes'
import IframeTemplate from './IframeTemplate'

export default {
  data(){
    return{
      gif: true,
      controleSemIframeLocal: false
    }
  },
  components: {
    BotoesAcoes,
    IframeTemplate
  },
  methods: {
    formataNome(nome){
      if(!nome){ return '' }

      nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, (capitalize) => { return capitalize.toUpperCase() })
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
    fecharIframeCttAtivo(){
      this.$store.dispatch('setIframeCttAtivo', false)
    }
  },
  beforeUpdate(){
    gerenciarCores(this, "informacoes")
  },
  watch: {
    atendimentoAtivo(){
      if(this.atendimentoAtivo){
        if(this.iframeCttAtivo || this.abrirMsgTipo2){
          return
        }

        if(this.atendimentoAtivo.url){
          if(this.atendimentoAtivo.url.indexOf("im_atd_menu") != -1){
            this.$store.dispatch("setSemIframe", true)
            this.controleSemIframeLocal = true
          }else{
            this.$store.dispatch("setSemIframe", false)
            this.controleSemIframeLocal = false
          }
        }
      }
    },
    iframeCttAtivo(){
      if(this.controleSemIframeLocal){
        if(!this.iframeCttAtivo){
          this.$store.dispatch("setSemIframe", true)
        }
      }
    },
    abrirMsgTipo2(){
      if(this.controleSemIframeLocal){
        if(!this.abrirMsgTipo2){
          this.$store.dispatch("setSemIframe", true)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: "getAtendimentoAtivo",
      caso: "getCaso",
      abrirMsgTipo2: "getAbrirMsgTipo2",
      grupo: "getGrupo",
      categoria: "getCategoria",
      assunto: "getAssunto",
      nroChat: "getNroChat",
      iframeCttAtivo: "getIframeCttAtivo",
      dominio: "getDominio",
      reqTeste: "getReqTeste",
      semIframe: "getSemIframe",
      dicionario: "getDicionario"
    })
  },
}
</script>

<style>

</style>