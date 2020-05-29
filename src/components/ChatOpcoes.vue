<template>
  <div class="chat-opcoes">
      <div class="chat-opcoes-titulo">
        <p :title="chatTitulo"> {{ chatTitulo }} </p>
        <span> Nome do Cliente </span>
      </div>
      <div class="chat-opcoes-infos" v-on:click="toggleInformacoes()">
        <i class="fas fa-info-circle" title="Clique para Visualizar as Informacoes do Cliente"></i>
        <!-- <i class="fas fa-id-badge" title="Clique para Visualizar as Informacoes do Cliente"></i> -->
        <!-- <p>Visualizar as Informacoes</p> -->
      </div>
    </div>
</template>

<script>

import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      chatTitulo: 'WhatsApp - Sucursal(ATD) - Protocolo 20200268741'
    }
  },
  methods: {
    ...mapMutations(['setInformacoesAberto']),
    toggleInformacoes(){
      let divInformacoes = document.querySelector('#informacoes')
      divInformacoes.classList.toggle('abrir-informacoes')

      this.setInformacoesAberto(!this.informacoesAberto)
    }
  },
  computed: {
    ...mapGetters({
      informacoesAberto: 'getInformacoesAberto'
    })
  }
}
</script>