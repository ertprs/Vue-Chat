<template>
  <div class="chat-opcoes tamanho-titulos">
      <div class="chat-opcoes-titulo" :class="{'cliente-ativo' : atendimentoAtivo}">
        <div class="chat-opcoes-titulo-container">
          <div class="circulo-contatos" v-if="atendimentoAtivo.nome_usu">
            <p v-text="acionaFormataSigla(atendimentoAtivo.nome_usu[0], 'upper')"></p>
          </div>
          <ul class="chat-opcoes-titulo-container--lista">
            <li :title="atendimentoAtivo.nome_usu + ' ' + atendimentoAtivo.login_usu">{{ atendimentoAtivo.nome_usu }} ({{ atendimentoAtivo.login_usu }})</li>
            <li :title="atendimentoAtivo.desc_grupo">{{ atendimentoAtivo.desc_grupo }}</li>
          </ul>
          <div class="chat-opcoes-titulo-container--logo">
            <img v-if="atendimentoAtivo.sigla" :src="`${dominio}/callcenter/imagens/ext_top_${atendimentoAtivo.sigla}.png`">
            <font-awesome-icon v-else :icon="['fas', 'fa-comments']" />
          </div>
        </div>
      </div>
    </div>
</template>
<script>

import { formataSigla } from "@/services/formatacaoDeTextos"

import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      chatTitulo: 'Chat'
    }
  },
  methods: {
    acionaFormataSigla(letra, acao){
      return formataSigla(letra, acao)
    },
  },
  watch: {
    semIframe(){
      const chatContainer = document.querySelector("#chat").parentElement
      if(chatContainer){
        if(this.semIframe){
          chatContainer.style.width = "100%"
        }else{
          chatContainer.style.width = "30%"
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
      semIframe: 'getSemIframe',
      dominio: 'getDominio'
    })
  }
}

</script>
