<template>
  <div id="todos-contatos"  :class="{'fechado' : fechado}">
    <div class="titulo-contatos">
      <h1>
        <i class="fas fa-address-book"></i>
        Contatos
      </h1>
      <!-- <div v-on:click="toggleContatos()" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha" ></i>
      </div> -->
    </div>
    <ul :class="{'fechado' : fechado}">
      <li v-for="(atd, indice) in atendimentosAbertos.atendimentos" :key="atd.id"
        @click="ativarConversa( atd.id ); exibirInformacoes( atd )">
        <!-- <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i> -->
        <p :class="indice % 2 == 0 ? '' : ''"> 
          {{ atd.informacoes.nome[0].toUpperCase() }}
        </p>
        {{ atd.informacoes.nome }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapMutations } from "vuex";

export default {
  data(){
    return{
      rotate: false,
      fechado: false
    }
  },
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
    },
    toggleContatos(){
      this.rotate = !this.rotate
      this.fechado = !this.fechado
    }
  }
}
</script>

<style>

</style>