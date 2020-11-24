<template>
  <div class="popup-container">
    <template v-if="!erroTransfer">
      <ul
        class="popup-lista"
        :class="{'bg' : bg}"
        v-if="!abrirAgentes && !abrirGrupos && !abrirBot">
        <li @click="preencherAgente()" v-if="temBtnAgente"> {{ btnAgente }} </li>
        <li @click="preencherGrupo()" v-if="temBtnGrupo"> {{ btnGrupo }} </li>
        <li @click="preencherBot()" v-if="temBtnBot"> {{ btnBot }} </li>
      </ul>
      <div
        v-if="abrirAgentes"
        class="popup-container-tela-2">
        <vSelect
        :options="arrAgentes"
        label="label"
        v-model="agente"
        :reduce="arrAgentes => arrAgentes.cod"
        >
          <div slot="no-options">{{ dicionario.msg_sem_resultados }}</div>
        </vSelect>
        <ul
          class="btns-confirmacao-container popup-lista"
          :class="{'bg' : bg}">
          <li class="btn-confirmacao cancelar" @click="fecharPopup()"> {{ dicionario.btn_cancelar }} </li>
          <li class="btn-confirmacao confirmar" @click="transferir('agente', agente)"> {{ dicionario.btn_confirmar }} </li>
        </ul>
      </div>
      <div
        v-if="abrirGrupos"
        class="popup-container-tela-2">
        <vSelect
          :options="arrGrupos"
          label="label"
          v-model="grupo"
          :reduce="arrGrupos => arrGrupos.cod"
          :value="arrGrupos.cod"
          >
          <div slot="no-options">{{ dicionario.msg_sem_resultados }}</div>
        </vSelect>
        <ul
          class="btns-confirmacao-container popup-lista"
          :class="{'bg' : bg}">
          <li class="btn-confirmacao cancelar" @click="fecharPopup()"> {{ dicionario.btn_cancelar }} </li>
          <li class="btn-confirmacao confirmar" @click="transferir('grupo', grupo)"> {{ dicionario.btn_confirmar }} </li>
        </ul>
      </div>
      <div
        v-if="abrirBot"
        class="popup-container-tela-2">
        <vSelect
          :options="arrBot"
          label="label"
          v-model="bot"
          :reduce="arrBot => arrBot.cod"
          >
          <div slot="no-options">{{ dicionario.msg_sem_resultados }}</div>
        </vSelect>
        <ul
          class="btns-confirmacao-container popup-lista"
          :class="{'bg' : bg}">
          <li class="btn-confirmacao cancelar" @click="fecharPopup()"> {{ dicionario.btn_cancelar }} </li>
          <li class="btn-confirmacao confirmar" @click="transferir('bot', bot)"> {{ dicionario.btn_confirmar }} </li>
        </ul>
      </div>
    </template>
    <div v-else>
      {{ msgErro }}
    </div>
  </div>
</template>

<script>

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { mapGetters } from 'vuex'

import axios_api from "@/services/serviceAxios"
import { limparIframeUsuarioRemovido } from "@/services/iframe"

export default {
  data(){
    return{
      abrirAgentes: false,
      abrirGrupos: false,
      abrirBot: false,
      agente: '',
      grupo: '',
      bot: '',
      reqEmAndamento: false,
      btnAgente: "",
      temBtnAgente: false,
      btnGrupo: "",
      temBtnGrupo: false,
      btnBot: "",
      temBtnBot: false
    }
  },
  mounted(){
    this.preencherBotoes()
    this.setSelected()
  },
  components: {
    vSelect
  },
  methods: {
    preencherBotoes(){
      if(this.regrasDoClienteAtivo){
        if(this.regrasDoClienteAtivo.regras){
          const regras = this.regrasDoClienteAtivo.regras
          if(regras.button_transfer){
            const objRegrasTransfer = regras.button_transfer
            if(objRegrasTransfer.transfer_agente){
              if(objRegrasTransfer.transfer_agente.use == "S"){
                this.temBtnAgente = true
                this.btnAgente = objRegrasTransfer.transfer_agente.name
              }
            }

            if(objRegrasTransfer.transfer_grupo){
              if(objRegrasTransfer.transfer_grupo.use == "S"){
                this.temBtnGrupo = true
                this.btnGrupo = objRegrasTransfer.transfer_grupo.name
              }
            }

            if(objRegrasTransfer.transfer_bot){
              if(objRegrasTransfer.transfer_bot.use == "S"){
                this.temBtnBot = true
                this.btnBot = objRegrasTransfer.transfer_bot.name
              }
            }
          }
        }
      }
    },
    preencherAgente(){
      if(this.arrAgentes.length){
        this.abrirAgentes = true
      }else{
        this.$toasted.global.emConstrucao({msg: this.dicionario.msg_erro_agentes})
      }
    },
    preencherGrupo(){
      if(this.arrGrupos.length){
        this.abrirGrupos = true
      }else{
        this.$toasted.global.emConstrucao({msg: this.dicionario.msg_erro_grupos})
      }
    },
    preencherBot(){
      if(this.arrBot.length){
        this.abrirBot = true
      }else{
        this.$toasted.global.emConstrucao({msg: this.dicionario.msg_erro_bot})
      }
    },
    transferir(tipo, param){

      if(!param){
        return
      }

      if(param.cod){
        param = param.cod
      }

      if(this.reqEmAndamento){
        return
      }else{
        this.reqEmAndamento = true
      }

      setTimeout(() => {
        this.reqEmAndamento = false
      }, 1500)

      let dados = {
        token_cliente: this.atendimentoAtivo.token_cliente,
        transfer_to: param
      }

      switch(tipo){
        case 'grupo':
          dados.destino = "GRUPO"
        break;
        case 'agente':
          dados.destino = "OPE"
        break;
        case 'bot':
          dados.destino = "BOT"
        default:
        break;
      }

      axios_api.put(`transfer?${this.reqTeste}`, dados)
        .then(response => {
          if(response.data.st_ret == "OK"){
            this.$toasted.global.sucessoTransferencia()
            this.removerCliente()
          }
        })
        .catch(error => {
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_transferencia})
          console.log('Error enviar grupo: ', error)
        })

      this.fecharPopup()
    },
    removerCliente(){
      let objAtdAux = {}
      for(let ramal in this.todosAtendimentos){
        if(this.todosAtendimentos[ramal].login_usu != this.atendimentoAtivo.login_usu){
          objAtdAux[ramal] = this.todosAtendimentos[ramal]
        }
      }

      const regex = /\s|\]|\[/g
      const idIframe = this.atendimentoAtivo.login_usu.replace(regex, "")
      console.log(idIframe)

      limparIframeUsuarioRemovido(`iframe_${idIframe}`)
      this.$store.dispatch("setAtendimentos", objAtdAux)

      if(!objAtdAux || !Object.keys(objAtdAux).length){
        this.$store.dispatch("setCaso", 206)
      }

      this.$store.dispatch('limparAtendimentoAtivo')
      this.$store.dispatch('limparIdAtendimentoAtivo')
    },
    fecharPopup(event){
      this.$store.dispatch('setBlocker', false)
      this.$store.dispatch('setAbrirPopup', false)
      this.abrirAgentes = false
      this.abrirGrupos = false
      this.abrirBot = false
      this.grupo = ""
      this.agente = ""
      this.bot = ""
    },
    setSelected(){
      if(this.arrGrupos.length === 1){
        this.grupo = this.arrGrupos[0]
      }
      if(this.arrAgentes.length === 1){
        this.agente = this.arrAgentes[0]
      }
      if(this.arrBot.length === 1){
        this.bot = this.arrBot[0]
      }
    }
  },
  watch: {
    arrGrupos(){
      this.setSelected()
    },
    arrAgentes(){
      this.setSelected()
    },
    arrBot(){
      this.setSelected()
    }
  },
  computed: {
    ...mapGetters({
      arrGrupos: 'getArrGrupos',
      arrAgentes: 'getArrAgentes',
      arrBot: 'getArrBot',
      bg: 'getBgPopup',
      atendimentoAtivo: "getAtendimentoAtivo",
      reqTeste: "getReqTeste",
      todosAtendimentos: "getTodosAtendimentos",
      dicionario: "getDicionario",
      erroTransfer: "getErroTransfer",
      msgErro: "getMsgErro",
      regrasDoClienteAtivo: "getRegrasDoClienteAtivo"
    })
  }

}
</script>

<style>

</style>
