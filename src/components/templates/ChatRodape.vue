
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
          <div
            v-if="temMsgFormatada"
            class="chat-rodape-botoes-botao"
            :title="dicionario.title_msg_formatada"
            v-on:click="selecionarMsgFormatada()"
          >
            <font-awesome-icon :icon="['fas', 'comment']" />
          </div>
          <!-- Btn abrir opcoes -->
          <div
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
        </div>
      </div>
    </div>
    <!-- Container mensagens formatadas-->
    <transition name="fade">
      <div class="chat-rodape-msg-formatada" v-show="verificaMsgFormatadaAberto">
        <!-- Select 01 -->
        <select
          name="select-msg-formatada_01"
          class="select-msg-formatada"
          v-model="chaveAtual_01"
          v-on:change="recebeValorMSGFormatada(chaveAtual_01, 2)">
          <option disabled value=""> {{ dicionario.titulo_select }} </option>
          <option v-for="(valor, chave) in mensagensFormatadas_01" :key="chave+valor"
            :value="chave">
            {{ valor }}
          </option>
        </select>
        <!-- Select 02 -->
        <transition name="fade">
          <select
            v-show="mensagensFormatadas_02.length"
            name="select-msg-formatada_02"
            class="select-msg-formatada"
            v-model="chaveAtual_02"
            v-on:change="recebeValorMSGFormatada(chaveAtual_01+'/'+chaveAtual_02, 3)">
            <option disabled value=""> {{ dicionario.titulo_select }} </option>
            <option v-for="(valor, indice) in mensagensFormatadas_02" :key="indice"
              :value="valor.cod">
              {{ valor.value }}
            </option>
          </select>
        </transition>
        <!-- Select 03 -->
        <transition name="fade">
          <div class="select-03" v-show="mensagensFormatadas_03.length" >
            <select
              name="select-msg-formatada_03"
              class="select-msg-formatada"
              v-model="chaveAtual_03">
              <option disabled value=""> {{ dicionario.titulo_select }} </option>
              <option v-for="(valor, indice) in mensagensFormatadas_03" :key="indice"
                :value="indice">
                {{ valor.value }}
              </option>
            </select>
            <div class="btn-select-03"
              v-show="tipoMsg == 1"
              :title="dicionario.title_btn_preencher_msg_formatada"
              @click="insereMsgFormatadaNoTextarea(mensagensFormatadas_03, chaveAtual_03)">
              <font-awesome-icon :icon="['fas', 'level-up-alt']" />
            </div>
            <div class="btn-select-03"
              v-show="tipoMsg == 2"
              :title="dicionario.title_btn_abrir_msg_tipo_2"
              @click="abrePopupMsgTipo2(mensagensFormatadas_03, chaveAtual_03)">
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
import { formataHoraAtual } from "@/services/formatacaoDeTextos"

import axios_api from "@/services/serviceAxios";

import Emojis from "../Emojis"

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
      temMsgFormatada: false,
      mensagensFormatadas_01: [],
      chaveAtual_01: '',
      mensagensFormatadas_02: [],
      chaveAtual_02: '',
      mensagensFormatadas_03: [],
      chaveAtual_03: '',
      tamanhoText: '',
      statusEnvio: '',
      alturaTela: '',
      disabled: false
    };
  },
  components: {
    "emojis" : Emojis
  },
  destroyed(){
    this.$root.$off("toggle-msg-formatada")
  },
  mounted() {
    this.$root.$on("toggle-msg-formatada", () => {
      this.abreFechaMsgFormatada()
    })

    this.$root.$on("adicionar-emoji", value => {
      this.adicionarEmoji(value)
    })

    this.$root.$on("atualizar-mensagem", (objMsgExterno) => {
      this.criaObjMensagem(objMsgExterno)
    }),(document.querySelector(".btn-emoji").innerText = String.fromCodePoint(0x1f61c));

    window.addEventListener("message", this.listenerPostMessage, false);

    this.alturaTela = document.querySelector("html").offsetHeight

    this.initResize();
    this.verificaTemMsgFormatada()
  },
  methods: {
    adicionarEmoji(value) {
      document.querySelector('#textarea').focus()
      this.mensagem += value;
    },
    executaTeste(event, previa, cont) {
      setTimeout( () => {
          cont = cont + 1
          if(cont < 300) {
            this.mensagem = 'MSG ' + String(cont)
            this.enviarMensagem(event, previa)
            this.executaTeste(event, previa, cont)
          }
        }, 500);
    },
    enviarMensagem(event, previa) {

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

      if(event){
        if(event.keyCode == 13 && !event.shiftKey){
          event.preventDefault()
        }
        if(event.shiftKey){
          return
        }
      }

      this.mensagem = this.mensagem.replace(/\n$/, "", this.mensagem);

      if(this.mensagem === 'executaTeste') {
        this.executaTeste(event, previa, 0)
      }

      const msgAux = this.mensagem

      if (this.validaMensagem(previa)) {
        if (this.atendimentoAtivo.token_cliente != "") {

          let data = ""
          if(this.arquivo){
            const form = new FormData()
            form.append("token_cliente", this.atendimentoAtivo.token_cliente)
            form.append("file", this.arquivo)
            if(this.mensagem){
              form.append("message", this.mensagem)
            }

            data = form
          }else{
            this.mensagem = this.mensagem.replace(/<\/?[\d\w\s=\-:\.\/\'\";]+>/gi, ' ')

            let regex = ""
            for (let j = 0; j < this.emojis.length; j++) {
              regex = new RegExp(this.emojis[j].emoji, "gi");
              this.mensagem = this.mensagem.replace(regex, this.emojis[j].hexa);
            }

            data = {
              token_cliente: this.atendimentoAtivo.token_cliente,
              message: this.mensagem,
            };
          }

          axios_api
            .post(`send-message?${this.reqTeste}`, data)
            .then((response) => {
              this.$store.dispatch("setAbrirEmojis", false)
              this.abrirOpcoes = false;
              this.statusEnvio = "D"

              this.disabled = false
            })
            .catch((error) => {
              console.log("erro send-message: ", error);
              this.mensagem = msgAux
              this.statusEnvio = "E"
              if (!document.querySelector(".toasted.toasted-primary.error")) {
                this.$toasted.global.defaultError({
                  msg: this.dicionario.msg_erro_enviar_msg,
                });
              }
            });

          this.criaObjMensagem()
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
    validaMensagem(previa) {
      if(previa){
        let anexoValidado = this.validaAnexo(this.arquivo, !this.docPrevia)
        if(anexoValidado){
          return true
        }else{
          return false
        }
      }

      let msg = this.mensagem;

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
    criaObjMensagem(objMsgExterno) {

      let objMensagem = {}

      let seq = ""
      let autor = ""
      let origem = ""
      let hora = this.acionaFormataHoraAtual()
      let msg = this.mensagem;
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
        return
      }

      // Msg sendo disparada pelo textarea
      if (!objMsgExterno) {
        for (let j = 0; j < this.emojis.length; j++) {
          regex = new RegExp(this.emojis[j].emoji, "gi");
          this.mensagem = this.mensagem.replace(regex, this.emojis[j].hexa);
        }

        msg = this.mensagem.replace(/<\/?[\d\w\s=\-:\.\/\'\";]+>/gi, ' ')

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
        }

        if(this.statusEnvio){
          status = this.statusEnvio
        }else{
          status = "D"
        }

        autor = this.nomeOpe || "Operador"
        origem = "principal"

        if(arrMsg[arrMsg.length - 1]){
          let seqAnterior = arrMsg[arrMsg.length - 1].seq
          seqAnterior = seqAnterior.split("_")
          if(seqAnterior.length){
            seqAnterior[seqAnterior.length - 1] = parseInt(seqAnterior[seqAnterior.length - 1]) + 1
            seq = seqAnterior.join("_")
          }
        }

        this.$store.dispatch("setMensagemViaTextarea", true)

        setTimeout(() => {
          this.$root.$emit("rola-chat")
        }, 250)

      } else {

        msg = objMsgExterno.msg;

        if(objMsgExterno.anexos){
          anexo = true
          regex = /(\w+)\/(\w+)/g;
          let type = regex.exec(objMsgExterno.anexos.type);

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

      arrMsg.push(objMensagem)

      if(objMsgExterno){
        this.$root.$emit("verificar-seq")
      }

      if(this.statusEnvio !== "E" && !objMsgExterno){
        this.resetar()
      }

    },
    acionaFormataHoraAtual() {
      return formataHoraAtual()
    },
    verificaTemMsgFormatada(){
      let valor = ''
      let tokenCliente = this.atendimentoAtivo.token_cliente

      obterMsgFormatada(valor, tokenCliente)
        .then((data) => {
          if(!data){
            this.temMsgFormatada = false
          }else{
            this.temMsgFormatada = true
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
        this.alterarValoresVariaveisCSS("aberto")
      } else {
        // Textarea menor que 3 linhas
        if(this.tamanhoText < 70){
          this.alterarValoresVariaveisCSS("padrao")
        // Textarea maior/igual a 3 linhas
        }else{
          this.alterarValoresVariaveisCSS("medio")
        }

        this.mensagensFormatadas_01 = []
        this.chaveAtual_01 = ''
        this.mensagensFormatadas_02 = []
        this.chaveAtual_02 = ''
        this.mensagensFormatadas_03 = []
        this.chaveAtual_03 = ''
      }
    },
    selecionarMsgFormatada() {
      this.abreFechaMsgFormatada()

      if(!this.$store.getters.getVerificaMsgFormatadaAberto){
        return
      }

      let valor = ''
      let tokenCliente = this.atendimentoAtivo.token_cliente

      obterMsgFormatada(valor, tokenCliente)
        .then((data) => {
          this.exibirMsgFormatada(data, 1)
        })
        .catch((err) => console.log(err));
    },
    exibirMsgFormatada(objMsgFormatada, numReq) {
      switch(numReq){
        case 1:
          this.mensagensFormatadas_01 = objMsgFormatada
          if(Object.keys(this.mensagensFormatadas_01)){
            if(Object.keys(this.mensagensFormatadas_01).length == 1){
              this.chaveAtual_01 = Object.keys(this.mensagensFormatadas_01)[0]
              this.recebeValorMSGFormatada(this.chaveAtual_01, 2)
            }else{
              this.chaveAtual_01 = ""
            }
          }
        break;
        case 2:
          this.mensagensFormatadas_02 = objMsgFormatada
        break;
        case 3:
          if(objMsgFormatada.length){
            this.mensagensFormatadas_03 = objMsgFormatada
            if(this.mensagensFormatadas_03.length == 1){
              this.chaveAtual_03 = 0
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
    recebeValorMSGFormatada(valor, numReq){

      if(valor.length == 1){

        if(this.mensagensFormatadas_02.length){
          this.mensagensFormatadas_02 = []
          this.chaveAtual_02 = ''
        }
        if(this.mensagensFormatadas_03.length){
          this.mensagensFormatadas_03 = []
          this.chaveAtual_03 = ''
        }
      }

      let tokenCliente = this.atendimentoAtivo.token_cliente
      obterMsgFormatada(valor, tokenCliente)
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
    insereMsgFormatadaNoTextarea(arrayMsgFormatada, indice){

      if(typeof indice !== 'number'){
        this.$toasted.global.defaultError({msg: 'Selecione uma mensagem'})
        return
      }

      const cod = arrayMsgFormatada[indice].cod
      const msg = arrayMsgFormatada[indice].value
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
    abrePopupMsgTipo2(arrayMsgFormatada, indice){
      const objMsg = arrayMsgFormatada[indice]

      if(objMsg){

        if(this.semIframe){
          this.$store.dispatch("setSemIframe", false)
        }

        this.$store.dispatch("setOrigemBlocker", "msg-formatada")
        this.$store.dispatch("setBlocker", true)
        this.$store.dispatch("setAbrirMsgTipo2", true)

        this.$store.dispatch("setAssunto", objMsg.cod)
        this.$store.dispatch("setCategoria", this.chaveAtual_02)
        this.$store.dispatch("setNroChat", this.atendimentoAtivo.nro_chat)
        this.$store.dispatch("setGrupo", this.atendimentoAtivo.grupo)
      }
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

      if(this.tamanhoText >= 70){
        this.alterarValoresVariaveisCSS("medio")
      }else{
        this.alterarValoresVariaveisCSS("padrao")
      }
    },
    alterarValoresVariaveisCSS(tipo){
      const root = document.documentElement

      switch(tipo){
        case "padrao":
          // Ultimo breakpoint
          if(this.alturaTela >= 900){
            root.style.setProperty('--altura-chat-corpo', "79%")
          // Setimo breakpoint
          }else if(this.alturaTela >= 800){
            root.style.setProperty('--altura-chat-corpo', "78%")
          // Sexto breakpoint
          }else if(this.alturaTela >= 750){
            root.style.setProperty('--altura-chat-corpo', "76.5%")
          // Quinto breakpoint
          } else if(this.alturaTela >= 700){
            root.style.setProperty('--altura-chat-corpo', "75%")
          // Quarto breakpoint
          }else if(this.alturaTela >= 637){
            root.style.setProperty('--altura-chat-corpo', "73%")
          // Terceiro breakpoint
          }else if(this.alturaTela >= 550){
            root.style.setProperty('--altura-chat-corpo', "68%")
          // Segundo breakpoint
          }else if(this.alturaTela >= 500){
            root.style.setProperty('--altura-chat-corpo', "66%")
          // Primeiro breakpoint
          }else{
            root.style.setProperty('--altura-chat-corpo', "64%")
          }
        break;
        case "medio":
          // Ultimo breakpoint
          if(this.alturaTela >= 900){
            root.style.setProperty('--altura-chat-corpo', "78%")
          // Setimo breakpoint
          }else if(this.alturaTela >= 800){
            root.style.setProperty('--altura-chat-corpo', "75%")
          // Sexto breakpoint
          }else if(this.alturaTela >= 750){
            root.style.setProperty('--altura-chat-corpo', "74%")
          // Quinto breakpoint
          } else if(this.alturaTela >= 700){
            root.style.setProperty('--altura-chat-corpo', "72%")
          // Quarto breakpoint
          }else if(this.alturaTela >= 637){
            root.style.setProperty('--altura-chat-corpo', "70%")
          // Terceiro breakpoint
          }else if(this.alturaTela >= 550){
            root.style.setProperty('--altura-chat-corpo', "65%")
          // Segundo breakpoint
          }else if(this.alturaTela >= 500){
            root.style.setProperty('--altura-chat-corpo', "63%")
          // Primeiro breakpoint
          }else{
            root.style.setProperty('--altura-chat-corpo', "62%")
          }
        break;
        case "aberto":
          // Ultimo breakpoint
          if(this.alturaTela >= 900){
            root.style.setProperty('--altura-chat-corpo', "63%")
          // Setimo breakpoint
          }else if(this.alturaTela >= 800){
            root.style.setProperty('--altura-chat-corpo', "60%")
          // Sexto breakpoint
          }else if(this.alturaTela >= 750){
            root.style.setProperty('--altura-chat-corpo', "58.5%")
          // Quinto breakpoint
          } else if(this.alturaTela >= 700){
            root.style.setProperty('--altura-chat-corpo', "55%")
          // Quarto breakpoint
          }else if(this.alturaTela >= 637){
            root.style.setProperty('--altura-chat-corpo', "50%")
          // Terceiro breakpoint
          }else if(this.alturaTela >= 550){
            root.style.setProperty('--altura-chat-corpo', "43%")
          // Segundo breakpoint
          }else if(this.alturaTela >= 500){
            root.style.setProperty('--altura-chat-corpo', "38%")
          // Primeiro breakpoint
          }else{
            root.style.setProperty('--altura-chat-corpo', '35%')
          }
        break;
      }

    }
  },
  watch: {
    tamanhoText(){
      if(!this.verificaMsgFormatadaAberto){
        // Textarea maior que 70 (tres/quatro linhas)
        if(this.tamanhoText >= 70){
          this.alterarValoresVariaveisCSS("medio")
        // Textarea menor que 70 (uma/duas linha)
        }else{
          this.alterarValoresVariaveisCSS("padrao")
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
      informacoesAberto: "getInformacoesAberto",
      url: "getURL",
      emojis: "getEmojis",
      blocker: "getBlocker",
      tipoMsg: 'getTipoMsg',
      origemBlocker: 'getOrigemBlocker',
      dominio: "getDominio",
      reqTeste: "getReqTeste",
      extImgs: "getExtImgs",
      extDocs: "getExtDocs",
      semIframe: "getSemIframe",
      dicionario: "getDicionario",
      nomeOpe: "getNomeOpe",
      verificaMsgFormatadaAberto: "getVerificaMsgFormatadaAberto",
      abrirEmojis: "getAbrirEmojis"
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
