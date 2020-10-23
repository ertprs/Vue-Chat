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
      <!-- <div class="container-add-novo-cliente" :class="{'fechado' : fechado}" title="Adicionar novo cliente" v-on:click="abrirAtivarCtt()">
        <i class="fas fa-user-plus"></i>
      </div> -->
      <div v-on:click="toggleContatos($event)" class="container-flecha" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha"></i>
      </div>
    </div>
    <template v-if="objAtendimentos">
      <!-- Caso Aguardando Cliente ou esperando a primeira requisicao ao buscaAtendimentos -->
      <div class="lista-contatos-container-vazio" :class="{'existe-agenda' : minhaAgenda.length || aguardando.length}" v-if="caso == 206 || caso == 'aguardando'">
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
        <div class="fieldset-container" v-if="caso !== 400 && caso !== 206" :class="{'fechado' : fechado}" v-on:click="alternarAbaAberta()">
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
        <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta == 'aguardando'}"  id="lista-contatos" v-if="objAtendimentos.length && caso !== 206">
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
            <span v-if="!fechado && atd.arrMsg[atd.arrMsg.length - 1]" class="ultima-msg" v-html="atd.arrMsg[atd.arrMsg.length - 1].msg"></span>
            <span v-if="atd.alertaMsgNova && atd.qtdMsgNova > 0 && idAtendimentoAtivo !== atd.id_cli" class="destaque-nova-msg">{{ atd.qtdMsgNova }}</span>
            <span v-if="idAtendimentoAtivo == atd.id_cli" class="ctt-ativo"></span>
          </li>
        </ul>
        <div class="fieldset-container" v-if="caso !== 400 && aguardando && aguardando.length">
          <h4
            v-on:click="alternarAbaAberta()"
            :class="abaAberta == 'aguardando' ? 'ativo' : ''"
            >
            Aguardando
          </h4>
          <span class="contador-aguardando" v-show="this.abaAberta == 'atendimento' && aguardando.length">
            {{ aguardando.length }}
          </span>
        </div>
        <div class="lista-aguardando" v-if="aguardando && aguardando.length">
          <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta !== 'aguardando'}">
            <li
              v-for="(atd, indice) in aguardando"
              :key="'id_'+indice"
              :id="'li_'+indice"
              :title="atd.nome_usu"
              @click="ativarCliente(atd.nome_usu, atd.login_usu)"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd.nome_usu }}</template>
            </li>
          </ul>
        </div>
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
          <ul :class="{'fechado' : fechado}" v-if="minhaAgenda && minhaAgenda.length">
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice"
              :id="'li_'+indice"
              :title="atd.nome_usu"
              @click="ativarCliente(atd.nome_usu, atd.login_usu)"
            >
              <div class="circulo-contatos">
                <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
                <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
              </div>
              <template v-if="!fechado">{{ atd.nome_usu }}</template>
              <div class="retorno-container" :id="'retorno_'+indice" v-if="!fechado">
                <span class="data-retorno">{{ atd.data_agenda_formatada || formataData(atd.data_agenda, atd.hora_agenda, atd) }}</span>
                <span class="contador-data-retorno d-none"><i class="fas fa-stopwatch"></i>{{ formataData(atd.data_agenda, atd.hora_agenda, atd, "retorno", `#retorno_${indice}`) }}</span>
              </div>
            </li>
          </ul>
          <div class="agenda-vazia" v-else>
            <p> Sem clientes para mostrar </p>
          </div>
        </div>
      </div>
    </template>
    <!-- Caso nao haja atendimentos -->
    <div  class="lista-contatos-container-vazio" :class="{'fechado' : fechado}" v-if="caso == 400 && !todosAtendimentos.length">
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
  .fade-enter, .fade-leave-to {
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
      contadorErros: 0,
      contadorErrosAgenda: 0
    };
  },
  // beforeUpdate() {
  //   this.$nextTick(() => {
      // if(this.objAtendimentos.length){
      //   console.log("objatendimentos: ", this.objAtendimentos)
      // }
  //   })
  // },
  watch: {
    todosAtendimentos() {
      if(this.todosAtendimentos){
        this.objAtendimentos = Object.values(this.todosAtendimentos)
        if(this.objAtendimentos.length && this.idAtendimentoAtivo == ''){
          setTimeout(() => {
            if(this.abaAberta !== 'atendimento'){
              this.alternarAbaAberta()
            }
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

        if(this.abaAberta == "aguardando"){
          this.contarMsgClientes()
        }

        let auxAgenda = this.minhaAgenda
        // Verificando se o cliente esta em mais de um array
        for(let atd in this.objAtendimentos){
          auxAgenda = auxAgenda.filter((agenda) => {
            return agenda.id_cli !== this.objAtendimentos[atd].id_cli
          })
        }

        if(this.minhaAgenda.length !== auxAgenda.length){
          this.$store.dispatch("setAgenda", auxAgenda)
        }
      }
    },
    abaAberta(){
      if(this.abaAberta === "aguardando") {
        this.contarMsgClientes()
      } else {
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
    },
    aguardando(){
      if(!this.objAtendimentos.length && this.aguardando.length){
        if(this.abaAberta == "atendimento"){
          this.alternarAbaAberta()
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
      aguardando: "getAguardando",
      caso: 'getCaso',
      iframesDisponiveis: 'getIframesDisponiveis',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      reqRegras: 'getReqRegras',
      dominio: 'getDominio',
      reqTeste: 'getReqTeste'
    })
  },
  methods: {
    ativarCliente(nome, id){
      let data = {
        nome: nome,
        id: id
      }

      axios_api.post(`start-contato?${this.reqTeste}`, data)
        .then((response) => {
          if(response.data.st_ret == "OK"){
            this.$toasted.global.defaultSuccess({msg: "Aguarde. Logo o cliente sera ativado"})
          }
        })
        .catch(error => {
          this.$toasted.global.defaultError({msg: "Nao foi possivel ativar o cliente"})
        })
    },
    alternarAbaAberta(){
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
      this.totalMsgNovas = ''
      this.totalClientesNovos = ''
      var auxContMsgNova = 0
      var auxContNovoContato = 0
      for(let index in this.objAtendimentos) {
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
    formataData(data, hora, atd, retorno, id){

      if(!data || !hora){
        return
      }

      if(retorno){
        if(!id || !atd){
          return
        }
      }

      let dataAux = data
      let horaAux = hora

      if(!retorno){
        dataAux = dataAux.replace(/-/g, "\/")
        dataAux = dataAux.split(/\//)
        dataAux = dataAux.reverse()
        dataAux = dataAux.join("/")
  
        horaAux = horaAux.replace(/:/g, "h")
        horaAux = horaAux.slice(0, horaAux.length-3)

        if(!parseInt(horaAux[0])){
          this.formataData(data, hora, atd)
          return
        }

        if(typeof(atd) == "object"){
          atd.data_agenda_formatada = dataAux + ' ' + horaAux
        }

        return dataAux + ' ' + horaAux
      }else{

        const spanContador = document.querySelector(`${id} span.contador-data-retorno`)
        if(!spanContador){
          this.contadorErrosAgenda++
          if(this.contadorErrosAgenda < 10){
            setTimeout(() => {
              this.formataData(data, retorno, atd)
            }, 500)
          }
          return
        }

        // Diferenca entre dias
        let dataAux2 = data + " " + hora
        let dataAtual = new Date()
        let dataAgenda = new Date(dataAux2)
        
        let difDatas = Date.UTC(dataAgenda.getYear(), dataAgenda.getMonth(), dataAgenda.getDate(),0,0,0) - Date.UTC(dataAtual.getYear(), dataAtual.getMonth(), dataAtual.getDate(),0,0,0)
        // Retorna o valor em horas
        difDatas = difDatas / 1000 / 60 / 60
        // Retorna o valor em dias
        difDatas = difDatas / 24

        // Mesmo dia
        if(difDatas == 0){
          // Diferenca entre horarios
          let difHoras = dataAgenda.getHours() - dataAtual.getHours()
          let difMinutos = dataAgenda.getMinutes() - dataAtual.getMinutes()
          
          // Significa que os horarios estao em horas diferentes (ex: 11:00:00 e 10:59:59)
          if(difHoras > 0 || difHoras < 0){
            // Significa que os minutos do horario atual sao maiores do que os minutos do horario agendado
            if(difMinutos < 0){
              difMinutos = 60 - Math.abs(difMinutos)
              difHoras = difHoras - 1
            }
            if(difHoras == 0){
              spanContador.classList.remove("d-none")
              return `${difMinutos}min`
            }else{
              // Significa que o horário já passou
              if(difHoras < 0){
                return
              }
              spanContador.classList.remove("d-none")
              if(difMinutos > 0){
                return `${difHoras}h e ${difMinutos}min`
              }else{
                return `${difHoras}h`
              }
            }
          }else{
            
            // Significa que chegou a hora de chamar o ctt
            if(difHoras == 0 && difMinutos == 0){
              spanContador.classList.add("d-none")

              return 
            }

            // Significa que o horario agendado ja passou
            if(difHoras <= 0 && difMinutos < 0){
              spanContador.classList.add("d-none")
              return
            }

            // Significa que o horario ainda nao chegou
            spanContador.classList.remove("d-none")
            return `${difMinutos}min`
          }
        }else{
          // Dias diferentes
          // Data atual maior que data agendada
          if(difDatas < 0){
            spanContador.classList.add("d-none")
            return 
          }else{
          // Data agendado maior que data atual
            spanContador.classList.remove("d-none")

            if(difDatas == 1){
              return `${difDatas} dia`
            }else{
              return `${difDatas} dias`
            }
          }
        }

      }

    },
    statusMensagens(atd){

      axios_api.get(`get-status-messages?grupo=${atd.grupo}&nro_chat=${atd.nro_chat}&${this.reqTeste}`)
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

      if(this.reqRegras){
        return
      }

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

            var regex = /(\w+)\/(\w+)/g;
            var type = regex.exec(arrMensagens[i].anexos.type);
            switch (type[1]) {
              case "image": 
                imgAnexo = `${this.dominio}/callcenter/docs.php?mku=${arrMensagens[i].anexos.mku}`
                break;
              default:
                tipoDoc = arrMensagens[i].anexos.type
                docAnexo = `${this.dominio}/callcenter/docs.php?mku=${arrMensagens[i].anexos.mku}`
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

          if(document.querySelector('#textarea')){
            document.querySelector('#textarea').focus()
          }
          this.$root.$emit('rolaChat')
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
