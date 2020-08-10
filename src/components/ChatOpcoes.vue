<template>
  <div class="chat-opcoes">
      <div class="chat-opcoes-titulo">
        <div class="chat-opcoes-titulo-container">
          <div class="circulo-contatos">
            <p>{{ formataSigla(atendimentoAtivo.nome_usu[0], 'upper') }}</p>
          </div>
          <ul class="chat-opcoes-titulo-container--lista">
            <li :title="atendimentoAtivo.nome_usu">{{ atendimentoAtivo.nome_usu }} ({{ atendimentoAtivo.login_usu }})</li>
            <!-- <li :title="atendimentoAtivo.id_cli">ID: </li> -->
            <li :title="atendimentoAtivo.desc_grupo">{{ atendimentoAtivo.desc_grupo }}</li>
          </ul>
          <div class="chat-opcoes-titulo-container--logo">
            <img v-if="atendimentoAtivo.sigla" :src="`http://linux03/callcenter/imagens/ext_top_${atendimentoAtivo.sigla}.png`">
            <i v-else class="fas fa-comments"></i>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      chatTitulo: 'Chat'
    }
  },
  methods: {
    formataSigla(letra, acao){
      if(acao == 'upper'){
        return letra.toUpperCase()
      }else if(acao == 'lower'){
        return letra.toLowerCase()
      }
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}

</script>