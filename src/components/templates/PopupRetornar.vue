<template>
  <div class="popup-container">
    <ul 
      lista-retornar
      class="popup-lista" 
      :class="{'tres-mais' : ajustar, 'bg' : bg}"
      v-if="!pessoalData">
      <li @click="retornar('todos'), fecharPopup()"> Todos </li>
      <li @click="retornar('pessoal'), fecharPopup()"> Pessoal </li>
      <li @click="pessoalData = true"> Pessoal/Data </li>
    </ul>
    <div 
      agendar-retorno
      v-if="pessoalData"
      class="popup-container-tela-2">
      <input type="datetime-local" :min="setData('minimo')" :max="setData('maximo')" v-model="dataHora" />
      <ul 
        class="btns-confirmacao-container"
        :class="{'bg' : bg}">
        <li class="btn-confirmar" @click="retornar('pessoal/data'), fecharPopup()"> Confirmar </li>
        <li class="btn-cancelar" @click="fecharPopup()"> Cancelar </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import axios_api from "../../services/serviceAxios"

export default {
  data(){
    return{
      pessoalData: false,
      dataHora: '',
      ajustar: false
    }
  },
  mounted(){
    this.tamanhoChat()
  },
  computed: {
    ...mapGetters({
      bg: 'getBgPopup',
      atendimentoAtivo: "getAtendimentoAtivo",
      abrirPopup: "getAbrirPopup"
    })
  },
  methods: {
    retornar(tipo){
      let dados = {
        token_cliente: this.atendimentoAtivo.token_cliente
      }

      switch(tipo){
        case "todos":
          dados.destino = "universal"
          axios_api.put("suspend", dados)
            .then(response => {
              if(response.status == 200){
                console.log('Sucesso: ', response)
                this.$toasted.global.defaultSuccess({msg: "Retorno realizado"})
              }
            })
            .catch(error => {
              console.log('error suspend todos: ', error)
              this.$toasted.global.defaultError({msg: "Não foi possível realizar o retorno"})
            })
        break;
        case "pessoal":
          dados.destino = "decidado"
          axios_api.put("suspend", dados)
            .then(response => {
              if(response.status == 200){
                console.log('Sucesso: ', response)
                this.$toasted.global.defaultSuccess({msg: "Retorno realizado"})
              }
            })
            .catch(error => {
              console.log('error suspend pessoal: ', error)
              this.$toasted.global.defaultError({msg: "Não foi possível realizar o retorno"})
            })
        break;
        case "pessoal/data":
          let data = dataHora.slice(0, 10)
          let hora = dataHora.slice(11)

          dados.destino = "decidado"
          dados.data = data
          dados.hora = hora

          axios_api.put("suspend", dados)
            .then(response => {
              if(response.status == 200){
                console.log('Sucesso: ', response)
                this.$toasted.global.defaultSuccess({msg: "Retorno realizado"})
              }
            })
            .catch(error => {
              console.log('error suspend pessoal/data: ', error)
              this.$toasted.global.defaultError({msg: "Não foi possível realizar o retorno"})
            })
        break;
        default:
        break;
      }
    },
    tamanhoChat(){
      const widthChat = localStorage.getItem('largura-chat')
      if(widthChat){
        if(widthChat < '400px'){
          this.ajustar = true
        }else{
          this.ajustar = false
        }
      }else{
        this.ajustar = false
      }
    },
    setData(opt){
      let data = new Date()
      let dia = data.getDate()
      let mes = data.getMonth() + 1
      let ano = data.getFullYear()
      let hora = data.getHours()
      let minutos = data.getMinutes()

      if(dia < 10){
        dia = '0'+dia
      }
      if(mes < 10){
        mes = '0'+mes
      }
      if(hora < 10){
        hora = '0'+hora
      }
      if(minutos < 10){
        minutos = '0'+minutos
      }

      if(opt == 'minimo'){
        let agora = ano + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos + ':00'
        return agora
      }else{
        mes = parseInt(mes)
        mes += 1

        if(mes < 10){
          mes = '0'+mes
        }

        let agora = ano + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos + ':00'
        return agora
      }
    },
    fecharPopup(event){
      this.$store.dispatch('setBlocker', false)
      this.$store.dispatch('setAbrirPopup', false)
      this.pessoalData = false
      this.dataHora = ""
    }
  }
}
</script>

<style>

</style>