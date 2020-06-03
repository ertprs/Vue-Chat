<template>
  <div class="chat-rodape">
    <div class="chat-rodape-mensagens">
      <div class="chat-rodape-textarea" v-if="!hsm">
        <div class="chat-rodape-previa-img"  v-show="aparecerPrevia">
          <h2> {{ txtFormatoInvalido }} </h2>
          <h3> {{ txtFormatosValidos }} </h3>
          <img :src="imagemPrevia" v-show="aparecerPrevia && imagemPrevia !== ''" alt="Previa da Imagem Selecionada">
        </div>
        <b-form-textarea
          v-show="!aparecerPrevia"
          v-on:keyup.enter="enviarMensagem()"
          id="textarea"
          v-model="mensagem"
          placeholder="Digite sua mensagem"
          rows="7"
          no-resize
          >
        </b-form-textarea>
        <span v-show="!aparecerPrevia" class="caracteres-disponiveis"> ({{ qtdCaracteresDisponiveis - mensagem.length }}) </span>
      </div>
      <div class="chat-rodape-hsm" v-else>
        <!-- Estilizar melhor -->
        <span> <b> HSM: </b>Para iniciar uma conversa, seleciona uma mensagem abaixo. Depois de selecionar, preencha os dados de identificação do cliente </span>
        <div class="select-hsm-container">
          <select name="select-hsm" id="select-hsm">
            <option value="">Mensagem Formatada do HSM</option>
          </select>
          <div class="hsm-btn">
            <p> Dados do Cliente </p>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-rodape-botoes">
      <template v-if="!aparecerPrevia"> 
        <div class="chat-rodape-botoes-botao botao-enviar-msg" :class="informacoesAberto ? 'icones-fechado' : ''" title="Enviar" v-on:click="enviarMensagem()">
          <i class="fas fa-paper-plane"></i>
          <span v-show="!informacoesAberto"> Enviar </span>
        </div>
        <div class="chat-rodape-botoes-botao botao-enviar-anexo" :class="informacoesAberto ? 'icones-fechado' : ''" title="Selecionar Anexo" v-on:click="selecionarAnexo()">
          <i class="fas fa-paperclip"></i>
          <span v-show="!informacoesAberto"> Selecionar Anexo </span>

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
        <div class="chat-rodape-botoes-botao botao-encerrar" :class="informacoesAberto ? 'icones-fechado' : ''" title="Encerrar" v-on:click="encerrarAtendimento()">
          <i class="fas fa-sign-out-alt"></i>
          <span v-show="!informacoesAberto"> Encerrar </span>
        </div>
        <div class="chat-rodape-botoes-botao botao-retornar" :class="informacoesAberto ? 'icones-fechado' : ''" title="Retornar" v-on:click="retornarForm()">
          <i class="fas fa-undo"></i>
          <span v-show="!informacoesAberto"> Retornar </span>
        </div>
      </template>
      <template v-else>
        <div class="chat-rodape-botoes-botao botao-enviar-msg" :class="informacoesAberto ? 'icones-fechado' : ''" title="Enviar Anexo" v-on:click="enviarAnexo()">
          <i class="fas fa-paper-plane"></i>
          <span v-show="!informacoesAberto"> Enviar Anexo </span>
        </div>
        <div class="chat-rodape-botoes-botao botao-enviar-anexo" :class="informacoesAberto ? 'icones-fechado' : ''" title="Alterar Anexo" v-on:click="selecionarAnexo()">
          <i class="fas fa-paperclip"></i>
          <span v-show="!informacoesAberto"> Alterar Anexo </span>

          <div class="chat-rodape-botoes-container-anexo d-none">
            <input type="file" id="file" ref="file" accept="image/*" v-on:change="fileUpload()">
          </div>
        </div>
        <div class="chat-rodape-botoes-botao botao-excluir-anexo" :class="informacoesAberto ? 'icones-fechado' : ''" title="Excluir Anexo" v-on:click="excluirAnexo()">
          <i class="fas fa-times-circle"></i>
          <span v-show="!informacoesAberto"> Cancelar </span>
        </div>
      </template>
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
      hsm: false,
      mensagem: '',
      qtdCaracteresDisponiveis: 1500,
      arquivo: '',
      aparecerPrevia: false,
      imagemPrevia: '',
      txtFormatoInvalido: '',
      txtFormatosValidos: '',
      controle: true,
      qtdInicial: 0,
      abrirOpcoes: false
    }
  },
  methods: {
    ...mapMutations(['setTodasMensagens', 'setHabilitaRolagem', 'setFormularioCliente']),

    enviarMensagem(){
      if(this.validaMensagem()){
        let msg = this.mensagem;
        if( msg != '' ) {
          axios
            .post(
              "http://linux03/im/atdHumano/middleware/atd_api.php/send-message",
              { msg }
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
      let data = new Date()
      
      let hora = data.getHours()
      hora = hora < 10 ? '0'+hora : hora

      let minutos = data.getMinutes()
      minutos = minutos < 10 ? '0'+minutos : minutos

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
          this.txtFormatoInvalido = ''
          this.txtFormatosValidos = ''
        }else{
          this.aparecerPrevia = true
          this.imagemPrevia = ''
          this.txtFormatoInvalido = 'Formato Invalido!'
          this.txtFormatosValidos = 'Selecione um arquivo .gif, .jpg/jpeg ou .png'
        }
      }

    },
    enviarAnexo(){
      if(this.validaAnexo(this.arquivo)){
        this.setTodasMensagens(this.criaObjAnexo())
        this.verificaRolagem()
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
    encerrarAtendimento(){
      this.mensagem = 'Mensagem de Encerramento do Atendimento'
      this.enviarMensagem()
      document.querySelector('#textarea').setAttribute('readonly','readonly')
      setTimeout(
        () => {
          this.retornarForm()
        }, 1500
      )
    },
    retornarForm(){
      this.setFormularioCliente(false)
    },
    obterAtendimentos() {
      axios
        .get(
          "http://linux03/im/atdHumano/middleware/atd_api.php/get-atendimento"
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
          "http://linux03/im/atdHumano/middleware/atd_api.php/search-message",
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
          "http://linux03/im/atdHumano/middleware/atd_api.php/send-information",
          { informacao }
        )
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    finalizarAtendimento() {
      axios
        .put(
          "http://linux03/im/atdHumano/middleware/atd_api.php/end-atendimento ",
          {}
        )
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
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
    }
  },
  computed: {
    ...mapGetters({
      todasMensagens: 'getTodasMensagens',
      informacoesAberto: 'getInformacoesAberto'
    })
  }
}
</script>

<style>

</style>