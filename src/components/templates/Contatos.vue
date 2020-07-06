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
    <div class="lista-contatos-container" v-if="atendimentosAbertos.length > 0">
      <ul :class="{'fechado' : fechado}">
        <li
          v-for="(atd, indice) in atendimentosAbertos"
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
            v-for="(atd, indice) in atendimentosAbertos"
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
    atendimentosAbertos() {
      if (this.atendimentosAbertos) {
        if (this.atendimentosAbertos) {
          this.preencheAtivos()
          this.setMensagensClienteAtivo(
            this.idAtendimentoAtivo, this.obterMensagensDoContatoAtivoPeloId(this.idAtendimentoAtivo)
          )
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: "getClienteMandouMensagem",
      atendimentosAbertos: "getAtendimentosAbertos",
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
      for (let i = 0; i < this.atendimentosAbertos.length; i++) {
        this.arrAtivos[i] = { ativo: "N" };
      }
    },
    controlaAtivos(indice) {
      if (this.arrAtivos[indice]) {
        this.arrAtivos[indice].ativo = "S";
        let arrLi = [];
        for (let i = 0; i < this.arrAtivos.length; i++) {
          if (document.querySelector("#li_" + i)) {
            arrLi[i] = document.querySelector("#li_" + i);
            if(arrLi[i].classList.contains('ativo')){
              arrLi[i].classList.remove('ativo')
            }else if(i == indice){
              arrLi[i].classList.add('ativo')
            }
            // if (arrLi[i].children[1]) {
            //   if (i !== indice) {
            //     arrLi[i].children[1].remove();
            //   }
            // } else if (i == indice) {
            //   const spanAtivo = document.createElement("span");
            //   spanAtivo.classList.add("ativo");
            //   const li = document.querySelector("#li_" + indice);
            //   li.insertAdjacentElement("beforeend", spanAtivo);
            // }
          }
        }
      }
    },
    obterMensagensDoContatoAtivoPeloId( id ) {
      for( let atd in this.atendimentosAbertos ) {
        if( id == this.atendimentosAbertos[atd].cliente.id ) {
          return this.atendimentosAbertos[atd].cliente.messages
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
    }
  }
};
</script>

<style>
</style>