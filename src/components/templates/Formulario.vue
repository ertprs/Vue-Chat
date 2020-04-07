<template>
  <div id="formulario-container">
    <div class="formulario-titulo">
      <i class="fas fa-user-check"></i>
      <h1> Logar como Cliente </h1>
    </div>
    <div class="formulario-cliente">
    <b-form>  
      <b-form-group
        id="nome-cliente"
        label="Nome do Cliente: "
        label-for="input-nome-cliente">
        <b-form-input
          id="input-nome-cliente"
          v-model="objCliente.usuNome"
          required
          placeholder="Digite o nome do cliente">
        </b-form-input>
      </b-form-group>
      
      <b-form-group
        id="numero-cliente"
        label="Número do Cliente: "
        label-for="input-numero-cliente">
        <b-form-input
          id="input-numero-cliente"
          v-model="objCliente.usuLogin"
          required
          placeholder="Digite o número do cliente">  
        </b-form-input>
      </b-form-group>
      
      <b-form-group
        id="token-cliente"
        label="Token do Cliente: "
        label-for="input-token-cliente">
        <b-form-input
          id="input-token-cliente"
          v-model="objCliente.token_acesso"
          required
          placeholder="Digite o token do cliente">
        </b-form-input>
      </b-form-group>
      
      <b-form-group
        id="id-cliente"
        label="ID do Cliente: "
        label-for="input-id-cliente">
        <b-form-input
          id="input-id-cliente"
          v-model="objCliente.id"
          required
          placeholder="Digite o ID do cliente">
        </b-form-input>
      </b-form-group>
      
      <b-button block @click="enviarParaAPI()" variant="outline-primary">Enviar</b-button>
    </b-form>
    </div>

    <div class="gif-container" v-if="ativarGif">
      <div class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations } from "vuex"

import axios from 'axios'

export default {
  data(){
    return{
      objCliente: {
        token_acesso: "AzjEnPzX1L5s04WrfLfogEFqqjyB7tNQ44l5SqzcurZIIX2VkeUq10YpKyRY3RzE",
        usuLogin: '5511994988111',
        usuNome: "Augusto Teste API",
        id: "ALLAN CARLOS Agua FILHO¢15193242863¢CAMPINAS 02¢TATUAPE¢663689¢P & H7 RED BLACK CORR DE SEGS LTDA EPP"
      },
      ativarGif: false
    }
  },
  methods: {
    ...mapMutations(['setFormularioCliente']),

    async enviarParaAPI(){

      this.objCliente = JSON.stringify(this.objCliente)

      await axios.post("http://linux03/webservices/intergrall-api/atd-im/inicia-atendimento-ope", this.objCliente)
        .then(
          response => {
            if(response.data.st_ret == 'OK'){
              this.ativarGif = true
              this.salvarTokenNoLocalStorage(this.objCliente.token_acesso)
              setTimeout(() => {
                this.ativarGif = false
                this.setFormularioCliente(true)
              }, 2000);
            }else{
              console.log("FORMULARIO STATUS NOK: ", response.data)
            }
          }
        )
        .catch(
          error => {
            if(!document.querySelector('.toasted.toasted-primary.error')){
              this.$toasted.global.defaultError()
            }
            console.log(error)
          }
        )
    },
    salvarTokenNoLocalStorage(token){
      localStorage.setItem('token', token)
    },
    verificaSeHaTokenNoLocalStorage(){
      if(localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined'){
        this.setFormularioCliente(true)
      }
    }
  },
  mounted(){
    this.verificaSeHaTokenNoLocalStorage()
  }
}
</script>