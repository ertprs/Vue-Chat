<template>
  <div id="todos-contatos" :class="{'fechado' : fechado, 'aberto' : !fechado}">
    <div class="titulo-contatos">
      <div class="titulo-contatos--icone-container" :class="{'fechado' : fechado}">
        <i class="fas fa-address-book" title="Contatos"></i>
        <transition name="fade">
          <h1 v-show="!fechado">
            Contatos
          </h1>
        </transition>
      </div>
      <div v-on:click="toggleContatos()" class="container-flecha" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha"></i>
      </div>
    </div>
    <div class="lista-contatos-container" v-if="todosAtendimentos.length > 0">
      <ul :class="{'fechado' : fechado}">
        <li
          v-for="(atd, indice) in todosAtendimentos"
          :key="atd.cliente.id"
          :id="'li_'+indice"
          :title="atd.cliente.informacoes.nome"
          :class="atd.cliente.novoContato ? 'destaque-novo-contato' : ''"
          @click="ativarConversa( atd.cliente, indice );"
        >
          <!-- <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i> -->
          <div class="circulo-contatos">
            <p>{{ formataSigla(atd.cliente.informacoes.nome[0], 'upper') }}</p>
            <p v-if="fechado">{{ formataSigla(atd.cliente.informacoes.nome[1], 'lower') }}</p>
          </div>
          <template v-if="!fechado">{{ atd.cliente.informacoes.nome }}</template>
          <span v-if="!fechado" class="ultima-msg">{{formataUltimaMsg(atd.cliente.messages)}}</span>
          <span v-if="verificaMsgNova(atd.cliente.alertaMsgNova, indice)" class="destaque-nova-msg">{{ atd.cliente.qtdMsgNova }}</span>
        </li>
      </ul>
      <div class="lista-agenda">
        <div class="lista-agenda--titulo">
          <div :class="{'fechado' : fechado}">
            <i class="far fa-address-book"  title="Minha Agenda"></i>
          </div>
          <transition name="fade">
            <h2 v-show="!fechado" >
              Minha Agenda
            </h2>
          </transition>
        </div>
        <ul :class="{'fechado' : fechado}">
          <li
            v-for="(atd, indice) in todosAtendimentos"
            :key="atd.cliente.id"
            :id="'li_'+indice"
            :title="atd.cliente.informacoes.nome"
            @click="ativarConversa( atd.cliente, indice );"
          >
            <!-- <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i> -->
            <div :class="indice % 2 == 0 ? '' : ''" class="circulo-contatos">
              <p>{{ formataSigla(atd.cliente.informacoes.nome[0], 'upper') }}</p>
              <p v-if="fechado">{{ formataSigla(atd.cliente.informacoes.nome[1], 'lower') }}</p>
            </div>
            <template v-if="!fechado">{{ atd.cliente.informacoes.nome }}</template>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="lista-contatos-container-vazio" :class="{'fechado' : fechado}">
      <div>
        <i class="far fa-folder-open"></i>
        <p>Sem Contatos para mostrar</p>
      </div>
    </div>
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
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      rotate: false,
      fechado: false,
      arrAtivos: [],
      haContatos: true,
      idAtendimentoAtivo: ''
    };
  },
  watch: {
    todosAtendimentos() {
      if (this.todosAtendimentos) {
        this.preencheAtivos()
        this.setMensagensClienteAtivo(
          this.idAtendimentoAtivo, this.obterMensagensDoContatoAtivoPeloId(this.idAtendimentoAtivo)
        )
      }
    }
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: "getClienteMandouMensagem",
      todosAtendimentos: "getTodosAtendimentos",
    })
  },
  methods: {
    formataSigla(letra, acao){
      if(acao == 'upper'){
        return letra.toUpperCase()
      }else if(acao == 'lower'){
        return letra.toLowerCase()
      }
    },
    ...mapMutations([
      "setAtendimentoAtivo",
      "setTodasMensagens",
      "limparTodasMensagens",
      "toggleAbaContatos"
    ]),
    ativarConversa: function(atd, indice) {
      this.idAtendimentoAtivo = atd.id
      this.setMensagensClienteAtivo(atd.id, atd.messages)
      this.exibirInformacoes(atd, indice)
    },
    exibirInformacoes: function(objInformacoes, indice) {
      this.setAtendimentoAtivo(objInformacoes);
      this.controlaAtivos(indice);
    },
    setMensagensClienteAtivo(id, arrMensagens) {
      this.limparTodasMensagens();
      for (let i in arrMensagens) {
        let mensagem = arrMensagens[i].texto;
        let origem;
        arrMensagens[i].resp_msg == "CLI" ? (origem = "outros") : (origem = "principal");
        let horario = "??:??";
        let anexo = false;
        let imgAnexo = "";
        let autor = arrMensagens[i].resp_msg;
        switch (autor) {
          case "CLI":
            autor = "Cliente";
            break;
          case "OPE":
            autor = "Operador";
            break;
        }
        let objMensagem = this.getObjMensagem( autor, origem, mensagem, horario, anexo, imgAnexo );
        this.setTodasMensagens(objMensagem);
      }
    },
    getObjMensagem(
      inAutor,
      inOrigem,
      inMensagem,
      inHorario,
      inAnexo,
      inImgAnexo
    ) {
      let objMensagem = {
        autor: inAutor, // Operador, Cliente
        origem: inOrigem, // principal e outros
        msg: inMensagem,
        horario: inHorario,
        anexo: inAnexo,
        imgAnexo: inImgAnexo
      };
      return objMensagem;
    },
    formataHoraAtual() {
      let data = new Date();
      let hora = data.getHours();
      hora = hora < 10 ? "0" + hora : hora;
      let minutos = data.getMinutes();
      minutos = minutos < 10 ? "0" + minutos : minutos;
      const horaFormatada = hora + "h" + minutos;
      return horaFormatada;
    },
    toggleContatos() {
      this.rotate = !this.rotate;
      this.fechado = !this.fechado;
      this.toggleAbaContatos(this.fechado);
    },
    preencheAtivos() {
      if(this.arrAtivos.length !== this.todosAtendimentos.length){
        for (let i = 0; i < this.todosAtendimentos.length; i++) {
          this.arrAtivos[i] = { ativo: "N" };
        }
      }
    },
    controlaAtivos(indice) {
      if (this.arrAtivos[indice]) {
        this.arrAtivos[indice].ativo = "S"
        let arrLi = [];
        for (let i = 0; i < this.arrAtivos.length; i++) {
          if (document.querySelector("#li_" + i)) {
            arrLi[i] = document.querySelector("#li_" + i)
            if(arrLi[i].classList.contains('ativo')){
              arrLi[i].classList.remove('ativo')
            }else if(i == indice){
              if(arrLi[i].classList.contains('destaque-novo-contato')){
                arrLi[i].classList.remove('destaque-novo-contato')
              }
              arrLi[i].classList.add('ativo')
            }
          }
        }

        for(let i = 0; i < this.arrAtivos.length; i++){
          if(i !== indice){
            this.arrAtivos[i].ativo = 'N'
          }
        }
      }
    },
    obterMensagensDoContatoAtivoPeloId( id ) {
      for( let atd in this.todosAtendimentos ) {
        if( id == this.todosAtendimentos[atd].cliente.id ) {
          return this.todosAtendimentos[atd].cliente.messages
        }
      }
    },
    atualizarMensagemDoContatoAtivo() {
      var self = this
      var timeAtualizarMsg = setTimeout( function() {
        let idClienteAtivo = self.idAtendimentoAtivo
        let mensagensClienteAtivo = self.obterMensagensDoContatoAtivoPeloId(idClienteAtivo)
        self.setMensagensClienteAtivo(idClienteAtivo, mensagensClienteAtivo)
      },1500)
    },
    verificaMsgNova(msgNova, indice){
      if(msgNova){
        if(this.arrAtivos[indice]){
          if(this.arrAtivos[indice].ativo == 'S'){
            return false
          }else{
            return true
          }
        }else{
          return false
        }
      }
    },
    formataUltimaMsg(arrMsgs){
      if(arrMsgs.length > 0){
        if(arrMsgs[arrMsgs.length - 1].texto.length > 30){
          let msgFormatada = arrMsgs[arrMsgs.length - 1].texto.slice(0, 30) + '...'
          return msgFormatada
        }else{
          return arrMsgs[arrMsgs.length - 1].texto
        }
      }
    }
  },
};
</script>

<style>
</style>