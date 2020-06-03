<template>
  <div id="todos-contatos"  v-if="clienteMandouMensagem">
    <div class="titulo-contatos">
      <h1>
        <i class="fas fa-address-book"></i>
        Contatos
      </h1>
    </div>
    <ul>
      <li v-for="(atd, indice) in atendimentosAbertos.atendimentos" :key="atd.id"
        @click="ativarConversa( atd.id ); exibirInformacoes( atd )">
        <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i>
        {{ atd.informacoes.nome }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapMutations } from "vuex";

export default {
  created: function() {
    // console.log( this.atendimentosAbertos )
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: 'getClienteMandouMensagem',
      objetoContato: 'getTodasMensagens',
      atendimentosAbertos: 'getAtendimentosAbertos'
    })
  },
  methods: {
    ...mapMutations(["setAtendimentoAtivo"]),
    ativarConversa: function( id ) {
      // console.log( id )
    },
    exibirInformacoes: function( objInformacoes ) {
      // console.log( objInformacoes )
      this.setAtendimentoAtivo( objInformacoes )
    }
  }
}
</script>

<style>

</style>