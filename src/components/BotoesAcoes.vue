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
      console.log('atendimentoAtivo: ', this.atendimentoAtivo)
      if( this.atendimentoAtivo.informacoes.nome != null ) {
        
        const textarea = document.querySelector('#textarea')
        textarea.innerText = 'Mensagem de Encerramento do Atendimento de ' + this.atendimentoAtivo.informacoes.nome

        const btnEnviarMsg = document.querySelector('[enviar-msg]')
        btnEnviarMsg.click()

        setTimeout(
          () => {
            const contato = document.querySelector('.ativo')
            contato.remove()
          }, 500
        )

        setTimeout(
          () => {
            this.finalizarAtendimentoNaApi(this.atendimentoAtivo.id )
            this.limparAtendimentoAtivo()
          }, 1000
        )

      } else {
        alert('Selecione um cliente antes de tentar finalizar o  atendimento')
      }
    },
    async finalizarAtendimentoNaApi(id) {
      console.log(id)
      let data = { "token_cliente": this.atendimentoAtivo.token_cliente }
      // let data = {"token_cliente": this.atendimentoAtivo.token_cliente,"message": msg}
      console.log(data)
      await axios_api.delete('end-atendimento', {data: {...data}})
      alert('trava')
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