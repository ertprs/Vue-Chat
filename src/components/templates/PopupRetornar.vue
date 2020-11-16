<template>
  <div class="popup-container">
    <ul 
      lista-retornar
      class="popup-lista" 
      :class="{'bg' : bg}"
      v-if="!pessoalData">
      <li @click="retornar('todos')"> {{ dicionario.btn_todos }} </li>
      <li @click="retornar('pessoal')"> {{ dicionario.btn_pessoal }} </li>
      <li @click="pessoalData = true"> {{ dicionario.btn_agendar }} </li>
    </ul>
    <div 
      agendar-retorno
      v-if="pessoalData"
      class="popup-container-tela-2">
      <datetime 
        v-model="dataHora"
        :placeholder="dicionario.placeholder_select_data_hora"
        zone="America/Bahia"
        :min-datetime="setData('minimo')"
        :max-datetime="setData('maximo')"
        :phrases="{ok: dicionario.btn_continuar_select_data_hora, cancel: dicionario.btn_fechar_select_data_hora}"
        class="theme-custom"
        type="datetime" />
      <ul 
        class="btns-confirmacao-container popup-lista"
        :class="{'bg' : bg}">
        <li class="btn-confirmacao cancelar" @click="fecharPopup()"> {{ dicionario.btn_cancelar }} </li>
        <li class="btn-confirmacao confirmar" @click="retornar('pessoal/data')"> {{ dicionario.btn_confirmar }} </li>
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
      reqEmAndamento: false
    }
  },
  computed: {
    ...mapGetters({
      bg: 'getBgPopup',
      atendimentoAtivo: "getAtendimentoAtivo",
      abrirPopup: "getAbrirPopup",
      reqTeste: "getReqTeste",
      todosAtendimentos: "getTodosAtendimentos",
      dicionario: "getDicionario"
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
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})
                this.removerCliente()
                this.$root.$emit("reverter-cores")
              }
            })
            .catch(error => {
              console.log('error suspend todos: ', error)
              this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_retorno})
            })
        break;
        case "pessoal":
          
          dados.destino = "dedicado"

          axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})

                this.$store.commit("adicionarCliAguardando", this.atendimentoAtivo)

                this.removerCliente()
                this.$root.$emit("reverter-cores")
              }
            })
            .catch(error => {
              console.log('error suspend pessoal: ', error)
              this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_retorno})
            })
        break;
        case "pessoal/data":

          if(this.dataHora == ""){
            this.$toasted.global.defaultError({msg: this.dicionario.msg_data_incorreta})
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
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})
                this.removerCliente()
                this.$root.$emit("reverter-cores")
                
                this.reqAgenda()
              }
            })
            .catch(error => {
              console.log('error suspend pessoal/data: ', error)
              this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_retorno})
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