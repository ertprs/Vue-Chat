<template>
  <div class="popup-container">
    <ul
      lista-retornar
      class="popup-lista"
      :class="{'bg' : bg}"
      v-if="!pessoalData">
      <li @click="retornar('todos')" v-if="temTodos" v-text="btnTodos"></li>
      <li @click="retornar('pessoal')" v-if="temPessoal" v-text="btnPessoal"></li>
      <li @click="pessoalData = true" v-if="temAgendar" v-text="btnAgendar"></li>
    </ul>
    <div
      agendar-retorno
      v-if="pessoalData"
      class="popup-container-tela-2">
      <div class="container-datetimes">
        <datetime
        v-model="data"
        :placeholder="dicionario.placeholder_select_data"
        zone="local"
        value-zone="local"
        :phrases="{ok: dicionario.btn_continuar_select_data_hora, cancel: dicionario.btn_fechar_select_data_hora}"
        class="theme-custom"
        input-class="datetime-date"
        type="date"
        :min-datetime="minData"
        :max-datetime="maxData" />
        <datetime
        v-model="hora"
        :placeholder="dicionario.placeholder_select_hora"
        zone="local"
        value-zone="local"
        :phrases="{ok: dicionario.btn_continuar_select_data_hora, cancel: dicionario.btn_fechar_select_data_hora}"
        class="theme-custom"
        input-class="datetime-hour"
        type="time"
        :min-date="'2020-12-03T08:41:15.534Z'" />
      </div>
      <ul
        class="btns-confirmacao-container popup-lista"
        :class="{'bg' : bg}">
        <li class="btn-confirmacao cancelar" @click="fecharPopup()" v-text="dicionario.btn_cancelar"></li>
        <li class="btn-confirmacao confirmar" @click="retornar('pessoal/data')" v-text="dicionario.btn_confirmar"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Datetime } from 'vue-datetime';

import { mapGetters } from "vuex"

import axios_api from "@/services/serviceAxios"
import { limparIframeUsuarioRemovido } from "@/services/iframe"
import { executandoEncerrar, liberarEncerrar, removerCliente } from "@/services/atendimentos"

export default {
  data(){
    return{
      agora: "",
      hora: "",
      data: "",
      minData: "",
      maxData: "",
      minHora: "",
      pessoalData: false,
      reqEmAndamento: false,
      temTodos: false,
      btnTodos: "",
      temPessoal: false,
      btnPessoal: "",
      temAgendar: false,
      btnAgendar: "",
    }
  },
  computed: {
    ...mapGetters({
      bg: 'getBgPopup',
      atendimentoAtivo: "getAtendimentoAtivo",
      abrirPopup: "getAbrirPopup",
      reqTeste: "getReqTeste",
      todosAtendimentos: "getTodosAtendimentos",
      dicionario: "getDicionario",
      regrasDoClienteAtivo: "getRegrasDoClienteAtivo",
      abaSelecionada: "getAbaSelecionada"
    })
  },
  components: {
    'datetime' : Datetime
  },
  mounted(){
    this.preencherBotoes()
    this.setAgora()
  },
  methods: {
    preencherBotoes(){
      if(this.regrasDoClienteAtivo){
        if(this.regrasDoClienteAtivo.regras){
          const regras = this.regrasDoClienteAtivo.regras
          if(regras.button_suspend){
            const objRegrasSuspend = regras.button_suspend
            if(objRegrasSuspend.todos){
              if(objRegrasSuspend.todos.use == "S"){
                this.temTodos = true
                this.btnTodos = objRegrasSuspend.todos.name
              }
            }

            if(objRegrasSuspend.dedicado){
              if(objRegrasSuspend.dedicado.use == "S"){
                this.temPessoal = true
                this.btnPessoal = objRegrasSuspend.dedicado.name
              }
            }

            if(objRegrasSuspend.agendar){
              if(objRegrasSuspend.agendar.use == "S"){
                this.temAgendar = true
                this.btnAgendar = objRegrasSuspend.agendar.name
              }
            }
          }
        }
      }
    },
    async retornar(tipo){

      if(this.reqEmAndamento){
        return
      }else{
        this.reqEmAndamento = true
      }

      executandoEncerrar()

      let dados = {
        token_cliente: this.atendimentoAtivo.token_cliente
      }

      switch(tipo){
        case "todos":
          dados.destino = "universal"
          await axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})
                this.ativarRemoverCliente()
                this.$root.$emit("reverter-cores")

                this.reqAguardando("todos")
              }
            })
            .catch(error => {
              console.log('error suspend todos: ', error)
              this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_retorno})
            })
        break;
        case "pessoal":

          dados.destino = "dedicado"

          await axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})

                this.$store.commit("adicionarCliAguardando", this.atendimentoAtivo)

                this.ativarRemoverCliente()
                this.$root.$emit("reverter-cores")

                this.reqAguardando("pessoal")
              }
            })
            .catch(error => {
              console.log('error suspend pessoal: ', error)
              this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_retorno})
            })
        break;
        case "pessoal/data":

          if(this.data == "" || this.hora == ""){
            this.$toasted.global.defaultError({msg: this.dicionario.msg_data_incorreta})
            this.reqEmAndamento = false
            return
          }

          let data = this.data.slice(0, 10)
          let hora = this.hora.slice(11, 19)

          if(!this.verificarDataHora(data, hora)){
            this.$toasted.global.defaultError({msg: this.dicionario.msg_data_incorreta})
            this.reqEmAndamento = false
            return
          }

          dados.destino = "dedicado"
          dados.data = data
          dados.hora = hora

          await axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})
                this.ativarRemoverCliente()
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

      liberarEncerrar()

      this.reqEmAndamento = false

      this.fecharPopup()
    },
    reqAguardando(origem){
      axios_api.get(`get-aguardando?${this.reqTeste}&aba=${origem}`)
      .then(response => {
        if(response.data){
          if(response.data.ret){
            const arr = response.data.ret
            if(origem == "pessoal"){
              this.$store.dispatch("setAguardando", arr)
              this.$store.dispatch("setContadorAguardando", arr.length)
            }else{
              this.$store.dispatch("setTodos", arr)
              this.$store.dispatch("setContadorTodos", arr.length)
            }
          }
        }
      })
      .catch(error => {
        console.log('error get aguardando: ', error)
      })
    },
    reqAgenda(){
      axios_api.get(`get-agenda?${this.reqTeste}`)
        .then(response => {
          const arrAgenda = response.data.ret
          this.$store.dispatch("setAgenda", arrAgenda)
        })
        .catch(error => {
          console.log("error get agenda: ", error)
        })
    },
    ativarRemoverCliente(){
      removerCliente()
    },
    fecharPopup(){
      this.$store.dispatch('setBlocker', false)
      this.$store.dispatch('setAbrirPopup', false)
      this.pessoalData = false
      this.hora = ""
    },
    verificarDataHora(data, hora){
      let arrHora = hora.split(':')
      let horaAtual = new Date().getHours()
      let minutosAtual = new Date().getMinutes()
      // Data agendada igual a data de hoje
      if(data == this.agora){
        // Hora atual maior que hora agendada
        if(horaAtual > parseInt(arrHora[0])){
          return false
        // Horas iguais, comparar minutos
        }else if(horaAtual == parseInt(arrHora[0])){
          if(minutosAtual > parseInt(arrHora[1])){
            return false
          }else{
            return true
          }
        // Hora recebida maior que hora atual
        }else{
          return true
        }
      // necessariamente a data sera maior que agora pois ja existe validacao antes disso, logo tudo que entrar aqui eh uma data valida
      }else{
        return true
      }
    },
    setAgora(){
      let data = new Date()
      let ano = data.getFullYear()
      let dia = data.getDate()
      let mes = data.getMonth() + 1

      if(dia < 10){
        dia = "0"+dia
      }

      if(mes < 10){
        mes = "0"+mes
      }

      this.agora = ano + '-' + mes + '-' + dia
      this.data = this.agora
      this.minData = this.data

      mes = parseInt(mes) + 1
      if(mes == 13){
        mes = 1
        ano += 1
      }
      mes = mes < 10 ? `0${mes}` : mes

      let maiorData = ano + '-' + mes + '-' + dia
      this.maxData = maiorData
    }
  }
}
</script>

<style>

</style>
