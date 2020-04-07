<template>
  <div id="chat-cliente" v-if="zonaDeTeste" v-on:keyup.esc="abrirChatCliente = false" tabindex="1">

    <div class="chat-cliente-tester" v-show="abrirChatCliente">
      <div class="chat-cliente-tester-titulo">
        <i class="fas fa-user-cog"></i>
        <h1> Simular Cliente </h1>
      </div>
      <ChatCorpo id="chat-cliente" />
      <b-form-textarea
        v-on:keyup.enter="enviarMensagem()"
        id="textarea-cliente"
        v-model="mensagem"
        placeholder="Digite sua mensagem e tecle Enter para enviar"
        rows="4"
        no-resize
        >
      </b-form-textarea>
      <span class="caracteres-disponiveis"> ({{ qtdCaracteresDisponiveis - mensagem.length }}) </span>
    </div>

    <div class="chat-cliente-btn" v-on:click="abrirChatCliente = !abrirChatCliente" v-html="!abrirChatCliente ? chaveDeBoca : fechar">

    </div>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'

import ChatCorpo from './ChatCorpo'

export default {
  data(){
    return{
      abrirChatCliente: false,
      mensagem: '',
      chaveDeBoca: '<i class="fas fa-wrench"></i>',
      fechar: '<i class="fas fa-times"></i>',
      qtdCaracteresDisponiveis: 1500
    }
  },
  components: {
    ChatCorpo
  },
  methods:{
    ...mapMutations(['setTodasMensagens', 'setClienteMandouMensagem']),

    enviarMensagem(){
      if(this.validaMensagem()){

        this.setTodasMensagens(this.criaObjMensagem())
        this.setClienteMandouMensagem(true)
    
        this.mensagem = ''
      }
    },
    validaMensagem(){
      let msg = this.mensagem
      
      if(msg.length === 0 || !msg.trim()){
        this.mensagem = ''
        return false
      }else{
        this.mensagem = msg.trim()
        return true;
      }
    },
    criaObjMensagem(){
      const hora = this.formataHoraAtual()

      let objMensagem = {
        autor: 'Cliente', // Operador, Cliente
        origem: 'outros', // principal e outros
        msg: this.mensagem,
        horario: hora,
        status: 'enviado'
      }

      return objMensagem
    },
    formataHoraAtual(){
      let data = new Date()
      
      let hora = data.getHours()
      hora = hora < 10 ? '0'+hora : hora

      let minutos = data.getMinutes()
      minutos = minutos < 10 ? '0'+minutos : minutos

      const horaFormatada = hora + 'h' + minutos

      return horaFormatada
    }
  },
  computed: {
    ...mapGetters({
      zonaDeTeste: 'getZonaDeTeste',
      todasMensagens: 'getTodasMensagens'
    })
  }
}
</script>