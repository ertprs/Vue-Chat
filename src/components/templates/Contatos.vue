<template>
  <div id="todos-contatos" :class="{'fechado' : fechado}" class="resizable-content">
    <div class="titulo-contatos tamanho-titulos">
      <div class="titulo-contatos--icone-container" :class="{'fechado' : fechado}">
        <i class="fas fa-address-book" title="Contatos"></i>
        <transition name="fade">
          <h1 v-show="!fechado">
            Atendimentos
          </h1>
        </transition>
      </div>
      <div>
      </div>
      <div class="container-add-novo-cliente" :class="{'fechado' : fechado}" title="Adicionar novo cliente" v-on:click="abrirAtivarCtt()">
        <i class="fas fa-user-plus"></i>
      </div>
      <div v-on:click="toggleContatos($event)" class="container-flecha" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha"></i>
      </div>
    </div>
    <template v-if="objAtendimentos">
      <!-- Caso Aguardando Cliente ou esperando a primeira requisicao ao buscaAtendimentos -->
      <div class="lista-contatos-container-vazio" :class="{'existe-agenda' : minhaAgenda.length}" v-if="caso == 206 || caso == 'aguardando'">
        <div class="load">
          <i class="fas fa-hourglass-end"></i>
          <transition name="fade">
            <p v-show="!fechado" >
              <template v-if="caso == 206">Aguardando clientes</template>
              <template v-else>Carregando clientes</template>
            </p>
          </transition>
        </div>
      </div>
      <!-- Caso haja Cliente -->
      <div class="lista-contatos-container" v-if="objAtendimentos && caso !== 400">
        <div class="fieldset-container" :class="{'fechado' : fechado}" v-on:click="alternaAbaAberta()">
          <h4
            :class="{'ativo' : abaAberta == 'atendimento'}"
            v-if="objAtendimentos.length && caso !== 206"
            >
            Em Atendimento
          </h4>
          <div>
            <span v-if="totalClientesNovos != ''" title="Total de novos clientes" class="total-clientes-novos">{{ totalClientesNovos }}</span>
            <span v-if="totalMsgNovas != ''" title="Total de novas mensagens" class="total-msgs-novas">{{ totalMsgNovas }}</span>
          </div>
        </div>
        <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta == 'aguardando'}" v-if="objAtendimentos.length && caso !== 206" id="lista-contatos">
          <li
            v-for="(atd, indice) in objAtendimentos"
            :key="indice"
            :title="formataNome(atd.nome_usu)"
            :class="{'destaque-novo-contato' : atd.novoContato, 'nova-msg' : atd.alertaMsgNova, 'ativo' : idAtendimentoAtivo == atd.id_cli}"
            @click="ativarConversa( atd, indice )"
          >
            <div class="circulo-contatos">
              <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
              <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
              <img v-if="atd.sigla" :src="`http://linux03/callcenter/imagens/ext_top_${atd.sigla}.png`">
            </div>
            <template v-if="!fechado">{{ formataNome(atd.nome_usu) }}</template>
            <span v-if="!fechado" class="ultima-msg">{{formataUltimaMsg(atd.arrMsg)}}</span>
            <span v-if="atd.alertaMsgNova && atd.qtdMsgNova > 0 && idAtendimentoAtivo !== atd.id_cli" class="destaque-nova-msg">{{ atd.qtdMsgNova }}</span>
            <span v-if="idAtendimentoAtivo == atd.id_cli" class="ctt-ativo"></span>
          </li>
        </ul>
        <div class="fieldset-container">
          <h4
            v-on:click="alternaAbaAberta()"
            :class="abaAberta == 'aguardando' ? 'ativo' : ''"
            v-if="objAtendimentos.length && caso !== 206"
            >
            Aguardando
          </h4>
        </div>
        <div class="lista-aguardando" v-if="minhaAgenda.length">
          <!-- Lista repetida para simular mais contatos -->
          <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta !== 'aguardando'}">
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice"
              :id="'li_'+indice"
              :title="atd"
              class="semClick"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice+'a'"
              :id="'li_'+indice+'a'"
              :title="atd"
              class="semClick"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice+'b'"
              :id="'li_'+indice+'b'"
              :title="atd"
              class="semClick"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice+'c'"
              :id="'li_'+indice+'c'"
              :title="atd"
              class="semClick"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice+'d'"
              :id="'li_'+indice+'d'"
              :title="atd"
              class="semClick"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
          </ul>
        </div>
        <div class="lista-agenda" v-if="minhaAgenda.length">
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
              class="semClick"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd }}</template>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <!-- Caso não haja atendimentos -->
    <div v-if="caso == 400 && !todosAtendimentos.length" class="lista-contatos-container-vazio" :class="{'fechado' : fechado}">
      <div>
        <i class="far fa-folder-open"></i>
        <transition name="fade">
          <p v-show="!fechado" >
            Sem contatos para mostrar
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
import { mapGetters } from "vuex"
import axios_api from '../../services/serviceAxios';

export default {
  data() {
    return {
      fechado: false,
      rotate: false,
      haContatos: true,
      objAtendimentos: [],
      abaAberta: 'atendimento',
      totalMsgNovas: '',
      totalClientesNovos: '',
      contadorErros: 0
    };
  },
  watch: {
    todosAtendimentos() {
      if(this.todosAtendimentos){
        this.objAtendimentos = Object.values(this.todosAtendimentos)
        if(this.objAtendimentos.length && this.idAtendimentoAtivo == ''){
          setTimeout(() => {
            this.ativarConversa(this.objAtendimentos[0], 0)
          }, 200)
        }else if(this.objAtendimentos.length && this.idAtendimentoAtivo){
          let qtdNegativo = 0
          for(let atd in this.objAtendimentos){
            if(this.objAtendimentos[atd].id_cli !== this.idAtendimentoAtivo){
              qtdNegativo++
            }
          }

          if(qtdNegativo == this.objAtendimentos.length){
            this.ativarConversa(this.objAtendimentos[0], 0)
          }
        }
        this.contarMsgClientes()
      }
    },
    abaAberta(){
      if(this.abaAberta === "aguardando") {
        this.contarMsgClientes()
      } else {
        console.log('zerou')
        this.totalMsgNovas = ''
        this.totalClientesNovos = ''
      }
    },
    caso(){
      if(this.caso == 206 || this.caso == 400){
        const tituloContatos = document.querySelector('.titulo-contatos')
        const tituloAgenda = document.querySelector('.lista-agenda--titulo')

        if(tituloContatos, tituloAgenda){
          tituloContatos.style.background = ''
          tituloAgenda.style.background = ''
        }
      }
    }
  },
  created(){
    this.verificaLocalStorage()
  },
  mounted(){
    this.$root.$on('toggle-contatos', () => {
      this.toggleContatos()
    })

    this.$root.$on('encerrar-atd', atdAtivo => {
      this.encerrarAtdNaTela(atdAtivo)
    })
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: "getClienteMandouMensagem",
      todosAtendimentos: "getTodosAtendimentos",
      minhaAgenda: "getAgenda",
      caso: 'getCaso',
      iframesDisponiveis: 'getIframesDisponiveis',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      iframeCttAtivo: 'getIframeCttAtivo'
    })
  },
  methods: {
    abrirAtivarCtt(){
      if(this.iframeCttAtivo){
        this.$store.dispatch("setIframeCttAtivo", false)
      }else{
        this.$store.dispatch("setIframeCttAtivo", true)
      }
    },
    alternaAbaAberta(){
      switch (this.abaAberta){
        case "atendimento":
          this.abaAberta = "aguardando"
        break;
        case "aguardando":
          this.abaAberta = "atendimento"
          this.totalMsgNovas = ''
          this.totalClientesNovos = ''
        break;
        default:
          this.abaAberta = "atendimento"
          this.totalMsgNovas = ''
          this.totalClientesNovos = ''
        break;
      }
    },
    contarMsgClientes() {
      console.log('chamou')
      this.totalMsgNovas = ''
      this.totalClientesNovos = ''
      var auxContMsgNova = 0
      var auxContNovoContato = 0
      for(let index in this.objAtendimentos) {
        // console.log(this.objAtendimentos[index])
        if(this.objAtendimentos[index].qtdMsgNova) {
          auxContMsgNova = auxContMsgNova + this.objAtendimentos[index].qtdMsgNova
        }
        if(this.objAtendimentos[index].novoContato) {
          auxContNovoContato ++
        }
      }
      this.totalMsgNovas = auxContMsgNova
      this.totalClientesNovos = auxContNovoContato
    },
    formataSigla(letra, acao){
      if(acao == 'upper'){
        return letra.toUpperCase()
      }else if(acao == 'lower'){
        return letra.toLowerCase()
      }
    },
    adicionaCaso(caso){
      this.$store.dispatch('setCaso', caso)
    },
    statusMensagens(atd){

      axios_api.get(`get-status-messages?grupo=${atd.grupo}&nro_chat=${atd.nro_chat}`)
      .then(response => {
        if(response.status === 200){
          let arrStatusMsg = response.data.msg_ret
          for(let msg in atd.arrMsg){
            if(arrStatusMsg[msg].seq === atd.arrMsg[msg].seq){
              atd.arrMsg[msg].status = arrStatusMsg[msg].status
            }
          }
          this.setMensagensClienteAtivo(atd.id_cli, atd.arrMsg)
        }
      })
      .catch(error => {
        if(this.contadorErros < 10){
          this.statusMensagens(atd)
        }
        this.contadorErros++
        console.log('Erro get status messages: ', error)
        console.log('Contador de erros status message: ', this.contadorErros)
      })
    },
    ativarConversa: function(atd, indice) {

      if(atd.novoContato){
        atd.novoContato = false
      }

      if(atd.alertaMsgNova){
        atd.alertaMsgNova = false
      }

      this.statusMensagens(atd)

      atd.qtdMsgNova = 0;
      this.$store.dispatch('setIdAtendimentoAtivo', atd.id_cli)
      
      this.exibirInformacoes(atd, indice)
      
      setTimeout(() => {
        if(document.querySelector('#textarea')){
          document.querySelector('#textarea').focus()
        }
        this.$root.$emit('rolaChat')
      }, 100)

    },
    exibirInformacoes: function(atd, indice) {
      atd.informacoes = {}
      atd.informacoes.nome = atd.nome_usu
      atd.id = atd.login_usu
      this.$store.dispatch('setAtendimentoAtivo', atd)
      this.$root.$emit('mostrarIframe', atd.id, atd.url)
    },
    setMensagensClienteAtivo(id, arrMensagens) {
      this.$store.dispatch('limparTodasMensagens')
      
      for (let i in arrMensagens) {
        if(i != 'st_ret') {
          let mensagem = arrMensagens[i].msg;
          let status = arrMensagens[i].status
          let origem;
          arrMensagens[i].resp_msg == "CLI" ? (origem = "outros") : (origem = "principal");
          let horario = arrMensagens[i].hora;
          
          let anexo = false;

          let imgAnexo = "";
          let tipoDoc = ""
          let docAnexo = "";
          let nomeArquivo = ""

          if(arrMensagens[i].anexos){
            anexo = true
            
            let baseUrl = ''
            if(window.location.hostname == 'localhost'){
              baseUrl = 'http://linux03'
            }else{
              baseUrl = 'https://'+window.location.hostname
            }

            var regex = /(\w+)\/(\w+)/g;
            var type = regex.exec(arrMensagens[i].anexos.type);
            switch (type[1]) {
              case "image": 
                imgAnexo = `${baseUrl}/callcenter/docs.php?mku=${arrMensagens[i].anexos.mku}`
                break;
              default:
                tipoDoc = arrMensagens[i].anexos.type
                docAnexo = `${baseUrl}/callcenter/docs.php?mku=${arrMensagens[i].anexos.mku}`
                nomeArquivo = arrMensagens[i].anexos.name
            }
            
          }

          let autor = arrMensagens[i].resp_msg;
          switch (autor) {
            case "CLI":
              autor = "Cliente";
              break;
            case "OPE":
              autor = "Operador";
              break;
          }

          let objMensagem = this.getObjMensagem( autor, origem, mensagem, status, horario, anexo, imgAnexo, tipoDoc, docAnexo, nomeArquivo );
          this.$store.dispatch('setTodasMensagens', objMensagem)
        }
      }
    },
    getObjMensagem(
      inAutor,
      inOrigem,
      inMensagem,
      inStatus,
      inHorario,
      inAnexo,
      inImgAnexo,
      inTipoDoc,
      inDocAnexo,
      inNomeArquivo
    ) {
      let objMensagem = {
        autor: inAutor, // Operador, Cliente
        origem: inOrigem, // principal e outros
        msg: inMensagem,
        status: inStatus,
        horario: inHorario,
        anexo: inAnexo,
        imgAnexo: inImgAnexo,
        tipoDoc: inTipoDoc,
        docAnexo: inDocAnexo,
        nomeArquivo: inNomeArquivo
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
    toggleContatos(event) {
      this.rotate = !this.rotate
      this.fechado = !this.fechado;

      let widthCtt = localStorage.getItem('largura-contatos')

      if(event){
        if(widthCtt == '60px' && !this.fechado){
          localStorage.setItem('largura-contatos', '275px')
        }
      }

      const todosContatos = document.querySelector('#todos-contatos')
      if(todosContatos){
        const containerTodosContatos = todosContatos.parentElement
        containerTodosContatos.style.transitionDuration = '300ms'
        setTimeout(() => {
          containerTodosContatos.style.transitionDuration = ''
        }, 300)
        if(!this.fechado){
          if(widthCtt && widthCtt !== '60px'){
            containerTodosContatos.style.width = widthCtt
          }else{
            containerTodosContatos.style.width = '20%'
          }
        }else{
          containerTodosContatos.style.width = '60px'
        }
      }

      this.$store.dispatch('setAbaContatos', this.fechado)
      localStorage.setItem('status-contatos', this.fechado)
    },
    verificaLocalStorage(){
      let fechado = localStorage.getItem('status-contatos')
      if(fechado == "true"){
        this.toggleContatos()
      }
    },
    obterMensagensDoContatoAtivoPeloId( id ) {
      for( let ramal in this.todosAtendimentos ) {
        if( id == this.todosAtendimentos[ramal].id_cli ) {
          return this.todosAtendimentos[ramal].arrMsg
        }
      }
    },
    formataUltimaMsg(arrMsgs){
      if(arrMsgs.length > 0) {
        let indexRef = arrMsgs.length - 1
        let msgFormatada = arrMsgs[indexRef].msg

        if(arrMsgs[indexRef].msg.length > 30 && !arrMsgs[indexRef].anexos){
          msgFormatada = arrMsgs[indexRef].msg.slice(0, 30) + '...'
          return msgFormatada
        }else if(arrMsgs[indexRef].anexos){
          if(arrMsgs[indexRef].msg){
            msgFormatada = arrMsgs[indexRef].anexos.name + " " + arrMsgs[indexRef].msg
          }else{
            msgFormatada = arrMsgs[indexRef].anexos.name
          }
          if(msgFormatada.length > 30){
            msgFormatada = msgFormatada.slice(0, 30) + '...'
          }
          return msgFormatada
        }else{
          return msgFormatada
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
