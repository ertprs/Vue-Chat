<template>
  <div id="todos-contatos" :class="{'fechado' : fechado}">
    <div class="titulo-contatos">
      <h1>
        <i class="fas fa-address-book"></i>
        <template v-if="!fechado">Contatos</template>
      </h1>
      <div v-on:click="toggleContatos()" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha"></i>
      </div>
    </div>
    <ul v-if="atendimentosAbertos.length > 0" :class="{'fechado' : fechado}">
      <li
        v-for="(atd, indice) in atendimentosAbertos"
        :key="atd.cliente.id"
        :id="'li_'+indice"
        :title="atd.cliente.informacoes.nome"
        @click="ativarConversa( atd.cliente, indice );"
      >
        <!-- <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i> -->
        <p :class="indice % 2 == 0 ? '' : ''">{{ atd.cliente.informacoes.nome[0].toUpperCase() }}</p>
        <template v-if="!fechado">{{ atd.cliente.informacoes.nome }}</template>
      </li>
    </ul>
    <div v-else class="lista-contatos-container-vazio" :class="{'fechado' : fechado}">
      <div>
        <i class="far fa-folder-open"></i>
        <p>Sem Contatos para mostrar</p>
      </div>
    </div>
  </div>
</template>

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
          this.preencheAtivos();
        }
      }
    }
  },
  mounted() {
    this.$root.$on('contatos', () => {
      this.atualizarMensagemDoContatoAtivo()
    })
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: "getClienteMandouMensagem",
      atendimentosAbertos: "getAtendimentosAbertos",
    })
  },
  methods: {
    ...mapMutations([
      "setAtendimentoAtivo",
      "setTodasMensagens",
      "limparTodasMensagens",
      "toggleAbaContatos"
    ]),
    ativarConversa: function(atd, indice) {
      this.setMensagensClienteAtivo(atd.id, atd.messages);
      this.exibirInformacoes(atd, indice);
      this.idAtendimentoAtivo = atd.id
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
            if (arrLi[i].children[1]) {
              if (i !== indice) {
                arrLi[i].children[1].remove();
              }
            } else if (i == indice) {
              const spanAtivo = document.createElement("span");
              spanAtivo.classList.add("ativo");
              const li = document.querySelector("#li_" + indice);
              li.insertAdjacentElement("beforeend", spanAtivo);
            }
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
      let idClienteAtivo = this.idAtendimentoAtivo
      let mensagensClienteAtivo = this.obterMensagensDoContatoAtivoPeloId(idClienteAtivo)
      this.setMensagensClienteAtivo(idClienteAtivo, mensagensClienteAtivo);      
    }
  }
};
</script>

<style>
</style>