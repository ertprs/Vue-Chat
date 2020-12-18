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
          <div class="chat-opcoes-titulo-container--logo">
            <template v-if="!dados.siglas">
              <font-awesome-icon :icon="['fas', 'search']" class="lupa"  @click="chamarIframe" />
              <img v-if="dados.sigla" :src="`${dominio}/callcenter/imagens/ext_top_${dados.sigla}.png`" @click="chamarIframe">
              <font-awesome-icon v-else :icon="['fas', 'comments']" />
            </template>
            <div class="chat-opcoes-informacoes" v-else>
              <img v-for="(sigla, index) in dados.siglas" :key="index"
                :src="`${dominio}/callcenter/imagens/ext_top_${sigla.toLowerCase()}.png`" :alt="sigla" />
              <div @click="fecharCliHist" class="fechar-historico">
                <font-awesome-icon :icon="['fas', 'times-circle']" />
              </div>
            </div>
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
      chatTitulo: 'Chat',
      cor: ""
    }
  },
  methods: {
    fecharCliHist(){
      this.$store.dispatch("setAbrirPreviaCliente", false)
      this.$store.dispatch("setObjPreviaCli", {})

      const arrAtendimentos = Object.values(this.todosAtendimentos)
      if(arrAtendimentos.length){
        this.$root.$emit("ativar-contato", arrAtendimentos[0], [0])
      }
    },
    acionaFormataSigla(letra, acao){
      return formataSigla(letra, acao)
    },
    chamarIframe(){
      this.$root.$emit("abrir-iframe", this.dados.hist)
      this.$store.dispatch("setBlocker", true)
      this.$store.dispatch("setOrigemBlocker", "visualizar-iframe")
    },
    aplicarCor(){
      if(!this.dados.siglas) { return }
      if(!this.regrasDoClienteAtivo.regras){ return }

      this.cor = this.regrasDoClienteAtivo.regras.primary_color
      const titInformacoes = document.querySelector("#titulo-informacoes")
      if(titInformacoes){
        titInformacoes.style.borderBottom = `3px solid ${this.cor}`
      }
    }
  },
  updated(){
    this.aplicarCor()
  },
  computed: {
    ...mapGetters({
      regrasDoClienteAtivo: "getRegrasDoClienteAtivo",
      semIframe: 'getSemIframe',
      dominio: 'getDominio',
      todosAtendimentos: "getTodosAtendimentos"
    })
  }
}

</script>
