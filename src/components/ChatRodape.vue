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
            >
          </textarea>
          <span v-show="!aparecerPrevia" class="caracteres-disponiveis"> ({{ qtdCaracteresDisponiveis - mensagem.length }}) </span>
        </div>
      </div>
      <!-- Outros Botões -->
      <div class="chat-rodape-botoes" :class="aparecerPrevia ? 'anexo-aberto' : ''">
        <template v-if="!aparecerPrevia">
          <div class="chat-rodape-botoes-botao botao-enviar-msg" title="Enviar" enviar-msg v-on:click="enviarMensagem()">
            <i class="fas fa-paper-plane"></i>
          </div>
          <div class="chat-rodape-botoes-botao botao-enviar-anexo" :class="abrirOpcoes ? 'btn-ativo z-index-2': ''" title="Selecionar Anexo" v-on:click="selecionarAnexo()">
            <i class="fas fa-paperclip"></i>

            <div class="chat-rodape-anexo-opcoes" v-if="abrirOpcoes" :class="{'z-index-2' : abrirOpcoes}">
              <div class="imagens" v-on:click="selecionarImagem()" title="Imagem">
                <i class="fas fa-image"></i>
                <!-- <span> Imagem </span> -->
              </div>
              <div class="docs" v-on:click="selecionarDoc()" title="Documento">
                <i class="fas fa-file-alt"></i>
                <!-- <span> Documento </span> -->
              </div>
              <div class='msg-formatada' v-on:click="selecionarDoc()" title="Mensagem Formatada">
                <i class="fas fa-comment"></i>
                <!-- <span> Mensagem Formatada </span> -->
              </div>
            </div>

            <div class="chat-rodape-botoes-container-anexo d-none">
              <input type="file" id="file" ref="file" accept="image/*" v-on:change="fileUpload()">
            </div>

          </div>
        </template>
        <template v-else>
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
        </template>
      </div>
    </div>
  </div>
</template>
<script>

import { mapMutations, mapGetters } from 'vuex'

import axios_api from '../services/axios_api'
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
      abrirEmojis: false
    }
  },
  mounted(){
    this.$root.$on('atualizar_mensagem', (objMessage, event) => {
      this.criaObjMensagem(objMessage)
    }),
    document.querySelector('.btn-emoji').innerText = String.fromCodePoint(0x1f61c)
  },
  methods: {
    adicionarEmoji(value){
      this.mensagem += value
    },

    ...mapMutations(['setTodasMensagens', 'setHabilitaRolagem', 'setBlocker', 'setOrigemBlocker']),

    enviarMensagem(){

      this.mensagem = this.mensagem.replace(/\n$/, '', this.mensagem)

      if(this.validaMensagem()){
          if(this.atendimentoAtivo.token_cliente != '' && this.mensagem != '') {
            this.criaObjMensagem()
            let data = {"token_cliente": this.atendimentoAtivo.token_cliente,"message": this.mensagem}
            axios_api.put('send-message', data).then(
              response => {
                this.mensagem = ''
                this.$root.$emit('rolaChat')
                this.abrirEmojis = false
                this.abrirOpcoes = false
              }
            )
            .catch(
              error => {
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
        this.setHabilitaRolagem(true)
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
      this.setTodasMensagens(objMensagem)
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
    selecionarEmoji(){
      this.setOrigemBlocker('chat')
      this.abrirEmojis = !this.abrirEmojis
      this.setBlocker(this.abrirEmojis)
    },
    selecionarAnexo(){
      this.setOrigemBlocker('chat')
      this.abrirOpcoes = !this.abrirOpcoes
      this.setBlocker(this.abrirOpcoes)
    },
    selecionarImagem(){
      let inputFile = document.querySelector('#file')
      inputFile.click()

      this.abrirOpcoes = !this.abrirOpcoes
    },
    selecionarDoc(){
      if(!document.querySelector('.toasted.toasted-primary.info')){
        this.$toasted.global.emConstrucao()
      }

      this.abrirOpcoes = !this.abrirOpcoes
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
        this.setTodasMensagens(this.criaObjAnexo())
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