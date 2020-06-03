<template>
  <div class="chat-opcoes">
      <div class="chat-opcoes-titulo">
        <p :title="chatTitulo"> {{ chatTitulo }} </p>
        <span> Nome do Cliente </span>
      </div>
      <!-- <div class="chat-opcoes-infos" v-on:click="toggleInformacoes()">
        <p> Clique para Visualizar as Informacoes do Cliente </p>
      </div> -->
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
    // ...mapMutations(['setInformacoesAberto']),
    // toggleInformacoes(){
    //   let divInformacoes = document.querySelector('#informacoes')
    //   divInformacoes.classList.toggle('abrir-informacoes')

    //   this.setInformacoesAberto(!this.informacoesAberto)
    // }
  },
  computed: {
    // ...mapGetters({
    //   informacoesAberto: 'getInformacoesAberto'
    // })
  }
}
</script>