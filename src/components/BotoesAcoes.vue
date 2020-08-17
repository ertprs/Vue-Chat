<template>
  <div id="rodape-botoes-encerramento-container">
    <div class="rodape-botoes-encerramento">
        <div class="rodape-botoes-botao botao-transferencia" :title="titulos[0]" v-on:click="abrirTransferir()">
          <i class="fas fa-random"></i>
          <span>{{ titulos[0] }}</span>
        </div>
        <div class="rodape-botoes-botao botao-retornar" :title="titulos[1]" v-on:click="retornarForm()">
          <i class="fas fa-undo"></i>
          <span>{{ titulos[1] }}</span>
        </div>
        <div class="rodape-botoes-botao botao-encerrar" title="Encerrar" v-on:click="popupEncerrar()">
          <i class="fas fa-sign-out-alt"></i>
          <span> Encerrar </span>
        </div>
      </div>
      <Popup v-if="blocker && titulo && origemBlocker == 'btn-acoes'" :titulo='titulo' />
  </div>
</template>

<script>
import axios from 'axios'
import axios_api from '../services/axios_api'
import Popup from './templates/Popup'

import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      titulos: ['Transferir', 'Retornar'],
      titulo: ''
    }
  },
  components: {
    Popup
  },
  mounted(){
    this.$root.$on('encerrarAtendimento', () => {
      this.encerrarAtendimento()
    })
  },
  methods: {
    checaBlocker(criar){
      this.$store.dispatch('setOrigemBlocker', 'btn-acoes')
      if(criar){
        this.$store.dispatch('setBlocker', true)
      }else{
        this.$store.dispatch('setBlocker', false)
      }
    },
    abrirTransferir(){
      this.checaBlocker(true)
      this.titulo = 'Transferir'
    },
    retornarForm(){
      this.titulo = 'Retornar'
      this.checaBlocker(true)
    },
    popupEncerrar(){
      this.titulo = 'Encerrar'
      this.checaBlocker(true)
    },
    async encerrarAtendimento() {
      if( this.atendimentoAtivo.informacoes.nome != null ) {
        await this.finalizarAtendimentoNaApi()

        this.$store.dispatch('limparAtendimentoAtivo')

        var novosAtendimentos = {}
        for(var ramal_local in this.todosAtendimentos) {
          if(this.todosAtendimentos[ramal_local].id_cli !== this.idAtendimentoAtivo) {
            novosAtendimentos[ramal_local] = this.todosAtendimentos[ramal_local]
          }
        }
        this.$root.$off('atualizar_mensagem', this.criaObjMensagem)
        this.$store.dispatch('setAtendimentos', novosAtendimentos)
      } else {
        this.$toasted.global.defaultError({msg: 'Selecione um cliente antes de tentar finalizar o atendimento'})
      }
    },
    async finalizarAtendimentoNaApi() {
      let data = { "token_cliente": this.atendimentoAtivo.token_cliente }
      await axios_api.delete('end-atendimento', {data: {...data}})

    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
      blocker: 'getBlocker',
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      origemBlocker: 'getOrigemBlocker'
    })
  }
}
</script>

<style>

</style>