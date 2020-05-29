<template>
  <div id="container-botoes">
    <ul>
      <li id="botao-chat" :class="ativo == 'chat' ? 'ativo' : ''" v-on:click="toggleAbaAtiva('chat')">
        <i class="fas fa-comment"></i>
        Chat
      </li>
      <hr>
      <li id="botao-contatos" :class="ativo == 'contatos' ? 'ativo' : ''" v-on:click="toggleAbaAtiva('contatos')">
        <i class="fas fa-address-book"></i>
        Contatos
      </li>
    </ul>
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  data(){
    return{
      ativo: 'chat'
    }
  },
  methods:{
    ...mapMutations(['setAbaAtiva']),
    toggleAbaAtiva(aba){
      this.ativo = aba
      this.setAbaAtiva(aba)
    }
  }
}
</script>

<style>

</style>