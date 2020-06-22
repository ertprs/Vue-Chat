<template>
  <div class="chat-rodape">
    <div class="chat-rodape-container">
      <div class="chat-rodape-mensagens" :class="aparecerPrevia ? 'anexo-aberto' : ''">
        <div class="chat-rodape-textarea">
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
          <textarea
            v-show="!aparecerPrevia"
            v-on:keyup.enter="enviarMensagem()"
            id="textarea"
            v-model="mensagem"
            placeholder="Digite sua mensagem"
            no-resize
            >
          </textarea>
          <span v-show="!aparecerPrevia" class="caracteres-disponiveis"> ({{ qtdCaracteresDisponiveis - mensagem.length }}) </span>
        </div>
      </div>
      <div class="chat-rodape-botoes" :class="aparecerPrevia ? 'anexo-aberto' : ''">
        <template v-if="!aparecerPrevia">
          <div class="chat-rodape-botoes-botao botao-enviar-msg" title="Enviar" enviar-msg v-on:click="enviarMensagem()">
            <i class="fas fa-paper-plane"></i>
          </div>
          <div class="chat-rodape-botoes-botao botao-enviar-anexo" :class="abrirOpcoes ? 'btn-ativo': ''" title="Selecionar Anexo" v-on:click="selecionarAnexo()">
            <i class="fas fa-paperclip"></i>

            <div class="chat-rodape-anexo-opcoes" v-if="abrirOpcoes">
              <div v-on:click="selecionarImagem()">
                <i class="fas fa-image"></i>
                <span> Imagem </span>
              </div>
              <div v-on:click="selecionarDoc()">
                <i class="fas fa-file-alt"></i>
                <span> Documento </span>
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
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
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
      selecioneAnexo: true
    }
  },
  methods: {
    ...mapMutations(['setTodasMensagens', 'setHabilitaRolagem']),

    enviarMensagem(){
      if(this.validaMensagem()){
        let msg = this.mensagem;
        if( msg != '' ) {
          let jsonMensagem = {
            "id": this.atendimentoAtivo.id,
            "message": this.mensagem,
            "origin": "OPE"
          }
          axios
            .put(
              "https://linux03/im/atdHumano/middleware/atd_api.php/send-message",
              { ...jsonMensagem }
            )
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
            });
          this.setTodasMensagens(this.criaObjMensagem())
          this.mensagem = ''
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
      }else{
        if(msg.length > 1500){
          if(!document.querySelector('.toasted.toasted-primary.error')){
            this.$toasted.global.limiteCaracter()
          }
          return false
        }

        this.mensagem = msg.trim()
        return true;
      }
    },
    criaObjMensagem(){
      const hora = this.formataHoraAtual()

      let objMensagem = {
        autor: 'Operador', // Operador, Cliente
        origem: 'principal', // principal e outros
        msg: this.mensagem,
        horario: hora,
        anexo: false,
        imgAnexo: ''
      }

      objMensagem = this.verificaStatusDaMensagem(objMensagem)

      return objMensagem
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
    selecionarAnexo(){
      this.abrirOpcoes = !this.abrirOpcoes
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
          "https://linux03/im/atdHumano/middleware/atd_api.php/get-atendimento"
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
      axios
        .post(
          "https://linux03/im/atdHumano/middleware/atd_api.php/search-message",
          { idClientes }
        )
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    enviarInformacao() {
      var informacao = "Testando alguma informacao";
      axios
        .post(
          "https://linux03/im/atdHumano/middleware/atd_api.php/send-information",
          { informacao }
        )
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
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
      todasMensagens: 'getTodasMensagens',
      informacoesAberto: 'getInformacoesAberto',
      url: 'getURL'
    })
  }
}
</script>

<style>

</style>