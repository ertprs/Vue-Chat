<template>
  <div class="chat-rodape">
    <div class="chat-rodape-container">
      <div class="chat-rodape-mensagens" :class="aparecerPrevia ? 'anexo-aberto' : ''">
        <div class="chat-rodape-textarea">
          <!-- Prévia imagem -->
          <div class="chat-rodape-previa-img" v-show="aparecerPrevia">
            <div class="formato-invalido" v-if="erroFormatoAnexo">
              <h3>{{ txtFormatoInvalido }}</h3>
              <h4>{{ txtFormatosValidos }}</h4>
            </div>
            <template v-if="selecioneAnexo">
              <h3>{{ txtSelecioneAnexo }}</h3>
            </template>
            <template v-if="arquivo.name && !erroFormatoAnexo && !selecioneAnexo">
              <h3>{{ this.arquivo.name }}</h3>
            </template>
            <div class="container-previa-img" v-show="aparecerPrevia && imagemPrevia !== ''">
              <img
                :src="imagemPrevia"
                alt="Previa da Imagem Selecionada"
              />
            </div>
            <div 
              v-show="aparecerPrevia && imagemPrevia !== ''"
              v-on:click="excluirAnexo()" 
              title="Cancelar selecao de anexo" 
              class="btn-excluir-anexo">
              <i class="fas fa-times-circle"></i>
            </div>
          </div>
          <!-- Emoji -->
          <div id="emoji-container" v-show="!aparecerPrevia">
            <div class="lista-emoji" v-if="abrirEmojis" :class="{'z-index-2' : abrirEmojis}">
              <ul>
                <li
                  v-for="(objEmoji, indice) in emojis"
                  :key="indice"
                  v-on:click="adicionarEmoji(objEmoji.emoji)"
                >{{ objEmoji.emoji }}</li>
              </ul>
            </div>
            <div
              class="btn-emoji"
              v-on:click="selecionarEmoji()"
              :class="{'z-index-2' : abrirEmojis}"
            >
              <!-- -->
            </div>
          </div>
          <!-- Textarea -->
          <textarea
            v-show="!aparecerPrevia"
            v-on:keydown.enter="enviarMensagem($event)"
            id="textarea"
            v-model="mensagem"
            placeholder="Digite sua mensagem"
            no-resize
            rows="1"
          ></textarea>
          <span
            v-show="!aparecerPrevia"
            class="caracteres-disponiveis"
          >({{ qtdCaracteresDisponiveis - mensagem.length }})</span>
        </div>
      </div>
      <!-- Outros Botões -->
      <div class="chat-rodape-botoes" :class="aparecerPrevia ? 'anexo-aberto' : ''">
        <!-- Anexo não selecionado -->
        <div :class="{'d-none' : aparecerPrevia}">
          <!-- Btn enviar msg -->
          <div class="chat-rodape-botoes-botao" title="Enviar" v-on:click="enviarMensagem()">
            <i class="fas fa-paper-plane"></i>
          </div>
          <!-- Btn abrir msg formatada -->
          <div
            class="chat-rodape-botoes-botao"
            title="Mensagem Formatada"
            v-on:click="selecionarMsgFormatada()"
          >
            <i class="fas fa-comment"></i>
            <!-- <span> Mensagem Formatada </span> -->
          </div>
          <!-- Btn abrir opcoes -->
          <div
            class="chat-rodape-botoes-botao botao-enviar-anexo"
            :class="abrirOpcoes ? 'btn-ativo z-index-2': ''"
            title="Selecionar Anexo"
            v-on:click="selecionarAnexo()"
          >
            <i class="fas fa-paperclip"></i>
            <!-- Modal Opcoes -->
            <div
              class="chat-rodape-anexo-opcoes"
              v-if="abrirOpcoes"
              :class="{'z-index-2' : abrirOpcoes}"
            >
              <!-- Btn selecionar imagem -->
              <div class="imagens" v-on:click="selecionarImagem()" title="Imagem">
                <i class="fas fa-image"></i>
                <!-- <span> Imagem </span> -->
              </div>
              <!-- Btn selecionar documentos -->
              <div class="docs" v-on:click="selecionarDoc()" title="Documento">
                <i class="fas fa-file-alt"></i>
                <!-- <span> Documento </span> -->
              </div>
            </div>
          </div>
        </div>
        <div :class="{'d-none' : !aparecerPrevia}">
          <div
            class="chat-rodape-botoes-botao botao-enviar-msg"
            title="Enviar Anexo"
            v-on:click="enviarAnexo()"
          >
            <i class="fas fa-paper-plane"></i>
          </div>
          <div
            class="chat-rodape-botoes-botao botao-enviar-anexo"
            title="Alterar Anexo"
            v-on:click="selecionarImagem()"
          >
            <i class="fas fa-paperclip"></i>
            <div class="chat-rodape-botoes-container-anexo d-none">
              <input type="file" id="file" ref="file" accept="image/*" v-on:change="fileUpload()" />
            </div>
          </div>
          <div
            class="chat-rodape-botoes-botao botao-excluir-anexo"
            title="Cancelar selecao de anexo"
            v-on:click="excluirAnexo()"
          >
            <i class="fas fa-times-circle"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- Container mensagens formatadas-->
    <transition name="fade">
      <div class="chat-rodape-msg-formatada" v-show="msgFormatadaAberto">
        <!-- Select 01 -->
        <select
          name="select-msg-formatada_01"
          class="select-msg-formatada"
          v-model="chaveAtual_01"
          v-on:change="recebeValorMSGFormatada(chaveAtual_01, 2)">
          <option disabled value="">Selecione</option>
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
            <option disabled value="">Selecione</option>
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
              <option disabled value="">Selecione</option>
              <option v-for="(valor, indice) in mensagensFormatadas_03" :key="indice"
                :value="indice">
                {{ valor.value }}
              </option>
            </select>
            <div class="btn-select-03"
              v-show="tipoMsg == 1"
              title="Preencher campo de mensagem"
              @click="insereMsgFormatadaNoTextarea(mensagensFormatadas_03, chaveAtual_03)">
              <i class="fas fa-level-up-alt"></i>
            </div>
            <div class="btn-select-03"
              v-show="tipoMsg == 2"
              title="Abrir msg tipo 02"
              @click="abrePopupMsgTipo2(mensagensFormatadas_03, chaveAtual_03)">
              <i class="far fa-file-alt"></i>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <botoes-acoes />
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
    opacity: 0;
  }
</style>

<script>

import { mapGetters } from "vuex";
import BotoesAcoes from './BotoesAcoes'
import { obterMsgFormatada } from "../services/msgFormatada";
import axios_api from "../services/serviceAxios";
import axios from "axios";

export default {
  data() {
    return {
      mensagem: "",
      qtdCaracteresDisponiveis: 1500,
      arquivo: "",
      aparecerPrevia: false,
      imagemPrevia: "",
      txtFormatoInvalido: "",
      txtFormatosValidos: "",
      txtSelecioneAnexo: "",
      controle: true,
      qtdInicial: 0,
      abrirOpcoes: false,
      erroFormatoAnexo: false,
      selecioneAnexo: true,
      abrirEmojis: false,
      msgFormatadaAberto: false,
      mensagensFormatadas_01: [],
      chaveAtual_01: '',
      mensagensFormatadas_02: [],
      chaveAtual_02: '',
      mensagensFormatadas_03: [],
      chaveAtual_03: ''
    };
  },
  components: {
    'botoes-acoes': BotoesAcoes
  },
  mounted() {
    this.$root.$on("atualizar_mensagem", (objMessage, event) => {
      this.criaObjMensagem(objMessage);
    }),
      (document.querySelector(".btn-emoji").innerText = String.fromCodePoint(
        0x1f61c
      ));

    window.addEventListener("message", this.listenerPostMessage, false);

    this.initResize();
  },
  methods: {
    adicionarEmoji(value) {
      document.querySelector('#textarea').focus()
      this.mensagem += value;
    },
    enviarMensagem(event) {
      if(this.blocker && this.origemBlocker !== 'msg-formatada'){
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

      const msgAux = this.mensagem

      if (this.validaMensagem()) {
        if (this.atendimentoAtivo.token_cliente != "" && this.mensagem != "") {
          this.criaObjMensagem();
          let data = {
            token_cliente: this.atendimentoAtivo.token_cliente,
            message: this.mensagem,
          };

          this.mensagem = "";

          axios_api
            .put("send-message", data)
            .then((response) => {
              this.abrirEmojis = false;
              this.abrirOpcoes = false;
              this.$root.$emit("rolaChat")
            })
            .catch((error) => {
              console.log("erro send-message: ", error);
              this.mensagem = msgAux
              if (!document.querySelector(".toasted.toasted-primary.error")) {
                this.$toasted.global.defaultError({
                  msg: "Nao foi possivel enviar a mensagem",
                });
              }
            });
        }
      }
    },
    verificaRolagem() {
      let corpoMensagens = document.querySelector("#chat-operador > div");
      let tamanhoCorpoMensagem = corpoMensagens.offsetHeight;
      let tamanhoScroll = corpoMensagens.scrollHeight;

      if (tamanhoScroll > tamanhoCorpoMensagem) {
        this.$store.dispatch("setHabilitaRolagem", true);
      }
    },
    validaMensagem() {
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
      // this.mensagem = msg.trim()
      return true;
    },
    criaObjMensagem(objMessage) {
      const hora = this.formataHoraAtual();
      let objMensagem = {};
      let msg = this.mensagem;

      if (!objMessage) {
        let regex = "";
        for (let j = 0; j < this.emojis.length; j++) {
          regex = new RegExp(this.emojis[j].emoji, "gi");
          this.mensagem = this.mensagem.replace(regex, this.emojis[j].hexa);
        }

        objMensagem = {
          autor: "Operador", // Operador, Cliente
          origem: "principal", // principal e outros
          msg: msg,
          horario: hora,
          anexo: false,
          imgAnexo: "",
        };
      } else {
        msg = objMessage.msg;

        objMensagem = {
          autor: "Cliente", // Operador, Cliente
          origem: "outros", // principal e outros
          msg: msg,
          horario: objMessage.hora,
          anexo: false,
          imgAnexo: "",
        };
      }
      objMensagem = this.verificaStatusDaMensagem(objMensagem);

      this.$store.dispatch("setTodasMensagens", objMensagem);
    },
    verificaStatusDaMensagem(objMensagem) {
      // enviado, recebido, visualizado e ''
      if (objMensagem.origem == "principal") {
        objMensagem.status = "enviado";
      } else {
        objMensagem.status = "";
      }

      return objMensagem;
    },
    formataHoraAtual() {
      let data = new Date();
      let hora = data.getHours();
      hora = hora < 10 ? "0" + hora : hora;
      let minutos = data.getMinutes();
      minutos = minutos < 10 ? "0" + minutos : minutos;
      let segundos = data.getSeconds()
      segundos = segundos < 10 ? "0" + segundos : segundos;
      const horaFormatada = hora + ":" + minutos + ":" + segundos;
      return horaFormatada;
    },
    abreFechaMsgFormatada(){
      this.msgFormatadaAberto = !this.msgFormatadaAberto;

      const chatCorpo = document.querySelector("#chat-operador");
      if (this.msgFormatadaAberto == true) {
        chatCorpo.style.height = "50%";
      } else {
        chatCorpo.style.height = "70%";
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
          console.log('msgFormatada_01: ', this.mensagensFormatadas_01)
        break;
        case 2:
          this.mensagensFormatadas_02 = objMsgFormatada
          console.log('msgFormatada_02: ', this.mensagensFormatadas_02)
        break;
        case 3:
          if(objMsgFormatada.length){
            this.mensagensFormatadas_03 = objMsgFormatada
            console.log('msgFormatada_03: ', this.mensagensFormatadas_03)
          }else{
            this.mensagensFormatadas_03 = []
            this.$toasted.global.emConstrucao({msg: 'Sem mensagens para as opcoes selecionadas'})
            console.log('Nao ha msgs formatadas: ', objMsgFormatada)
          }
        break;
      }
    },
    recebeValorMSGFormatada(valor, numReq){
      console.log('valor: ', valor)
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
          this.exibirMsgFormatada(data, numReq)
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
      console.log('msg: ', arrayMsgFormatada[indice])
      const objMsg = arrayMsgFormatada[indice]

      if(objMsg){
        this.$store.dispatch("setOrigemBlocker", "msg-formatada")
        this.$store.dispatch("setBlocker", true)
        this.$store.dispatch("setAbrirMsgTipo2", true)
        
        this.$store.dispatch("setAssunto", objMsg.cod)
        this.$store.dispatch("setCategoria", this.chaveAtual_02)
        this.$store.dispatch("setNroChat", this.atendimentoAtivo.nro_chat)
        this.$store.dispatch("setGrupo", this.atendimentoAtivo.grupo)
      }

      // this.$toasted.global.emConstrucao()
    },
    selecionarEmoji() {
      this.$store.dispatch("setOrigemBlocker", "chat");
      this.abrirEmojis = !this.abrirEmojis;
      this.$store.dispatch("setBlocker", this.abrirEmojis);
    },
    selecionarAnexo() {
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
      if (!document.querySelector(".toasted.toasted-primary.info")) {
        this.$toasted.global.emConstrucao();
      }

      this.abrirOpcoes = !this.abrirOpcoes;
      this.$store.dispatch("setBlocker", this.abrirOpcoes);
    },
    fileUpload() {
      this.arquivo = this.$refs.file.files[0];
      let leitorDeImagem = new FileReader();
      leitorDeImagem.addEventListener(
        "load",
        function () {
          this.aparecerPrevia = true;
          this.imagemPrevia = leitorDeImagem.result;
        }.bind(this),
        false
      );

      if (this.arquivo) {
        if (/\.(jpe?g|png|gif)$/i.test(this.arquivo.name)) {
          leitorDeImagem.readAsDataURL(this.arquivo);
          this.erroFormatoAnexo = false;
          this.selecioneAnexo = false;
        } else {
          this.aparecerPrevia = true;
          this.imagemPrevia = "";
          this.erroFormatoAnexo = true;
        }
      } else {
        this.arquivo = "";
        this.imagemPrevia = "";
        this.selecioneAnexo = true;
      }
    },
    enviarAnexo() {
      if (this.validaAnexo(this.arquivo)) {
        this.$store.dispatch("setTodasMensagens", this.criaObjAnexo());
        this.verificaRolagem();
        this.arquivo = "";
        this.imagemPrevia = "";
        this.selecioneAnexo = true;
      }
    },
    validaAnexo(arquivo) {
      if (arquivo !== "") {
        if (/\.(jpe?g|png|gif)$/i.test(arquivo.name)) {
          return true;
        } else {
          if (!document.querySelector(".toasted.toasted-primary.error")) {
            this.$toasted.global.formatoInvalido();
          }

          return false;
        }
      }
    },
    criaObjAnexo() {
      const hora = this.formataHoraAtual();

      let objMensagem = {
        autor: "Operador", // Operador, Cliente
        origem: "principal", // principal e outros
        msg: "",
        horario: hora,
        anexo: true,
        imgAnexo: this.imagemPrevia,
      };
      objMensagem = this.verificaStatusDaMensagem(objMensagem);
      return objMensagem;
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

      var rodapeMsg = document.querySelector(".chat-rodape-mensagens");
      var containerText = document.querySelector(".chat-rodape-textarea");
      var text = document.getElementById("textarea");
      var emojisContainer = document.getElementById("emoji-container");
      var rodapeBotoes = document.querySelector(".chat-rodape-botoes > div");

      var chatCorpo = document.getElementById("chat-operador");

      function resize() {
        text.style.height = "auto";
        text.style.height = text.scrollHeight + "px";
        rodapeMsg.style.height = text.scrollHeight + "px";
        containerText.style.height = text.scrollHeight + "px";
        emojisContainer.style.height = text.scrollHeight + "px";
        rodapeBotoes.style.height = text.scrollHeight + "px";

        if (chatCorpo.style.height !== "50%") {
          if (text.scrollHeight > 60) {
            chatCorpo.style.height = "67%";
          } else {
            chatCorpo.style.height = "70%";
          }
        }
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
      
      let baseUrl = ''
      if(window.location.hostname == 'localhost'){
        baseUrl = 'https://linux03'
      }else{
        baseUrl = 'https://'+window.location.hostname
      }


      console.log(event.origin)
      console.log(baseUrl)

      if(event.origin == baseUrl){
        this.mensagem = event.data
        document.querySelector('#textarea').focus()

        this.$store.dispatch("setBlocker", false)
        this.$store.dispatch("setAbrirMsgTipo2", false)
        this.abreFechaMsgFormatada()
      }
    }
  },
  watch: {
    todasMensagens() {
      if (this.controle == true) {
        this.qtdInicial = this.todasMensagens.length;
        this.controle = false;
      } else {
        this.verificaRolagem();
      }
    },
    abrirEmojis() {
      if (this.abrirEmojis) {
        this.abrirOpcoes = false;
      }
    },
    abrirOpcoes() {
      if (this.abrirOpcoes) {
        this.abrirEmojis = false;
      }
    },
    blocker() {
      if (!this.blocker) {
        this.abrirOpcoes = false;
        this.abrirEmojis = false;
        this.$store.dispatch("setAbrirMsgTipo2", false)
      }
    },
    erroFormatoAnexo() {
      if (this.erroFormatoAnexo == false) {
        this.txtFormatoInvalido = "";
        this.txtFormatosValidos = "";
      } else {
        this.txtFormatoInvalido = "Formato Invalido!";
        this.txtFormatosValidos = ".gif, .jpg/jpeg ou .png sao aceitos";
        this.selecioneAnexo = false;
      }
    },
    selecioneAnexo() {
      if (this.selecioneAnexo == false) {
        this.txtSelecioneAnexo = "";
      } else {
        this.txtSelecioneAnexo = "Selecione um anexo";
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
      origemBlocker: 'getOrigemBlocker'
    })
  },
  beforeDestroy: function() {
  }
};
</script>

<style>
</style>