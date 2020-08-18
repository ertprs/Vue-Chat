<template>
  <div class="chat-rodape">
    <div class="chat-rodape-container">
      <div class="chat-rodape-mensagens" :class="aparecerPrevia ? 'anexo-aberto' : ''">
        <div class="chat-rodape-textarea">
          <!-- Prévia imagem -->
          <div class="chat-rodape-previa-img"  v-show="aparecerPrevia">
            <template v-if="erroFormatoAnexo">
              <h3> {{ txtFormatoInvalido }} </h3>
              <h4> {{ txtFormatosValidos }} </h4>
            </template>
            <template v-if="selecioneAnexo">
              <h3> {{ txtSelecioneAnexo }} </h3>
            </template>
            <img :src="imagemPrevia" v-show="aparecerPrevia && imagemPrevia !== ''" alt="Previa da Imagem Selecionada">
          </div>
          <!-- Emoji -->
          <div id="emoji-container" v-show="!aparecerPrevia">
            <div class="lista-emoji" v-if="abrirEmojis" :class="{'z-index-2' : abrirEmojis}">
              <ul>
                <li v-for="(objEmoji, indice) in emojis" :key="indice"
                  v-on:click="adicionarEmoji(objEmoji.emoji)">
                  {{ objEmoji.emoji }}
                </li>
              </ul>
            </div>
            <div class="btn-emoji" v-on:click="selecionarEmoji()" :class="{'z-index-2' : abrirEmojis}">
              <!-- -->
            </div>
          </div>
          <!-- Textarea -->
          <textarea
            v-show="!aparecerPrevia"
            v-on:keydown.enter="enviarMensagem()"
            id="textarea"
            v-model="mensagem"
            placeholder="Digite sua mensagem"
            no-resize
            rows="1"
            >
          </textarea>
          <span v-show="!aparecerPrevia" class="caracteres-disponiveis"> ({{ qtdCaracteresDisponiveis - mensagem.length }}) </span>
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
          <div class='chat-rodape-botoes-botao' title="Mensagem Formatada" v-on:click="selecionarMsgFormatada()">
            <i class="fas fa-comment"></i>
            <!-- <span> Mensagem Formatada </span> -->
          </div>
          <!-- Btn abrir opcoes -->
          <div class="chat-rodape-botoes-botao botao-enviar-anexo" :class="abrirOpcoes ? 'btn-ativo z-index-2': ''" title="Selecionar Anexo" v-on:click="selecionarAnexo()">
            <i class="fas fa-paperclip"></i>
            <!-- Modal Opcoes -->
            <div class="chat-rodape-anexo-opcoes" v-if="abrirOpcoes" :class="{'z-index-2' : abrirOpcoes}">
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
          <div class="chat-rodape-botoes-botao botao-enviar-msg" title="Enviar Anexo" v-on:click="enviarAnexo()">
            <i class="fas fa-paper-plane"></i>
          </div>
          <div class="chat-rodape-botoes-botao botao-enviar-anexo" title="Alterar Anexo" v-on:click="selecionarImagem()">
            <i class="fas fa-paperclip"></i>
            <div class="chat-rodape-botoes-container-anexo d-none">
              <input type="file" id="file" ref="file" accept="image/*" v-on:change="fileUpload()">
            </div>
          </div>
          <div class="chat-rodape-botoes-botao botao-excluir-anexo" title="Excluir Anexo" v-on:click="excluirAnexo()">
            <i class="fas fa-times-circle"></i>
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'

import axios_api from '../services/serviceAxios'
import axios from "axios"

export default {
  data(){
    return{
      mensagem: '',
      qtdCaracteresDisponiveis: 1500,
      arquivo: '',
      aparecerPrevia: false,
      imagemPrevia: '',
      txtFormatoInvalido: '',
      txtFormatosValidos: '',
      txtSelecioneAnexo: '',
      controle: true,
      qtdInicial: 0,
      abrirOpcoes: false,
      erroFormatoAnexo: false,
      selecioneAnexo: true,
      abrirEmojis: false,
      msgFormatadaAberto: false
    }
  },
  mounted(){
    this.$root.$on('atualizar_mensagem', (objMessage, event) => {
      this.criaObjMensagem(objMessage)
    }),

    document.querySelector('.btn-emoji').innerText = String.fromCodePoint(0x1f61c)

    this.initResize()
  },
  methods: {
    adicionarEmoji(value){
      this.mensagem += value
    },
    enviarMensagem(){

      this.mensagem = this.mensagem.replace(/\n$/, '', this.mensagem)
      let msgAux = this.mensagem

      if(this.validaMensagem()){
          if(this.atendimentoAtivo.token_cliente != '' && this.mensagem != '') {
            this.criaObjMensagem()
            let data = {"token_cliente": this.atendimentoAtivo.token_cliente,"message": this.mensagem}

            this.mensagem = ''
            setTimeout(
              () => {
                document.querySelector('#textarea').value = ''
                this.mensagem = this.mensagem.replace(/\n$/, '', this.mensagem)
              }, 100
            )

            axios_api.put('send-message', data).then(
              response => {
                this.$root.$emit('rolaChat')
                this.abrirEmojis = false
                this.abrirOpcoes = false
              }
            )
            .catch(
              error => {
                this.mensagem = msgAux
                console.log('erro send-message: ', error)
                if(!document.querySelector('.toasted.toasted-primary.error')){
                  this.$toasted.global.defaultError({msg: 'Nao foi possivel enviar a mensagem'})
                }
              }
            )
          }
      }
    },
    verificaRolagem(){
      let corpoMensagens = document.querySelector("#chat-operador > div")
      let tamanhoCorpoMensagem = corpoMensagens.offsetHeight
      let tamanhoScroll = corpoMensagens.scrollHeight

      if(tamanhoScroll > tamanhoCorpoMensagem){
        this.$store.dispatch('setHabilitaRolagem', true)
      }
    },
    validaMensagem(){
      let msg = this.mensagem

      if(msg.length === 0 || !msg.trim()){
        this.mensagem = ''
        return false
      }else if(msg.length > 1500){
        if(!document.querySelector('.toasted.toasted-primary.error')){
          this.$toasted.global.limiteCaracter()
        }
        return false
      }
      // this.mensagem = msg.trim()
      return true;

    },
    criaObjMensagem(objMessage){

      const hora = this.formataHoraAtual()
      let objMensagem = {}
      let msg = this.mensagem

      if(!objMessage){

        let regex = ''
        for(let j = 0; j < this.emojis.length; j++){
          regex = new RegExp(this.emojis[j].emoji, 'gi')
          this.mensagem = this.mensagem.replace(regex, this.emojis[j].hexa)
        }

        objMensagem = {
          autor: 'Operador', // Operador, Cliente
          origem: 'principal', // principal e outros
          msg: msg,
          horario: hora,
          anexo: false,
          imgAnexo: ''
        }
      }else{
        msg = objMessage.msg
        
        objMensagem = {
          autor: 'Cliente', // Operador, Cliente
          origem: 'outros', // principal e outros
          msg: msg,
          horario: objMessage.hora,
          anexo: false,
          imgAnexo: ''
        }
      }
      objMensagem = this.verificaStatusDaMensagem(objMensagem)

      this.$store.dispatch('setTodasMensagens', objMensagem)
    },
    verificaStatusDaMensagem(objMensagem){
      // enviado, recebido, visualizado e ''
      if(objMensagem.origem == 'principal'){
        objMensagem.status = 'enviado'
      }else{
        objMensagem.status = ''
      }

      return objMensagem
    },
    formataHoraAtual(){
      let data            = new Date()
      let hora            = data.getHours()
      hora                = hora < 10 ? '0'+hora : hora
      let minutos         = data.getMinutes()
      minutos             = minutos < 10 ? '0'+minutos : minutos
      const horaFormatada = hora + 'h' + minutos
      return horaFormatada
    },
    selecionarMsgFormatada(){
      // if(!document.querySelector('.toasted.toasted-primary.info')){
      //   this.$toasted.global.emConstrucao()
      // }

      this.msgFormatadaAberto = !this.msgFormatadaAberto
      const chatCorpo = document.querySelector('#chat-operador')
      if(this.msgFormatadaAberto == true){
        chatCorpo.style.height = '70%'
      }else{
        chatCorpo.style.height = '80%'
      }
    },
    selecionarEmoji(){
      this.$store.dispatch('setOrigemBlocker', 'chat')
      this.abrirEmojis = !this.abrirEmojis
      this.$store.dispatch('setBlocker', this.abrirEmojis)
    },
    selecionarAnexo(){
      this.$store.dispatch('setOrigemBlocker', 'chat')
      this.abrirOpcoes = !this.abrirOpcoes
      this.$store.dispatch('setBlocker', this.abrirOpcoes)
    },
    selecionarImagem(){
      let inputFile = document.querySelector('#file')
      inputFile.click()

      this.abrirOpcoes = !this.abrirOpcoes
      this.$store.dispatch('setBlocker', this.abrirOpcoes)
    },
    selecionarDoc(){
      if(!document.querySelector('.toasted.toasted-primary.info')){
        this.$toasted.global.emConstrucao()
      }

      this.abrirOpcoes = !this.abrirOpcoes
      this.$store.dispatch('setBlocker', this.abrirOpcoes)
    },
    fileUpload(){
      this.arquivo = this.$refs.file.files[0]

      let leitorDeImagem = new FileReader()

      leitorDeImagem.addEventListener("load", function () {
        this.aparecerPrevia = true
        this.imagemPrevia = leitorDeImagem.result
      }.bind(this), false)

      if(this.arquivo){
        if( /\.(jpe?g|png|gif)$/i.test(this.arquivo.name) ){
          leitorDeImagem.readAsDataURL(this.arquivo)
          this.erroFormatoAnexo = false
          this.selecioneAnexo = false
        }else{
          this.aparecerPrevia = true
          this.imagemPrevia = ''
          this.erroFormatoAnexo = true
        }
      }else{
        this.arquivo = ''
        this.imagemPrevia = ''
        this.selecioneAnexo = true
      }
    },
    enviarAnexo(){
      if(this.validaAnexo(this.arquivo)){
        this.$store.dispatch('setTodasMensagens', this.criaObjAnexo())

        this.verificaRolagem()
        this.arquivo = ''
        this.imagemPrevia = ''
        this.selecioneAnexo = true
      }
    },
    validaAnexo(arquivo){
      if(arquivo !== ''){
        if( /\.(jpe?g|png|gif)$/i.test(arquivo.name) ){

          return true
        }else{
          if(!document.querySelector('.toasted.toasted-primary.error')){
            this.$toasted.global.formatoInvalido()
          }

          return false
        }
      }
    },
    criaObjAnexo(){
      const hora = this.formataHoraAtual()

      let objMensagem = {
        autor: 'Operador', // Operador, Cliente
        origem: 'principal', // principal e outros
        msg: '',
        horario: hora,
        anexo: true,
        imgAnexo: this.imagemPrevia
      }
      objMensagem = this.verificaStatusDaMensagem(objMensagem)
      return objMensagem
    },
    excluirAnexo(){
      this.arquivo = ''
      this.aparecerPrevia = false
      this.imagemPrevia = ''
    },
    obterAtendimentos() {
      axios
        .get(
          this.$store.getters.getURL + "get-atendimento"
        )
        .then(response => {
          mostrarAtendimentos(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    obterMensagens() {
      var idClientes = [55987654321, 5517987654321];
      axios_api.post('search-message', idClientes)

    },
    enviarInformacao() {
      var informacao = "Testando alguma informacao";
      axios_api.put('send-information', informacao)
    },
    initResize(){
      var observe;
      if (window.attachEvent) {
        observe = function (element, event, handler) {
          element.attachEvent('on'+event, handler);
        };
      }
      else {
        observe = function (element, event, handler) {
          element.addEventListener(event, handler, false);
        };
      }

      var rodapeMsg = document.querySelector('.chat-rodape-mensagens')
      var containerText = document.querySelector('.chat-rodape-textarea')
      var text = document.getElementById('textarea');
      var emojisContainer = document.getElementById('emoji-container')
      var rodapeBotoes = document.querySelector('.chat-rodape-botoes > div')

      var chatCorpo = document.getElementById('chat-operador')

      function resize () {

        text.style.height = 'auto';
        text.style.height = text.scrollHeight+'px';

        rodapeMsg.style.height = text.scrollHeight+'px'

        containerText.style.height = text.scrollHeight+'px'

        emojisContainer.style.height = text.scrollHeight+'px'

        rodapeBotoes.style.height = text.scrollHeight+'px'

        if(chatCorpo.style.height !== '70%'){
          if(text.scrollHeight > 60){
            chatCorpo.style.height = '77%'
          }else{
            chatCorpo.style.height = '80%'
          }
        }
      }
      /* Timeout para garantir que estamos pegando o texto atualizado */
      function delayedResize () {
        window.setTimeout(resize, 0);
      }
      observe(text, 'change',  resize);
      observe(text, 'cut',     delayedResize);
      observe(text, 'paste',   delayedResize);
      observe(text, 'drop',    delayedResize);
      observe(text, 'keydown', delayedResize);
    }
  },
  watch: {
    todasMensagens(){
      if(this.controle == true){
        this.qtdInicial = this.todasMensagens.length
        this.controle = false
      }else{
        this.verificaRolagem()
      }
    },
    abrirEmojis(){
      if(this.abrirEmojis){
        this.abrirOpcoes = false
      }
    },
    abrirOpcoes(){
      if(this.abrirOpcoes){
        this.abrirEmojis = false
      }
    },
    blocker(){
      if(!this.blocker){
        this.abrirOpcoes = false
        this.abrirEmojis = false
      }
    },
    erroFormatoAnexo(){
      if(this.erroFormatoAnexo == false){
        this.txtFormatoInvalido = ''
        this.txtFormatosValidos = ''
      }else{
        this.txtFormatoInvalido = 'Formato Invalido!'
        this.txtFormatosValidos = '.gif, .jpg/jpeg ou .png sao aceitos'
        this.selecioneAnexo = false
      }
    },
    selecioneAnexo(){
      if(this.selecioneAnexo == false){
        this.txtSelecioneAnexo = ''
      }else{
        this.txtSelecioneAnexo = 'Selecione um anexo'
      }
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
      informacoesAberto: 'getInformacoesAberto',
      url: 'getURL',
      emojis: 'getEmojis',
      blocker: 'getBlocker'
    }),
  }
}
</script>

<style>

</style>