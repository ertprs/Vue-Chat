<template>
  <div id="todos-contatos" :class="{'fechado' : fechado, 'aberto' : !fechado}"> <!-- class="tamanho-ajustavel" -->
    <div class="titulo-contatos">
      <div class="titulo-contatos--icone-container" :class="{'fechado' : fechado}">
        <i class="fas fa-address-book" title="Contatos"></i>
        <transition name="fade">
          <h1 v-show="!fechado">
            Contatos
          </h1>
        </transition>
      </div>
      <div>
      </div>
      <div v-on:click="toggleContatos()" class="container-flecha" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha"></i>
      </div>
    </div>
    <template v-if="todosAtendimentos">
      <div class="lista-contatos-container" >
        <ul :class="{'fechado' : fechado}">
          <li
            v-for="(atd, indice) in todosAtendimentos"
            :key="indice"
            :title="formataNome(atd.nome_usu)"
            :class="{'destaque-novo-contato' : atd.novoContato, 'nova-msg' : atd.alertaMsgNova, 'ativo' : idAtendimentoAtivo == atd.id_cli}"
            @click="ativarConversa( atd, indice )"
          >
            <!-- :class="atd.cliente.novoContato ? 'destaque-novo-contato' : ''" -->
            <!-- <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i> -->
            <div class="circulo-contatos">
              <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
              <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
            </div>
            <template v-if="!fechado">{{ formataNome(atd.nome_usu) }}</template>
            <span v-if="!fechado" class="ultima-msg">{{formataUltimaMsg(atd.arrMsg)}}</span>
            <span v-if="atd.alertaMsgNova && atd.qtdMsgNova > 0 && idAtendimentoAtivo !== atd.id_cli" class="destaque-nova-msg">{{ atd.qtdMsgNova }}</span>
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
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice"
              :id="'li_'+indice"
              :title="atd"
            >
              <!-- <i :class="indice % 2 == 0 ? 'far' : 'fas'" class="fa-user"></i> -->
              <div :class="indice % 2 == 0 ? '' : ''" class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div v-else class="lista-contatos-container-vazio" :class="{'fechado' : fechado}">
      <div>
        <i class="far fa-folder-open"></i>
        <transition name="fade">
          <p v-show="!fechado" >
            Sem Contatos para mostrar
          </p>
        </transition>
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
      haContatos: true,
      idAtendimentoAtivo: ''
    };
  },
  watch: {
    todosAtendimentos() {
      if (this.todosAtendimentos && this.idAtendimentoAtivo) {
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
      minhaAgenda: "getAgenda"
    })
  },
  mounted() {
    this.$root.$on('atualizar_mensagem', (msg) => {
      // this.atualizarMensagemDoContatoAtivo()
      // console.log(this.todosAtendimentos)
      // console.log('component contatos')

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
      "toggleAbaContatos",
      "setIdAtendimentoAtivo"
    ]),
    ativarConversa: function(atd, indice) {
      
      if(atd.novoContato){
        atd.novoContato = false
      }

      if(atd.alertaMsgNova){
        atd.alertaMsgNova = false
      }


      this.idAtendimentoAtivo = atd.id_cli

      this.setIdAtendimentoAtivo(this.idAtendimentoAtivo)
      this.setMensagensClienteAtivo(atd.id_cli, atd.arrMsg)
      this.exibirInformacoes(atd, indice)
    },
    exibirInformacoes: function(atd, indice) {
      atd.informacoes = {}
      atd.informacoes.nome = atd.nome_usu
      atd.id = atd.login_usu
      // atd.url = 'https://www.wikipedia.org/'
      // atd.url = 'https://linux03/callcenter/bot_param.php?mku=MKUEKqjNF3MhGK0Tuok8xsA6PQJz5a9WdTrEwrGh6uOk72A'
      this.setAtendimentoAtivo(atd);
    },
    setMensagensClienteAtivo(id, arrMensagens) {
      this.limparTodasMensagens();
      for (let i in arrMensagens) {
        if(i != 'st_ret') {
          let mensagem = arrMensagens[i].msg;
          let origem;
          arrMensagens[i].resp_msg == "CLI" ? (origem = "outros") : (origem = "principal");
          let horario = arrMensagens[i].hora;
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
    obterMensagensDoContatoAtivoPeloId( id ) {
      for( let ramal in this.todosAtendimentos ) {
        if( id == this.todosAtendimentos[ramal].id_cli ) {
          return this.todosAtendimentos[ramal].arrMsg
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
    formataUltimaMsg(arrMsgs){
      if(arrMsgs.length > 0){
        if(arrMsgs[arrMsgs.length - 1].texto.length > 30){
          let msgFormatada = arrMsgs[arrMsgs.length - 1].texto.slice(0, 30) + '...'
          return msgFormatada
        }else{
          return arrMsgs[arrMsgs.length - 1].texto
        }
      }
    },
    formataNome(nome){
      if(!nome){ return '' }
      
      nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, function(capitalize) { return capitalize.toUpperCase() })
      return nome
    }
  }
};
</script>

<style>
</style>