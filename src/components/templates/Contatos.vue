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
        :id="'li_'+indice"
        @click="ativarConversa( atd.id ); exibirInformacoes( atd, indice )">
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
      fechado: false,
      arrAtivos: []
    }
  },
  watch: {
    atendimentosAbertos(){
      if(this.atendimentosAbertos){
        if(this.atendimentosAbertos.atendimentos){
          this.preencheAtivos()
        } 
      }
    }
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: 'getClienteMandouMensagem',
      objetoContato: 'getTodasMensagens',
      atendimentosAbertos: 'getAtendimentosAbertos',
    })
  },
  methods: {
    ...mapMutations(["setAtendimentoAtivo"]),
    ativarConversa: function( id ) {
      // console.log( id )
    },
    exibirInformacoes: function( objInformacoes, indice ) {
      // console.log( objInformacoes )
      this.setAtendimentoAtivo( objInformacoes )

      this.controlaAtivos(indice)
    },
    toggleContatos(){
      this.rotate = !this.rotate
      this.fechado = !this.fechado
    },
    preencheAtivos(){
      for(let i = 0; i < this.atendimentosAbertos.atendimentos.length; i++){
        this.arrAtivos[i] = { ativo: 'N' }
      }
    },
    controlaAtivos(indice){
      if(this.arrAtivos[indice]){
        this.arrAtivos[indice].ativo = 'S'
        let arrLi = []
        for(let i = 0; i < this.arrAtivos.length; i++){
          arrLi[i] = document.querySelector('#li_'+i)
          if(arrLi[i].children[1]){
            if( i !== indice ){
              arrLi[i].children[1].remove()
            }
          }else if(i == indice){
            const spanAtivo = document.createElement('span')
            spanAtivo.classList.add('ativo')
            const li = document.querySelector('#li_'+indice)
            li.insertAdjacentElement('beforeend', spanAtivo)
          }
        }
      }
    }
  }
}
</script>

<style>

</style>