<template>
  <div id="informacoes" :class="{'d-none' : semIframe}">
    <!-- Ti­tulo -->
    <div class="informacoes-titulo tamanho-titulos" id="titulo-informacoes" v-if="!atendimentoAtivo.informacoes || caso == 206 || caso == 400">
      <font-awesome-icon :icon="['fas', 'info-circle']" />
      <h1 :title="dicionario.titulo_informacoes" v-text="dicionario.titulo_informacoes"></h1>
    </div>
    <!-- Caso haja informacoes -->
    <div class="container-principal-informacoes" v-if="atendimentoAtivo.informacoes && (caso == 200 || caso == '')">
      <div class="informacoes-titulo tamanho-titulos" id="informacoes-titulo">
        <font-awesome-icon :icon="['fas', 'info-circle']" />
        <!-- Lista de Informacoes Superiores -->
        <div class="informacoes-superiores-container">
          <!-- ID -->
          <div v-if="atendimentoAtivo.id" class="informacoes-item">
            <div class="informacoes-item-titulo">
              <font-awesome-icon :icon="['fas', 'phone-alt']" />
              <p v-text="dicionario.sub_titulo_telefone"></p>
            </div>
            <p v-text="acionaFormataTelefone(atendimentoAtivo.id)"></p>
          </div>
          <!-- Tempo Conectado -->
          <div v-if="atendimentoAtivo.hora_cliente_ini" class="informacoes-item">
            <div class="informacoes-item-titulo">
              <font-awesome-icon :icon="['fas', 'user-clock']" />
              <p v-text="dicionario.sub_titulo_tempo_conectado"></p>
            </div>
            <p v-text="acionaFormataHorario(atendimentoAtivo.tempo_conectado)"></p>
          </div>
          <!-- Tempo de Fila -->
          <div v-if="atendimentoAtivo.hora_fila_ini" class="informacoes-item">
            <div class="informacoes-item-titulo">
              <font-awesome-icon :icon="['fas', 'clock']" />
              <p v-text="dicionario.sub_titulo_tempo_fila"></p>
            </div>
            <p v-text="acionaFormataHorario(atendimentoAtivo.fila_diff)"></p>
          </div>
        </div>
      </div>
      <!-- Corpo informacoes -->
      <div class="lista-informacoes-container">
        <div class="iframe-informacoes" :class="{'d-none' : controleSemIframeLocal}">
          <IframeTemplate v-if="atendimentoAtivo.url" />
        </div>
      </div>
    </div>
    <!-- Caso nao haja informacoes -->
    <div class="lista-informacoes-container-vazio" v-else-if="!atendimentoAtivo.informacoes || caso == 400 || caso == 206">
      <div>
        <font-awesome-icon :icon="['fas', 'folder-open']" />
        <p v-text="dicionario.msg_sem_informacoes"></p>
      </div>
    </div>
    <!-- Iframe Chamar Cliente -->
    <div class="iframe-msg-container" v-if="iframeCttAtivo">
      <div class="informacoes-load-container" v-if="gif">
        <div class="load">
          <font-awesome-icon :icon="['fas', 'hourglass-end']" />
          <p v-text="dicionario.titulo_carregando"></p>
        </div>
      </div>
      <span v-if="!gif" class="btn-fechar-ctt-cliente" @click="fecharIframeCttAtivo()">
        <font-awesome-icon :icon="['fas', 'times-circle']" />
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

import { formataTelefone, formataHorario } from "@/services/formatacaoDeTextos"

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
    acionaFormataTelefone(telefone){
      return formataTelefone(telefone)
    },
    acionaFormataHorario(horas){
      return formataHorario(horas)
    },
    fecharIframeCttAtivo(){
      this.$store.dispatch('setIframeCttAtivo', false)
    }
  },
  watch: {
    atendimentoAtivo(){
      if(this.atendimentoAtivo){
        if(this.iframeCttAtivo){
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
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: "getAtendimentoAtivo",
      caso: "getCaso",
      iframeCttAtivo: "getIframeCttAtivo",
      dominio: "getDominio",
      semIframe: "getSemIframe",
      dicionario: "getDicionario"
    })
  },
}
</script>

<style>

</style>
