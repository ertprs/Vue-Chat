<template>
  <div id="rodape-botoes-encerramento-container">
    <div class="rodape-botoes-encerramento">
      <template v-if="tudoPronto">
        <div
          class="rodape-botoes-botao botao-transferencia"
          :class="{'semIframe' : semIframe}"
          v-if="regrasBotoes.button_transfer.use == 'S'"
          :title="regrasBotoes.button_transfer.name"
          @click="abrirTransferir()">

          <font-awesome-icon :icon="['fas', 'random']" />
          <span v-text="regrasBotoes.button_transfer.name"></span>
        </div>
        <div
          class="rodape-botoes-botao botao-retornar"
          :class="{'semIframe' : semIframe}"
          v-if="regrasBotoes.button_suspend.use == 'S'"
          :title="regrasBotoes.button_suspend.name"
          @click="retornarForm()">

          <font-awesome-icon :icon="['fas', 'undo']" />
          <span v-text="regrasBotoes.button_suspend.name"></span>
        </div>
        <div
          class="rodape-botoes-botao botao-encerrar"
          :class="{'semIframe' : semIframe}"
          v-if="regrasBotoes.button_end.use == 'S'"
          :title="regrasBotoes.button_end.name"
          @click="popupEncerrar()">

          <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
          <span v-text="regrasBotoes.button_end.name"></span>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="load" v-if="contadorRequisicoesFalhas < 10">
            <font-awesome-icon :icon="['fas', 'hourglass-end']" />
          </div>
          <div class="load" v-else>
            <p v-text="dicionario.msg_erro_carregamento"></p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios_api from '@/services/serviceAxios'

import { mapGetters } from 'vuex'
import { executandoEncerrar, liberarEncerrar, removerCliente } from '@/services/atendimentos'
import { limparIframeUsuarioRemovido } from "@/services/iframe"

export default {
  data(){
    return{
      regrasBotoes: {},
      regrasCor: {},
      tudoPronto: false,
      contadorRequisicoesFalhas: 0,
      notificou: false
    }
  },
  mounted(){
    this.getRegras()
    this.$root.$on("encerrar-atendimento", () => {
      this.encerrarAtendimento()
      this.reverterCoresClienteAtivo()
    })

    this.$root.$on("reverter-cores", () => {
      this.reverterCoresClienteAtivo()
    })

    this.$root.$on("adicionar-cores", () => {
      this.setCoresClienteAtivo()
    })

    this.$root.$on("abrir-transferir", () => {
      this.abrirTransferir()
    })

    this.$root.$on("abrir-retornar", () => {
      this.retornarForm()
    })

    this.$root.$on("abrir-encerrar", () => {
      this.popupEncerrar()
    })
  },
  beforeDestroy(){
    this.$root.$off("adicionar-cores")
    this.$root.$off("reverter-cores")
    this.$root.$off("encerrar-atendimento")
  },
  computed: {
    ...mapGetters({
      regrasDoClienteAtivo: 'getRegrasDoClienteAtivo',
      atendimentoAtivo: 'getAtendimentoAtivo',
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      blocker: 'getBlocker',
      arrBot: 'getArrBot',
      arrAgentes: 'getArrAgentes',
      arrGrupos: 'getArrGrupos',
      origemBlocker: 'getOrigemBlocker',
      caso: 'getCaso',
      reqTeste: 'getReqTeste',
      semIframe: 'getSemIframe',
      dicionario: "getDicionario"
    })
  },
  watch: {
    atendimentoAtivo(){
      if(!this.atendimentoAtivo.rules){
        this.tudoPronto = false
        if(this.regrasDoClienteAtivo.regras){
          this.reverterCoresClienteAtivo()
        }
        this.getRegras()
      }else{
        if(this.atendimentoAtivo.login_usu !== this.regrasDoClienteAtivo.id){
          this.tudoPronto = false
          this.reverterCoresClienteAtivo()

          this.$store.commit("setRegrasDoClienteAtivo", { id: this.atendimentoAtivo.login_usu, regras: this.atendimentoAtivo.rules })

          this.preencherRegrasDoClienteAtivo()

        }else{
          this.preencherRegrasDoClienteAtivo()
        }
      }
    }
  },
  methods: {
    getRegras(){
      this.reqRegras(this.atendimentoAtivo.token_cliente, this.atendimentoAtivo.login_usu)
    },
    reqRegras(tokenCliente, id){
        this.$store.dispatch("setReqRegras", true)

        axios_api.get(`get-rules?token_cliente=${tokenCliente}&${this.reqTeste}`)
        .then(response => {
          if (response.data.st_ret == 'OK') {
            const dicionario = response.data.rules.dicionario
            if(dicionario){
              this.$store.dispatch("setDicionario", dicionario)
            }

            this.contadorRequisicoesFalhas = 0

            const arrayRegras = response.data.rules
            let auxAtdAtivo = this.atendimentoAtivo
            auxAtdAtivo.rules = arrayRegras
            this.$store.commit("setAtendimentoAtivo", auxAtdAtivo)
            this.$store.dispatch("setIdAtendimentoAtivo", auxAtdAtivo.id_cli)

            if(arrayRegras.notification){
              const objNotificacao = arrayRegras.notification

              if(objNotificacao.force == "S"){
                // Forcar uso de notificacao
                this.$store.dispatch("setForcarNotificacoes", true)
              }
              if(objNotificacao.notify_cli.use == "S"){
                this.$store.dispatch("setUsaNotificacaoCli", true)
                this.$store.dispatch("setTituloCli", objNotificacao.notify_cli.message)
                this.$store.dispatch("setTimeCli", objNotificacao.notify_cli.time)
              }
              if(objNotificacao.notify_msg.use == "S"){
                this.$store.dispatch("setUsaNotificacaoMsg", true)
                this.$store.dispatch("setTituloMsg", objNotificacao.notify_msg.message)
                this.$store.dispatch("setTimeMsg", objNotificacao.notify_msg.time)
              }
            }

            if(!this.notificou){
              this.$root.$emit("habilitar-notificacoes")
              this.notificou = true
            }

            if(!arrayRegras.usa_anexo){
              this.$store.dispatch("setTemAnexo", false)
            }

            if(arrayRegras.accept_document){
              const todasExts = arrayRegras.accept_document

              let strImgs = ""
              let strDocs = ""

              for(let ext in todasExts){
                switch (todasExts[ext]){
                  case "jpg":
                  case "jpeg":
                  case "png":
                  case "gif":
                  case "svg":
                    strImgs += todasExts[ext]+"|"
                    break;
                  default:
                    strDocs += todasExts[ext]+"|"
                    break;
                }
              }

              strImgs = strImgs.slice(0, strImgs.length - 1)
              strDocs = strDocs.slice(0, strDocs.length - 1)

              this.$store.dispatch("setExtImgs", strImgs)
              this.$store.dispatch("setExtDocs", strDocs)
            }

            let objRegra = {
              id: id,
              regras: arrayRegras
            }
            this.$store.commit("setRegrasDoClienteAtivo", objRegra)

            this.preencherRegrasDoClienteAtivo()

            this.$store.dispatch("setReqRegras", false)
          }
        })
        .catch(error => {
          this.contadorRequisicoesFalhas += 1
          console.log('contador de erros: ', this.contadorRequisicoesFalhas)
          if(this.contadorRequisicoesFalhas < 10){
            this.getRegras()
          }
          console.log('Erro getRules: ', error)
        })
    },
    preencherRegrasDoClienteAtivo(){
      if(this.regrasDoClienteAtivo.regras){
        this.regrasBotoes = this.regrasDoClienteAtivo.regras

        this.setCoresClienteAtivo()
        this.tudoPronto = true
      }
    },
    setCoresClienteAtivo(){
      this.regrasCor = this.regrasDoClienteAtivo.regras.primary_color
      if(this.regrasCor){
        this.aplicarCoresNoElemento('.chat-opcoes-titulo', this.regrasCor)
        this.aplicarCoresNoElemento('.titulo-contatos', this.lightenDarkenColor(this.regrasCor, 10))
        this.aplicarCoresNoElemento('#informacoes-titulo', this.lightenDarkenColor(this.regrasCor, -10))
        this.$store.dispatch("setBgPopup", this.lightenDarkenColor(this.regrasCor, 15))
      }
    },
    reverterCoresClienteAtivo(){
      this.aplicarCoresNoElemento('.chat-opcoes-titulo', 'reverter')
      this.aplicarCoresNoElemento('.titulo-contatos', 'reverter')
      this.aplicarCoresNoElemento('#informacoes-titulo', 'reverter')
      this.$store.dispatch("setBgPopup", "")
    },
    aplicarCoresNoElemento(elem, cor){
      if(!document.querySelector(elem)){
        return
      }

      let elemento = document.querySelector(elem)

      if(cor == "reverter"){
        elemento.style.borderBottom = `unset`
        return
      }else{
        elemento.style.borderBottom = `3px solid ${cor}`
      }

    },
    lightenDarkenColor(cor, qtd) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cor)

      result = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null

      if(!result){
        return
      }

      let r = result.r
      let g = result.g
      let b = result.b

      result.r = novaCor(r, qtd)
      result.g = novaCor(g, qtd)
      result.b = novaCor(b, qtd)

      function novaCor(c, qtd){
        if(c >= 0 && c <= 255){
          if(c + qtd < 0 || c + qtd > 255){
            return c
          }else{
            return c + qtd
          }
        }
      }

      result = "#" + componenteRGBParaHex(result.r) + componenteRGBParaHex(result.g) + componenteRGBParaHex(result.b);

      function componenteRGBParaHex(color){
        let hex = color.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      return result
    },
    checaBlocker(){
      this.$store.dispatch('setOrigemBlocker', 'btn-acoes')
      this.$store.dispatch('setBlocker', true)
      this.$store.dispatch('setAbrirPopup', true)
    },
    abrirTransferir(){
      this.checaBlocker()

      this.$store.dispatch('setOrigem', 'Transferir')
      if(this.tudoPronto){
        this.$store.dispatch('setTitulo', this.regrasBotoes.button_transfer.name)
      }else{
        this.$store.dispatch('setTitulo', 'Transferir')
      }

      const tokenCliente = this.atendimentoAtivo.token_cliente
      axios_api.get(`get-transfer?token_cliente=${tokenCliente}&${this.reqTeste}`)
        .then(response => {
          if(response.data.st_ret == "OK"){
            this.$store.dispatch("setErroTransfer", false)
            this.$store.dispatch("setMsgErro", "")

            if(response.data.options.agentes.length){
              this.preencherArraysTransfer("agente", response.data.agentes.agentes)
            }

            if(response.data.options.grupos.length){
              this.preencherArraysTransfer("grupo", response.data.options.grupos)
            }

            if(response.data.options.bot.length){
              this.preencherArraysTransfer("bot", response.data.options.bot)
            }

          }else{
            this.$store.dispatch("setErroTransfer", true)
            this.$store.dispatch("setMsgErro", this.dicionario.msg_erro)
          }
        })
        .catch(error => {
          this.$store.dispatch("setErroTransfer", true)
          this.$store.dispatch("setMsgErro", error)
          console.log('Erro transferir: ', error)
        })

    },
    preencherArraysTransfer(tipo, arr){
      let arrChaves = []
      let arrValores = []
      let arrAux = []

      let setter = ""

      switch (tipo){
        case "agente":
          setter = "setArrAgentes"
        break;
        case "grupo":
          setter = "setArrGrupos"
        break;
        case "bot":
          setter = "setArrBot"
        break;
      }

      arr.map(obj => {
        for(let chave in obj){
          arrChaves.push(chave)
          arrValores.push(obj[chave])
        }
      })

      for(let i = 0; i < arrChaves.length; i++){
        arrAux.push({ cod: arrChaves[i], label: arrValores[i] })
      }

      this.$store.dispatch(setter, arrAux)
    },
    retornarForm(){
      this.checaBlocker()

      this.$store.dispatch("setOrigem", "Retornar")
      if(this.tudoPronto){
        this.$store.dispatch("setTitulo", this.regrasBotoes.button_suspend.name)
      }else{
        this.$store.dispatch("setTitulo", "Retornar")
      }
    },
    popupEncerrar(){
      this.checaBlocker()

      executandoEncerrar()

      this.$store.dispatch("setOrigem", "Encerrar")
      if(this.tudoPronto){
        this.$store.dispatch("setTitulo", this.regrasBotoes.button_end.name)
      }else{
        this.$store.dispatch("setTitulo", "Encerrar")
      }
    },
    async encerrarAtendimento() {
      if( this.atendimentoAtivo.informacoes.nome != null ) {
        await this.finalizarAtendimentoNaApi()

      } else {
        this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_clique_finalizar})
      }
    },
    async finalizarAtendimentoNaApi() {

      let data = { "token_cliente": this.atendimentoAtivo.token_cliente, "tipo": this.atendimentoAtivo.tipo }

      await axios_api.delete(`end-atendimento?${this.reqTeste}`, {data: {...data}})
        .then(response => {
          if(response.data.st_ret == 'OK'){
            this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_encerramento})

            this.ativarRemoverCliente()

          }
        })
        .catch(error => {
          console.log('Error end atd: ', error)
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_finalizar})
        })

        liberarEncerrar()
    },
    ativarRemoverCliente(){
      removerCliente()
    }
  }
}
</script>
