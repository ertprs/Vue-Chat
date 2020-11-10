<template>
  <div class="popup-container">
    <ul 
      lista-retornar
      class="popup-lista" 
      :class="{'tres-mais' : ajustar, 'bg' : bg}"
      v-if="!pessoalData">
      <li @click="retornar('todos')"> Todos </li>
      <li @click="retornar('pessoal')"> Pessoal </li>
      <li @click="pessoalData = true"> Agendar </li>
    </ul>
    <div 
      agendar-retorno
      v-if="pessoalData"
      class="popup-container-tela-2">
      <datetime 
        v-model="dataHora"
        placeholder="Selecione uma data e hora"
        zone="America/Bahia"
        :min-datetime="setData('minimo')"
        :max-datetime="setData('maximo')"
        :phrases="{ok: 'Continuar', cancel: 'Fechar'}"
        class="theme-custom"
        type="datetime" />
      <ul 
        class="btns-confirmacao-container popup-lista"
        :class="{'bg' : bg}">
        <li class="btn-confirmacao cancelar" @click="fecharPopup()"> Cancelar </li>
        <li class="btn-confirmacao confirmar" @click="retornar('pessoal/data')"> Confirmar </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Datetime } from 'vue-datetime';

import { mapGetters } from "vuex"

import axios_api from "@/services/serviceAxios"

export default {
  data(){
    return{
      pessoalData: false,
      dataHora: '',
      ajustar: false,
      reqEmAndamento: false
    }
  },
  mounted(){
    this.tamanhoChat()
  },
  computed: {
    ...mapGetters({
      bg: 'getBgPopup',
      atendimentoAtivo: "getAtendimentoAtivo",
      abrirPopup: "getAbrirPopup",
      reqTeste: "getReqTeste",
      todosAtendimentos: "getTodosAtendimentos"
    })
  },
  components: {
    'datetime' : Datetime
  },
  methods: {
    retornar(tipo){
      if(this.reqEmAndamento){
        return
      }else{
        this.reqEmAndamento = true
      }

      setTimeout(() => {
        this.reqEmAndamento = false
      }, 1000)

      let dados = {
        token_cliente: this.atendimentoAtivo.token_cliente
      }

      switch(tipo){
        case "todos":
          dados.destino = "universal"
          axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: "Retorno realizado"})
                this.removerCliente()
                this.$root.$emit("reverter-cores")
              }
            })
            .catch(error => {
              console.log('error suspend todos: ', error)
              this.$toasted.global.defaultError({msg: "N\u00e3o foi poss\u00edvel realizar o retorno"})
            })
        break;
        case "pessoal":
          
          dados.destino = "dedicado"

          axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: "Retorno realizado"})

                this.$store.commit("adicionarCliAguardando", this.atendimentoAtivo)

                this.removerCliente()
                this.$root.$emit("reverter-cores")
              }
            })
            .catch(error => {
              console.log('error suspend pessoal: ', error)
              this.$toasted.global.defaultError({msg: "N\u00e3o foi poss\u00edvel realizar o retorno"})
            })
        break;
        case "pessoal/data":

          if(this.dataHora == ""){
            this.$toasted.global.defaultError({msg: "Selecione uma data e hora valida"})
            return
          }

          let data = this.dataHora.slice(0, 10)
          let hora = this.dataHora.slice(11, 19)

          let horaAux = hora[0]+hora[1]
          horaAux = parseInt(horaAux) - 3

          hora = horaAux + hora.slice(2)

          dados.destino = "dedicado"
          dados.data = data
          dados.hora = hora

          axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: "Retorno realizado"})
                this.removerCliente()
                this.$root.$emit("reverter-cores")
                
                this.reqAgenda()
              }
            })
            .catch(error => {
              console.log('error suspend pessoal/data: ', error)
              this.$toasted.global.defaultError({msg: "N\u00e3o foi poss\u00edvel realizar o retorno"})
            })
        break;
        default:
        break;
      }

      this.fecharPopup()
    },
    reqAgenda(){
      axios_api.get(`get-agenda?${this.reqTeste}`)
        .then(response => {
          const arrAgenda = response.data.ret
          if(arrAgenda.length){
            this.$store.dispatch("setAgenda", arrAgenda)
          }
        })
        .catch(error => {
          console.log("error get agenda: ", error)
        })
    },
    removerCliente(){
      
      let objAtdAux = {}
      for(let ramal in this.todosAtendimentos){
        if(this.todosAtendimentos[ramal].login_usu != this.atendimentoAtivo.login_usu){
          objAtdAux[ramal] = this.todosAtendimentos[ramal]
        }
      }
      
      this.$store.dispatch("setAtendimentos", objAtdAux)
      if(!objAtdAux){
        this.$store.dispatch("setCaso", 206)
      }
      
      this.$store.dispatch('limparAtendimentoAtivo')
      this.$store.dispatch('limparIdAtendimentoAtivo')

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
    fecharPopup(){
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