<template>
  <div id="todos-contatos"  v-if="clienteMandouMensagem">
    <div class="titulo-contatos">
      <h1>Contatos</h1>
    </div>
    <div v-for="atd in atendimentosAbertos.atendimentos" :key="atd.id">
      <button @click="ativarConversa( atd.id ); exibirInformacoes( atd.informacoes )">{{atd.nome}}</button>
    </div>
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
    ...mapMutations(["setInformacoesDoCliente"]),
    ativarConversa: function( id ) {
      // console.log( id )
    },
    exibirInformacoes: function( objInformacoes ) {
      // console.log( objInformacoes )
      this.setInformacoesDoCliente( objInformacoes )
    }
  }
}
</script>

<style>

</style>