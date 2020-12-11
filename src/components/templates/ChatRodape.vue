
<template>
  <div class="chat-rodape">
    <div class="chat-rodape-container">
      <div class="chat-rodape-mensagens">
        <!-- Previa imagem -->
        <div class="container-previa-img" v-show="aparecerPrevia" :class="{'previa-anexo' : docPrevia, 'previa-anexo-erro' : docPrevia && erroFormatoAnexo}">
          <h3 v-if="arquivo.name">
            <font-awesome-icon :icon="['fas', 'image']" v-if="!docPrevia" />
            <font-awesome-icon :icon="['fas', 'file-alt']" v-else />
            {{ this.arquivo.name }}
          </h3>
          <div class="formato-invalido">
            <h3 v-if="erroFormatoAnexo">{{ dicionario.titulo_msg_formato_invalido }}</h3>
            <h4 v-if="erroFormatoAnexo">{{ txtFormatosValidos }}</h4>
          </div>
          <div class="div-previa" v-if="imagemPrevia">
            <img
              :src="imagemPrevia"
              :alt="dicionario.alt_previa_img"
            />
          </div>
        </div>
        <div
          v-show="aparecerPrevia"
          @click="excluirAnexo()"
          :title="dicionario.msg_cancelar_anexo"
          class="btn-excluir-anexo"
          :class="{'previa-anexo' : docPrevia, 'previa-anexo-erro' : docPrevia && erroFormatoAnexo}"
          >
          <font-awesome-icon :icon="['fas', 'times-circle']" />
        </div>
        <div class="chat-rodape-textarea">
          <!-- Emoji -->
          <emojis />
          <!-- Textarea -->
          <textarea
            v-on:keydown.enter="enviarMensagem($event, aparecerPrevia)"
            v-on:keydown.down="selecionarMsgFormatada(true)"
            v-on:keydown.up="selecionarMsgFormatada(true)"
            id="textarea"
            v-model="mensagem"
            :placeholder="dicionario.placeholder_textarea"
            no-resize
            rows="1"
          ></textarea>
          <span
            class="caracteres-disponiveis"
            v-text="`(${qtdCaracteresDisponiveis - mensagem.length})`"></span>
        </div>
      </div>
      <!-- Outros Botoes -->
      <div class="chat-rodape-botoes">
        <div>
          <!-- Btn enviar msg -->
          <div class="chat-rodape-botoes-botao" :title="dicionario.title_enviar_msg" v-on:click="enviarMensagem('', aparecerPrevia)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" />
          </div>
          <!-- Btn abrir msg formatada -->
          <transition name="fade">
            <div
              v-if="temMensagemFormatada"
              class="chat-rodape-botoes-botao"
              :title="dicionario.title_msg_formatada"
              v-on:click="selecionarMsgFormatada()"
            >
              <font-awesome-icon :icon="['fas', 'comment']" />
            </div>
          </transition>
          <!-- Btn abrir opcoes -->
          <transition name="fade">
            <div
              v-if="temAnexo"
              class="chat-rodape-botoes-botao botao-enviar-anexo"
              :class="abrirOpcoes ? 'btn-ativo z-index-2': ''"
              title="Selecionar Anexo"
              v-on:click="selecionarAnexo(aparecerPrevia)"
            >
              <font-awesome-icon :icon="['fas', 'paperclip']" />
              <!-- Modal Opcoes -->
              <div
                class="chat-rodape-anexo-opcoes"
                v-if="abrirOpcoes"
                :class="{'z-index-2' : abrirOpcoes}"
              >
                <!-- Btn selecionar imagem -->
                <div class="imagens" v-on:click="selecionarImagem()" :title="dicionario.title_anexo_img">
                  <font-awesome-icon :icon="['fas', 'image']" />
                </div>
                <!-- Btn selecionar documentos -->
                <div class="docs" v-on:click="selecionarDoc()" :title="dicionario.title_anexo_doc">
                  <font-awesome-icon :icon="['fas', 'file-alt']" />
                </div>
              </div>
              <div class="chat-rodape-botoes-container-anexo d-none">
                <input type="file" id="file" accept="image/*" @change="fileUpload(true, $event)" />
                <input type="file" id="doc" accept="application/*" @change="fileUpload(false, $event)" />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- Container mensagens formatadas-->
    <transition name="fade">
      <div class="chat-rodape-msg-formatada" v-show="verificaMsgFormatadaAberto">
        <!-- Select 01 -->
        <vue-select
          appendToBody
          class="select-msg-formatada"
          :options="mensagensFormatadas_01"
          label="value"
          v-model="chaveAtual_01"
          :reduce="mensagensFormatadas_01 => mensagensFormatadas_01.cod"
          >
          <div slot="no-options" v-text="dicionario.msg_sem_resultados"></div>
        </vue-select>
        <!-- Select 02 -->
        <transition name="fade">
          <vue-select
            appendToBody
            :calculatePosition="calcularPosicao"
            class="select-msg-formatada"
            :options="mensagensFormatadas_02"
            label="value"
            v-model="chaveAtual_02"
            :reduce="mensagensFormatadas_02 => mensagensFormatadas_02.cod"
            @input="recebeValorMSGFormatada(chaveAtual_02, 3)"
            >
            <div slot="no-options" v-text="dicionario.msg_sem_resultados"></div>
          </vue-select>
        </transition>
        <!-- Select 03 -->
        <transition name="fade">
          <div class="select-03" v-show="mensagensFormatadas_03.length" >
            <vue-select
              appendToBody
              :calculatePosition="calcularPosicao"
              class="select-msg-formatada"
              :options="mensagensFormatadas_03"
              label="value"
              v-model="chaveAtual_03"
              :reduce="mensagensFormatadas_03 => mensagensFormatadas_03.cod"
              >
              <div slot="no-options" v-text="dicionario.msg_sem_resultados"></div>
            </vue-select>
            <div class="btn-select-03"
              v-show="tipoMsg == 1"
              :title="dicionario.title_btn_preencher_msg_formatada"
              @click="insereMsgFormatadaNoTextarea(chaveAtual_03)">
              <font-awesome-icon :icon="['fas', 'level-up-alt']" />
            </div>
            <div class="btn-select-03"
              v-show="tipoMsg == 2"
              :title="dicionario.title_btn_abrir_msg_tipo_2"
              @click="abrePopupMsgTipo2(chaveAtual_03)">
              <font-awesome-icon :icon="['fas', 'file-alt']" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active em versï¿½es anteriores a 2.1.8 */ {
    opacity: 0;
  }
</style>

<script>

import { mapGetters } from "vuex";

import { obterMsgFormatada } from "@/services/msgFormatada";
import { formataHoraMensagem } from "@/services/formatacaoDeTextos"

import axios_api from "@/services/serviceAxios";

import { getCodigoEmojis } from "@/services/emojis"

import Emojis from "../Emojis"
import vSelect from 'vue-select'
import { createPopper } from "@popperjs/core"

export default {
  data() {
    return {
      mensagem: "",
      qtdCaracteresDisponiveis: 1500,
      arquivo: "",
      aparecerPrevia: false,
      imagemPrevia: "",
      docPrevia: false,
      txtFormatosValidos: "",
      abrirOpcoes: false,
      erroFormatoAnexo: false,
      mensagensFormatadas_01: [{cod: "T", value: "Todos"}],
      chaveAtual_01: 'T',
      mensagensFormatadas_02: [],
      chaveAtual_02: '',
      mensagensFormatadas_03: [],
      chaveAtual_03: '',
      tamanhoText: '',
      statusEnvio: '',
      alturaTela: '',
      disabled: false,
      seqNovo: "",
      placement: "top",
      todosEmojis: []
    };
  },
  components: {
    "emojis" : Emojis,
    "vue-select" : vSelect
  },
  destroyed(){
    this.$root.$off("toggle-msg-formatada")
  },
  mounted() {
    this.todosEmojis = getCodigoEmojis()

    this.$root.$on("toggle-msg-formatada", () => {
      this.abreFechaMsgFormatada()
    })

    this.$root.$on("adicionar-emoji", value => {
      this.adicionarEmoji(value)
    })

    this.$root.$on("atualizar-mensagem", (objMsgExterno) => {
      this.criaObjMensagem(objMsgExterno)
    })

    window.addEventListener("message", this.listenerPostMessage, false);

    this.alturaTela = document.querySelector("html").offsetHeight

    this.initResize();
    this.verificaTemMensagemFormatada()
  },
  methods: {
    calcularPosicao(dropdownList, component, sizes){
      dropdownList.style.width = sizes.width

      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement
      })

      return () => popper.destroy()
    },
    adicionarEmoji(objEmoji) {
      const textarea = document.querySelector('#textarea')
      textarea.focus()
      const inicioCursor = textarea.selectionStart
      const fimCursor = textarea.selectionEnd

      this.mensagem = this.mensagem.slice(0, inicioCursor) + objEmoji.native + this.mensagem.slice(fimCursor)
    },
    executaTeste(event, previa, cont) {
      setTimeout( () => {
          cont = cont + 1
          if(cont < 300) {
            this.mensagem = 'MSG ' + String(cont)
            this.enviarMensagem(event, previa)
            this.executaTeste(event, previa, cont)
          }
        }, 700);
    },
    async enviarMensagem(event, previa) {

      if(event){
        if(event.keyCode == 13 && !event.shiftKey){
          event.preventDefault()
        }
        if(event.shiftKey){
          return
        }
      }

      if(this.disabled){
        setTimeout(() => {
          this.disabled = false
        }, 500)
        return
      }else{
        this.disabled = true
      }

      if(this.blocker && this.origemBlocker !== 'msg-formatada') {
        this.$store.dispatch('setBlocker', false)
      }

      this.mensagem = this.mensagem.replace(/\n$/, "", this.mensagem);
      if(!this.mensagem && !previa){
        return
      }

      if(this.mensagem === 'executaTeste') {
        this.executaTeste(event, previa, 0)
      }

      const msgCasoErro = this.mensagem
      let msgAux = this.mensagem

      this.mensagem = ""

      if (this.validaMensagem(previa, msgAux)) {
        if (this.atendimentoAtivo.token_cliente != "") {

          let data = ""
          if(this.arquivo){
            const form = new FormData()
            form.append("token_cliente", this.atendimentoAtivo.token_cliente)
            form.append("file", this.arquivo)

            if(msgAux){
              form.append("message", msgAux)
            }

            data = form
          }else{
            const regexTags = /<.+?>/gi

            if(msgAux.match(regexTags)){
              msgAux = msgAux.replace(regexTags, '')
            }

            let regexEmojis = ""
            for (let j = 0; j < this.todosEmojis.length; j++) {
              regexEmojis = new RegExp(this.todosEmojis[j].emoji, "gi");
              if(msgAux.match(regexEmojis)){
                msgAux = msgAux.replace(regexEmojis, this.todosEmojis[j].hexa);
              }
            }

            if(!msgAux){
              return
            }

            data = {
              token_cliente: this.atendimentoAtivo.token_cliente,
              message: msgAux,
            };
          }

          await axios_api
            .post(`send-message?${this.reqTeste}`, data)
            .then((response) => {

              if(response.data){
                this.seqNovo = response.data.seq_message
              }

              this.$store.dispatch("setAbrirEmojis", false)
              this.abrirOpcoes = false;
              this.statusEnvio = "D"

              this.disabled = false
            })
            .catch((error) => {
              console.log("erro send-message: ", error);
              this.mensagem = msgCasoErro
              this.statusEnvio = "E"
              if (!document.querySelector(".toasted.toasted-primary.error")) {
                this.$toasted.global.defaultError({
                  msg: this.dicionario.msg_erro_enviar_msg,
                });
              }
            });

          this.criaObjMensagem("", msgAux)
        }
      }
    },
    resetar(){

      const rodapeMsg = document.querySelector(".chat-rodape-mensagens");
      const containerText = document.querySelector(".chat-rodape-textarea");
      const text = document.getElementById("textarea");
      const emojisContainer = document.getElementById("emoji-container");
      const rodapeBotoes = document.querySelector(".chat-rodape-botoes > div");

      rodapeMsg.style.height = '50px'
      containerText.style.height = '50px'
      text.style.height = '50px'
      emojisContainer.style.height = '50px'
      rodapeBotoes.style.height = '50px'
      text.value = text.value.trim('')

      this.mensagem = "";
      this.aparecerPrevia = false;
      this.arquivo = ""
      this.imagemPrevia = ""
    },
    validaMensagem(previa, msg) {
      if(previa){
        let anexoValidado = this.validaAnexo(this.arquivo, !this.docPrevia)
        if(anexoValidado){
          return true
        }else{
          return false
        }
      }

      if (msg.length === 0 || !msg.trim()) {
        this.mensagem = "";
        return false;
      } else if (msg.length > 1500) {
        if (!document.querySelector(".toasted.toasted-primary.error")) {
          this.$toasted.global.limiteCaracter();
        }
        return false;
      }
      return true;
    },
    criaObjMensagem(objMsgExterno, msgAux) {

      let objMensagem = {}

      let seq = ""
      let autor = ""
      let origem = ""
      let hora = this.acionaFormataHoraMensagem()
      let msg = msgAux
      let link = false
      let anexo = false
      let imgAnexo = ""
      let tipoDoc = ""
      let docAnexo = ""
      let nomeArquivo = ""
      let status = ""
      let audio = false
      let video = false

      let regex = ""

      let chavesArrMsg = Object.keys(this.atendimentoAtivo.arrMsg)
      let indexUltimaChave = chavesArrMsg[chavesArrMsg.length - 1]
      let arrMsg = this.atendimentoAtivo.arrMsg[indexUltimaChave].msg
      if(!arrMsg){
        console.log("todas chaves: ", chavesArrMsg)
        console.log("ultimaChave: ", indexUltimaChave)
        console.log("array: ", this.atendimentoAtivo.arrMsg)
        return
      }

      // Msg sendo disparada pelo textarea
      if (!objMsgExterno) {
        for (let j = 0; j < this.todosEmojis.length; j++) {
          regex = new RegExp(this.todosEmojis[j].emoji, "gi");
          if(msg.match(regex)){
            msg = msg.replace(regex, this.todosEmojis[j].hexa);
          }
        }

        msg = msg.replace(/<\/?[\d\w\s=\-:\.\/\'\";]+>/gi, ' ')

        if(this.arquivo){
          anexo = true
          if(!this.docPrevia){
            imgAnexo = this.imagemPrevia
            nomeArquivo = this.arquivo.name
          }else{
            tipoDoc = this.arquivo.type

            let url = window.URL.createObjectURL(this.arquivo)
            docAnexo = url
            nomeArquivo = this.arquivo.name
          }

          this.arquivo = ""
        }

        if(this.statusEnvio){
          status = this.statusEnvio
        }else{
          status = "D"
        }

        autor = this.nomeOpe || "Operador"
        origem = "principal"

        seq = this.seqNovo

        this.$store.dispatch("setMensagemViaTextarea", true)

        setTimeout(() => {
          this.$root.$emit("rola-chat")
        }, 250)

      } else {

        msg = objMsgExterno.msg

        if(objMsgExterno.anexos){
          anexo = true
          regex = /(\w+)\/(\w+)/g
          let type = regex.exec(objMsgExterno.anexos.type)

          if(!type){
            type = objMsgExterno.anexos.type
          }else{
            type = type[1]
          }

          switch (type) {
            case "image":
              imgAnexo = `${this.dominio}/callcenter/docs.php?mku=${objMsgExterno.anexos.mku}`
              nomeArquivo = objMsgExterno.anexos.name
              break;
            case "audio/ogg":
            case "audio/oga":
            case "audio":
            case "ogg":
            case "oga":
            case "mpga":
            case "audio/mpga":
            case "mp3":
            case "audio/mp3":
              tipoDoc = objMsgExterno.anexos.type
              docAnexo = `${this.dominio}/callcenter/docs.php?mku=${objMsgExterno.anexos.mku}`
              nomeArquivo = objMsgExterno.anexos.name
              audio = true
              break;
            case "video/mp4":
            case "video":
            case "mp4":
              tipoDoc = objMsgExterno.anexos.type
              docAnexo = `${this.dominio}/callcenter/docs.php?mku=${objMsgExterno.anexos.mku}`
              nomeArquivo = objMsgExterno.anexos.name
              video = true
              break;
            default:
              tipoDoc = objMsgExterno.anexos.type
              docAnexo = `${this.dominio}/callcenter/docs.php?mku=${objMsgExterno.anexos.mku}`
              nomeArquivo = objMsgExterno.anexos.name
              break;
          }
        }

        status = objMsgExterno.status

        origem = objMsgExterno.resp_msg == "CLI" ? "outros" : "principal"
        autor = objMsgExterno.resp_msg == "CLI" ? objMsgExterno.nome : this.nomeOpe

        seq = objMsgExterno.seq

        this.$store.dispatch("setMensagemViaTextarea", false)
      }

      msg = msg.trim()

      const regexLink = /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
      if(msg.search(regexLink) !== -1){
        link = true
        let arrLinks = msg.split(" ")
        arrLinks = arrLinks.map((link) => {
          if(link.search(regexLink) !== -1){
            let href = ""
            if(link.search(/http/g) !== -1){
              href = link
            }else{
              href = "https://"+link
            }

            link = `<a href="${href}" target="_blank" title="${link} ${this.dicionario.msg_link}">${link}</a>`
          }
          return link
        })

        msg = arrLinks.join(" ")
      }

      // Tratativa de *negrito* _italico_ e ~cortado~
      if(!link){
        const regexNegrito = /\*[\sA-Za-z0-9\u00C0-\u00FF]+\*/g
        const regexItalico = /\_[\sA-Za-z0-9\u00C0-\u00FF]+\_/g
        const regexLinha = /\~[\sA-Za-z0-9\u00C0-\u00FF]+\~/g

        if(msg.search(regexNegrito) !== -1){
          let arrTexto = msg.split(" ")

          let abrirTag = true
          arrTexto = arrTexto.map((msg) => {
            if(msg.search(/\*/) !== -1){
                if(msg.length > 1){
                  if(msg.match(/\*/g).length > 1){
                    msg = msg.replace(/\*/g, "")
                    msg = `<b>${msg}</b>`
                  }else{
                    msg = msg.replace(/\*/, "")
                    if(abrirTag){
                      msg = `<b>${msg}`
                      abrirTag = false
                    }else{
                      msg += "</b>"
                    }
                  }
                }else{
                  if(abrirTag){
                    msg = msg.replace(/\*/, "<b>")
                    abrirTag = false
                  }else{
                    msg = msg.replace(/\*/, "</b>")
                  }
                }
              }
              return msg
          })
          msg = arrTexto.join(" ")
        }

        if(msg.search(regexItalico) !== -1){
          let arrTexto = msg.split(" ")

          let abrirTag = true
          arrTexto = arrTexto.map((msg) => {
            if(msg.search(/\_/) !== -1){
                if(msg.length > 1){
                  if(msg.match(/\_/g).length > 1){
                    msg = msg.replace(/\_/g, "")
                    msg = `<i>${msg}</i>`
                  }else{
                    msg = msg.replace(/\_/, "")
                    if(abrirTag){
                      msg = `<i>${msg}`
                      abrirTag = false
                    }else{
                      msg += "</i>"
                    }
                  }
                }else{
                  if(abrirTag){
                    msg = msg.replace(/\_/, "<i>")
                    abrirTag = false
                  }else{
                    msg = msg.replace(/\_/, "</i>")
                  }
                }
              }
              return msg
          })
          msg = arrTexto.join(" ")
        }

        if(msg.search(regexLinha) !== -1){
          let arrTexto = msg.split(" ")

          let abrirTag = true
          arrTexto = arrTexto.map((msg) => {
            if(msg.search(/\~/) !== -1){
                if(msg.length > 1){
                  if(msg.match(/\~/g).length > 1){
                    msg = msg.replace(/\~/g, "")
                    msg = `<del>${msg}</del>`
                  }else{
                    msg = msg.replace(/\~/, "")
                    if(abrirTag){
                      msg = `<del>${msg}`
                      abrirTag = false
                    }else{
                      msg += "</del>"
                    }
                  }
                }else{
                  if(abrirTag){
                    msg = msg.replace(/\~/, "<del>")
                    abrirTag = false
                  }else{
                    msg = msg.replace(/\~/, "</del>")
                  }
                }
              }
              return msg
          })
          msg = arrTexto.join(" ")
        }
      }

      objMensagem = {
        seq: seq,
        autor: autor,
        origem: origem,
        msg: msg,
        link: link,
        horario: hora,
        anexo: anexo,
        imgAnexo: imgAnexo,
        tipoDoc: tipoDoc,
        docAnexo: docAnexo,
        nomeArquivo: nomeArquivo,
        status: status,
        audio: audio,
        video: video
      };

      this.atendimentoAtivo.arrMsg[indexUltimaChave].msg.push(objMensagem)
      this.$forceUpdate()

      // if(objMsgExterno){
        // this.$root.$emit("verificar-seq")
      // }

      if(this.statusEnvio !== "E" && !objMsgExterno){
        this.resetar()
      }

    },
    acionaFormataHoraMensagem() {
      return formataHoraMensagem()
    },
    verificaTemMensagemFormatada(){
      let valor = 'T'
      let tokenCliente = this.atendimentoAtivo.token_cliente

      obterMsgFormatada(valor, tokenCliente)
        .then((data) => {
          if(data){
            this.$store.dispatch("setTemMensagemFormatada", true)
          }
        })
        .catch((err) => {
          console.log('Erro msg formatada: ', err)
          this.temMsgFormatada = false
        });
    },
    abreFechaMsgFormatada(){
      this.$store.dispatch("setVerificaMsgFormatadaAberto", !this.verificaMsgFormatadaAberto)

      if (this.verificaMsgFormatadaAberto) {
        this.adicionaAnimacaoChatRodape("mudanca-maior")
      } else {
        // Textarea menor que 3 linhas
        if(this.tamanhoText < 70){
          this.adicionaAnimacaoChatRodape("remover-maior")
        // Textarea maior/igual a 3 linhas
        }else{
          this.adicionaAnimacaoChatRodape("mudanca-pequena")
        }

        this.mensagensFormatadas_02 = []
        this.chaveAtual_02 = ''
        this.mensagensFormatadas_03 = []
        this.chaveAtual_03 = ''
      }
    },
    selecionarMsgFormatada(chamouPeloTextarea) {

      if(chamouPeloTextarea){
        if(this.mensagem){
          return
        }
      }

      this.abreFechaMsgFormatada()

      if(!this.$store.getters.getVerificaMsgFormatadaAberto){
        return
      }

      this.chaveAtual_01 = this.mensagensFormatadas_01[0]

      let valor = 'T'
      let tokenCliente = this.atendimentoAtivo.token_cliente

      obterMsgFormatada(valor, tokenCliente)
        .then((data) => {
          this.exibirMsgFormatada(data, 2)
        })
        .catch((err) => console.log(err));
    },
    exibirMsgFormatada(objMsgFormatada, numReq) {
      switch(numReq){
        case 2:
          this.mensagensFormatadas_02 = objMsgFormatada
          if(this.mensagensFormatadas_02.length == 1){
            this.chaveAtual_02 = this.mensagensFormatadas_02[0]
            this.recebeValorMSGFormatada(this.chaveAtual_02.cod, 3)
          }else{
            this.chaveAtual_02 = ""
          }

          const select = document.querySelectorAll(".select-msg-formatada")[1]
          if(select){
            select.focus()
          }
        break;
        case 3:
          if(objMsgFormatada.length){
            this.mensagensFormatadas_03 = objMsgFormatada
            if(this.mensagensFormatadas_03.length == 1){
              this.chaveAtual_03 = this.mensagensFormatadas_03[0].cod
            }else{
              this.chaveAtual_03 = ""
            }
          }else{
            this.mensagensFormatadas_03 = []
            this.$toasted.global.emConstrucao({msg: this.dicionario.msg_erro_sem_msg_formatada})
          }
        break;
      }
    },
    recebeValorMSGFormatada(codReq, numReq){
      if(codReq.cod){ codReq = codReq.cod }

      codReq = `${this.chaveAtual_01.cod}/${codReq}`

      let tokenCliente = this.atendimentoAtivo.token_cliente
      obterMsgFormatada(codReq, tokenCliente)
        .then((data) => {
          if(data){
            if(typeof(data) == "string"){
              this.$toasted.global.emConstrucao({msg: data})
            }else{
              this.exibirMsgFormatada(data, numReq)
            }
          }else{
            this.$toasted.global.defaultError()
          }
        })
        .catch((err) => console.log(err));
    },
    insereMsgFormatadaNoTextarea(chave){

      if(!chave){
        this.$toasted.global.defaultError({msg: 'Selecione uma mensagem'})
        return
      }

      if(!chave.cod){ return }

      const cod = chave.cod
      const msg = chave.value
      if(msg){
        if(this.mensagem == msg){
          return
        }else{
          this.mensagem = this.mensagem == '' ? msg : this.mensagem + ' ' + msg
        }
      }else{
        this.$toasted.global.emConstrucao({msg: 'Mensagem vazia'})
      }
    },
    abrePopupMsgTipo2(chave){

      if(!chave){ return }

      this.$store.dispatch("setBlocker", true)
      this.$store.dispatch("setOrigemBlocker", "visualizar-iframe")

      if(chave.cod){ chave = chave.cod }
      this.$store.dispatch("setAssunto", chave)
      if(this.chaveAtual_02.cod){ this.chaveAtual_02 = this.chaveAtual_02.cod }
      this.$store.dispatch("setCategoria", this.chaveAtual_02)

    },
    selecionarAnexo(previa) {
      if(previa){
        if(!this.docPrevia){
          this.selecionarImagem()
        }else{
          this.selecionarDoc()
        }
        return
      }
      // this.selecionarImagem()
      this.$store.dispatch("setOrigemBlocker", "chat");
      this.abrirOpcoes = !this.abrirOpcoes;
      this.$store.dispatch("setBlocker", this.abrirOpcoes);
    },
    selecionarImagem() {
      let inputFile = document.querySelector("#file");
      inputFile.click();

      this.abrirOpcoes = !this.abrirOpcoes;
      this.$store.dispatch("setBlocker", this.abrirOpcoes);
    },
    selecionarDoc() {
      let inputFile = document.querySelector("#doc");
      inputFile.click();

      this.abrirOpcoes = !this.abrirOpcoes;
      this.$store.dispatch("setBlocker", this.abrirOpcoes);
    },
    fileUpload(img = true, event) {
      let leitorDeImagem = new FileReader();

      this.arquivo = event.target.files || event.dataTransfer.files
      if(!this.arquivo.length){
        this.arquivo = ""
        return
      }else{
        this.arquivo = this.arquivo[0]
      }

      if(img){
        document.querySelector("#file").value = ""
        this.aparecerPrevia = true;
        leitorDeImagem.onload = () => {
          this.imagemPrevia = leitorDeImagem.result;
        }
      }else{
        document.querySelector("#doc").value = ""

        this.aparecerPrevia = true;
        this.docPrevia = true
      }
      document.querySelector('#textarea').focus()

      if (this.arquivo) {
        if(img){
          this.docPrevia = false
          if (this.validaAnexo(this.arquivo, true)) {
            leitorDeImagem.readAsDataURL(this.arquivo);
            this.erroFormatoAnexo = false;
          } else {
            this.imagemPrevia = "";
            this.erroFormatoAnexo = true;
            this.txtFormatosValidos = `${this.extImgs} ${this.dicionario.msg_extensoes_aceitas}`;
          }
        }else{
          this.imagemPrevia = "";
          if (this.validaAnexo(this.arquivo, false)) {
            this.erroFormatoAnexo = false;
          }else{
            this.erroFormatoAnexo = true;
            this.txtFormatosValidos = `${this.extDocs} ${this.dicionario.msg_extensoes_aceitas}`;
          }
        }
      } else {
        this.aparecerPrevia = false
        this.arquivo = "";
        this.imagemPrevia = "";
        this.docPrevia = false
      }
    },
    validaAnexo(arquivo, img = true) {
      let regex = ""
      if (arquivo) {
        if(img){
          regex = new RegExp("\.("+this.extImgs+")", "i")

          if (regex.test(arquivo.name)) {
            return true;
          } else {
            this.$toasted.global.formatoInvalido();
            return false;
          }
        }else{
          regex = new RegExp("\.("+this.extDocs+")", "i")

          if (regex.test(arquivo.name)) {
            return true;
          }else{
            this.$toasted.global.formatoInvalido();
            return false;
          }
        }
      }else{
        this.$toasted.global.formatoInvalido();
        return false
      }
    },
    excluirAnexo() {
      this.arquivo = "";
      this.aparecerPrevia = false;
      this.imagemPrevia = "";
    },
    initResize() {
      var observe;
      if (window.attachEvent) {
        observe = function (element, event, handler) {
          element.attachEvent("on" + event, handler);
        };
      } else {
        observe = function (element, event, handler) {
          element.addEventListener(event, handler, false);
        };
      }

      const rodapeMsg = document.querySelector(".chat-rodape-mensagens");
      const containerText = document.querySelector(".chat-rodape-textarea");
      const text = document.getElementById("textarea");
      const emojisContainer = document.getElementById("emoji-container");
      const rodapeBotoes = document.querySelector(".chat-rodape-botoes > div");

      let vm = this

      function resize() {
        vm.tamanhoText = text.scrollHeight

        if(text.value == ""){
          if(!vm.arquivo){
            vm.resetar()
          }
        }

        text.style.height = "auto";
        text.style.height = text.scrollHeight + "px";
        rodapeMsg.style.height = text.scrollHeight + "px";
        containerText.style.height = text.scrollHeight + "px";
        emojisContainer.style.height = text.scrollHeight + "px";
        rodapeBotoes.style.height = text.scrollHeight + "px";

      }
      /* Timeout para garantir que estamos pegando o texto atualizado */
      function delayedResize() {
        window.setTimeout(resize, 0);
      }
      observe(text, "change", resize);
      observe(text, "cut", delayedResize);
      observe(text, "paste", delayedResize);
      observe(text, "drop", delayedResize);
      observe(text, "keydown", delayedResize);
    },
    listenerPostMessage(event){

      if(event.origin == this.dominio){
        if(event.data.gerenciador){
          return
        }

        if(event.data == ''){
          this.$toasted.global.emConstrucao({msg: this.dicionario.msg_erro_sem_msg_formatada})
        }

        this.mensagem = event.data
        document.querySelector('#textarea').focus()

        this.$store.dispatch("setBlocker", false)
        this.$store.dispatch("setAbrirMsgTipo2", false)
        this.abreFechaMsgFormatada()
      }
    },
    resizeEvent(event){
      this.alturaTela = document.querySelector("html").offsetHeight
      if(this.verificaMsgFormatadaAberto){
        this.$store.dispatch("setVerificaMsgFormatadaAberto", false)
      }

      if(this.tamanhoText >= 68){
        this.adicionaAnimacaoChatRodape("mudanca-pequena")
      }else{
        this.adicionaAnimacaoChatRodape("remover")
      }
    },
    adicionaAnimacaoChatRodape(tipo){
      const chatRodape = document.querySelector(".chat-rodape")

      if(!chatRodape) return

      switch (tipo){
        case "mudanca-pequena":
          if(chatRodape.classList.contains("maior-mudanca-tamanho")){
            chatRodape.classList.remove("maior-mudanca-tamanho")
          }
          if(chatRodape.classList.contains("remover-pequena-mudanca")){
            chatRodape.classList.remove("remover-pequena-mudanca")
          }
          chatRodape.classList.add("pequena-mudanca-tamanho")
        break;
        case "remover-pequena":
          if(chatRodape.classList.contains("pequena-mudanca-tamanho")){
            chatRodape.classList.remove("pequena-mudanca-tamanho")
            chatRodape.classList.add("remover-pequena-mudanca")
            setTimeout(() => {
              chatRodape.classList.remove("remover-pequena-mudanca")
            }, 1000)
          }
        break;
        case "mudanca-maior":
          if(chatRodape.classList.contains("pequena-mudanca-tamanho")){
            chatRodape.classList.remove("pequena-mudanca-tamanho")
          }
          if(chatRodape.classList.contains("remover-maior-mudanca")){
            chatRodape.classList.remove("remover-maior-mudanca")
          }
          chatRodape.classList.add("maior-mudanca-tamanho")
        break;
        case "remover-maior":
          if(chatRodape.classList.contains("maior-mudanca-tamanho")){
            chatRodape.classList.remove("maior-mudanca-tamanho")
            chatRodape.classList.add("remover-maior-mudanca")
            setTimeout(() => {
              chatRodape.classList.remove("remover-maior-mudanca")
            }, 1000)
          }
        break;
      }
    }
  },
  watch: {
    tamanhoText(){
      if(!this.verificaMsgFormatadaAberto){
        // Textarea maior que 68 (tres/quatro linhas)
        if(this.tamanhoText >= 68){
          this.adicionaAnimacaoChatRodape("mudanca-pequena")
        // Textarea menor que 68 (uma/duas linha)
        }else{
          this.adicionaAnimacaoChatRodape("remover-pequena")
        }
      }
    },
    abrirEmojis() {
      if (this.abrirEmojis) {
        this.abrirOpcoes = false;
      }
    },
    abrirOpcoes() {
      if (this.abrirOpcoes) {
        this.$store.dispatch("setAbrirEmojis", false)
      }
    },
    blocker() {
      if (!this.blocker) {
        this.abrirOpcoes = false;
        this.$store.dispatch("setAbrirEmojis", false)
        this.$store.dispatch("setAbrirMsgTipo2", false)
      }
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: "getAtendimentoAtivo",
      url: "getURL",
      blocker: "getBlocker",
      tipoMsg: 'getTipoMsg',
      origemBlocker: 'getOrigemBlocker',
      dominio: "getDominio",
      reqTeste: "getReqTeste",
      extImgs: "getExtImgs",
      extDocs: "getExtDocs",
      dicionario: "getDicionario",
      nomeOpe: "getNomeOpe",
      verificaMsgFormatadaAberto: "getVerificaMsgFormatadaAberto",
      abrirEmojis: "getAbrirEmojis",
      temMensagemFormatada: "getTemMensagemFormatada",
      temAnexo: "getTemAnexo"
    })
  },
  created(){
    window.addEventListener("resize", this.resizeEvent)
  },
  destroyed(){
    window.removeEventListener("resize", this.resizeEvent)

    this.$root.$off("atualizar-mensagem")
  }
};
</script>
