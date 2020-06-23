<template>
  <div id="rodape-botoes-encerramento-container">  
    <div class="rodape-botoes-encerramento">
        <div class="rodape-botoes-botao botao-transferencia" title="Transferir" v-on:click="abrirTransferir()">
          <i class="fas fa-random"></i>
          <span> Transferir </span>
        </div>
        <div class="rodape-botoes-botao botao-retornar" title="Retornar" v-on:click="retornarForm()">
          <i class="fas fa-undo"></i>
          <span> Retornar </span>
        </div>
        <div class="rodape-botoes-botao botao-encerrar" title="Encerrar" v-on:click="encerrarAtendimento()">
          <i class="fas fa-sign-out-alt"></i>
          <span> Encerrar </span>
        </div>
      </div>
      <Popup v-if="blocker" :titulo='titulo' />
      <!-- <Popup v-if="popUpRetorno" :titulo="'Retornar'" />
      <Popup v-if="popUpTransferir" :titulo="'Transferir'" /> -->
  </div>
</template>

<script>
import axios from 'axios'

import Popup from './templates/Popup'

import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      titulo: '',
      blocker: false
    }
  },
  components: {
    Popup
  },
  methods: {
    criaBlocker(){
      let blocker = document.createElement('div')
      blocker.setAttribute('blocker', '')
      blocker.style.width = '100%'
      blocker.style.height = '100%'
      blocker.style.zIndex = 1
      blocker.style.position = 'absolute'
      blocker.style.top = '0'
      blocker.style.left = '0'
      blocker.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
      blocker.style.display = 'flex'
      blocker.style.justifyContent = 'center'
      blocker.style.alignItems = 'center'

      blocker.addEventListener('click', () => {
        this.blocker = false
        blocker.remove()
      })

      document.querySelector('body').insertAdjacentElement('beforeend', blocker)
    },
    checaBlocker(criar){
      let blocker = document.querySelector('[blocker]')
      if(blocker){
        blocker.click()
        if(criar){
          this.criaBlocker(true)
        }
      }else{
        this.criaBlocker()
      }
    },
    abrirTransferir(){
      this.checaBlocker(true)
      this.blocker = true
      this.titulo = 'Transferir'
    },
    retornarForm(){
      this.checaBlocker(true)
      this.blocker = true
      this.titulo = 'Retornar'
      
    },
    ...mapMutations(['limparAtendimentoAtivo']),
    encerrarAtendimento(){
      if( this.atendimentoAtivo.informacoes.nome != null ) {
        this.finalizarAtendimentoNaApi(this.atendimentoAtivo.id )

        const textarea = document.querySelector('#textarea')
        textarea.innerText = 'Mensagem de Encerramento do Atendimento de ' + this.atendimentoAtivo.informacoes.nome

        let btnEnviarMsg = document.querySelector('[enviar-msg]')
        btnEnviarMsg.click()

        this.limparAtendimentoAtivo()

        this.checaBlocker()
      } else {
        alert('Selecione um cliente antes de tentar finalizar o  atendimento')
      }
    },
    finalizarAtendimentoNaApi( id ) {
      let url = 'https://linux03/im/atdHumano/middleware/atd_api.php/end-atendimento'
      axios.delete(url, { data: { id: id } })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
    })
  }
}
</script>

<style>

</style>