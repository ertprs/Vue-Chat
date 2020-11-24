<template>
  <div class="popup-container">
    <ul
      lista-retornar
      class="popup-lista"
      :class="{'bg' : bg}"
      v-if="!pessoalData">
      <li @click="retornar('todos')" v-if="temTodos"> {{ btnTodos }} </li>
      <li @click="retornar('pessoal')" v-if="temPessoal"> {{ btnPessoal }} </li>
      <li @click="pessoalData = true" v-if="temAgendar"> {{ btnAgendar }} </li>
    </ul>
    <div
      agendar-retorno
      v-if="pessoalData"
      class="popup-container-tela-2">
        <datetime
        v-model="data"
        :placeholder="dicionario.placeholder_select_data"
        zone="local"
        value-zone="local"
        :phrases="{ok: dicionario.btn_continuar_select_data_hora, cancel: dicionario.btn_fechar_select_data_hora}"
        class="theme-custom"
        input-class="datetime-date"
        type="date" />
        <datetime
        v-model="hora"
        :placeholder="dicionario.placeholder_select_hora"
        zone="local"
        value-zone="local"
        :phrases="{ok: dicionario.btn_continuar_select_data_hora, cancel: dicionario.btn_fechar_select_data_hora}"
        class="theme-custom"
        type="time" />
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
      hora: "",
      data: "",
      pessoalData: false,
      reqEmAndamento: false,
      temTodos: false,
      btnTodos: "",
      temPessoal: false,
      btnPessoal: "",
      temAgendar: false,
      btnAgendar: ""
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

          axios_api.put(`suspend?${this.reqTeste}`, dados)
            .then(response => {
              if(response.status == 200){
                this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_retorno})

                this.$store.commit("adicionarCliAguardando", this.atendimentoAtivo)

                this.removerCliente()
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
            return
          }

          let data = this.data.slice(0, 10)
          let hora = this.hora.slice(11, 19)

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
    reqAguardando(origem){
      axios_api.get(`get-aguardando?${this.reqTeste}&aba=${origem}`)
      .then(response => {
        if(response.data){
          if(response.data.ret){
            const arr = response.data.ret
            if(origem == "pessoal"){
              this.$store.dispatch("setAguardando", arr)
            }else{
              this.$store.dispatch("setTodos", arr)
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

      if(!objAtdAux || !Object.keys(objAtdAux).length){
        this.$store.dispatch("setCaso", 206)
      }

      this.$store.dispatch('limparAtendimentoAtivo')
      this.$store.dispatch('limparIdAtendimentoAtivo')
    },
    fecharPopup(){
      this.$store.dispatch('setBlocker', false)
      this.$store.dispatch('setAbrirPopup', false)
      this.pessoalData = false
      this.dataHora = ""
    },
    setAgora(){
      let data = new Date()
      let ano = data.getFullYear()
      let dia = data.getDate()
      let mes = data.getMonth() + 1

      let agora = ano + '-' + mes + '-' + dia
      this.data = agora
    }
  }
}
</script>

<style>

</style>
