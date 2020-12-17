<template>
  <div class="chat-opcoes tamanho-titulos">
      <div class="chat-opcoes-titulo" :class="{'cliente-ativo' : dados}">
        <div class="chat-opcoes-titulo-container">
          <div class="circulo-contatos" v-if="dados.nome_usu">
            <p v-text="acionaFormataSigla(dados.nome_usu[0], 'upper')"></p>
          </div>
          <ul class="chat-opcoes-titulo-container--lista">
            <li :title="dados.nome_usu + ' ' + dados.login_usu">{{ dados.nome_usu }} ({{ dados.login_usu }})</li>
            <li :title="dados.desc_grupo">{{ dados.desc_grupo }}</li>
          </ul>
          <div class="chat-opcoes-titulo-container--logo" v-if="dados.token_cliente">
            <font-awesome-icon :icon="['fas', 'search']" class="lupa"  @click="chamarIframe" />
            <img v-if="dados.sigla" :src="`${dominio}/callcenter/imagens/ext_top_${dados.sigla}.png`" @click="chamarIframe">
            <font-awesome-icon v-else :icon="['fas', 'comments']" />
          </div>
        </div>
      </div>
    </div>
</template>
<script>

import { formataSigla } from "@/services/formatacaoDeTextos"

import { mapGetters } from 'vuex'

export default {
  props: {
    dados: {
      required: true,
      type: Object
    }
  },
  data(){
    return{
      chatTitulo: 'Chat'
    }
  },
  methods: {
    acionaFormataSigla(letra, acao){
      return formataSigla(letra, acao)
    },
    chamarIframe(){
      this.$root.$emit("abrir-iframe", this.atendimentoAtivo.hist)
      this.$store.dispatch("setBlocker", true)
      this.$store.dispatch("setOrigemBlocker", "visualizar-iframe")
    }
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
