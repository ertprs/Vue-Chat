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
        <div class="rodape-botoes-botao botao-encerrar" title="Encerrar" v-on:click="encerrarAtendimento()">
          <i class="fas fa-sign-out-alt"></i>
          <span> Encerrar </span>
        </div>
      </div>
      <Popup v-if="blocker" :titulo='titulo' />
  </div>
</template>

<script>
import axios from 'axios'
import axios_api from '../services/axios_api'
import Popup from './templates/Popup'

import {mapGetters,  mapMutations } from 'vuex'

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
  methods: {
    ...mapMutations(['setBlocker']),
    checaBlocker(criar){
      if(criar){
        this.setBlocker(true)
      }else{
        this.setBlocker(false)
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
    ...mapMutations(['limparAtendimentoAtivo']),
    encerrarAtendimento(){
      if( this.atendimentoAtivo.informacoes.nome != null ) {
        this.finalizarAtendimentoNaApi(this.atendimentoAtivo.id)
        this.limparAtendimentoAtivo()

        setTimeout(
          () => {
            this.$root.$emit('buscaAtendimentos')
          }, 500
        )
      } else {
        this.$toasted.global.defaultError({msg: 'Selecione um cliente antes de tentar finalizar o atendimento'})
      }
    },
    async finalizarAtendimentoNaApi(id) {
      let data = { "token_cliente": this.atendimentoAtivo.token_cliente }
      await axios_api.delete('end-atendimento', {data: {...data}})

    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
      blocker: 'getBlocker'
    })
  }
}
</script>

<style>

</style>