<template>
  <div id="todos-contatos" :class="{'fechado' : fechado}" class="resizable-content">
    <div class="titulo-contatos tamanho-titulos">
      <div class="titulo-contatos--icone-container" :class="{'fechado' : fechado}">
        <i class="fas fa-address-book" title="Contatos"></i>
        <transition name="fade">
          <h1 v-show="!fechado"> {{ dicionario.titulo_atendimentos }} </h1>
        </transition>
      </div>
      <div>
      </div>
      <div v-on:click="toggleContatos($event)" class="container-flecha" :class="rotate ? 'rotate' : ''">
        <i class="fas fa-long-arrow-alt-left flecha"></i>
      </div>
    </div>
    <template v-if="objAtendimentos">
      <!-- Caso Aguardando Cliente ou esperando a primeira requisicao ao buscaAtendimentos -->
      <div class="lista-contatos-container-vazio" :class="{'existe-agenda' : minhaAgenda.length || aguardando.length || caso !== 400}" v-if="caso == 206 || caso == 'aguardando'">
        <div class="load">
          <i class="fas fa-hourglass-end"></i>
          <transition name="fade">
            <p v-show="!fechado" >
              <template v-if="caso == 206"> {{ dicionario.msg_aguardando_clientes }} </template>
              <template v-else> {{ dicionario.msg_carregando_clientes }} </template>
            </p>
          </transition>
        </div>
      </div>
      <!-- Caso haja Cliente -->
      <div class="lista-contatos-container" v-if="objAtendimentos && caso !== 400">
        <div class="fieldset-container" v-if="caso !== 400 && caso !== 206" :class="{'fechado' : fechado}">
          <h4 v-if="objAtendimentos.length && caso !== 206">
            {{ dicionario.sub_titulo_atendimentos }}
          </h4>
          <div :class="{'fechado' : fechado}">
            <span v-if="objAtendimentos.length" :title="dicionario.title_total_clientes" class="total-clientes">{{ objAtendimentos.length }}</span>
            <span v-if="totalClientesNovos != ''" :title="dicionario.title_total_novos_clientes" class="total-clientes-novos">{{ totalClientesNovos }}</span>
            <span v-if="totalMsgNovas != ''" :title="dicionario.title_total_msgs_novas" class="total-msgs-novas">{{ totalMsgNovas }}</span>
          </div>
        </div>
        <ul :class="{'fechado' : fechado}"  id="lista-contatos" v-if="objAtendimentos.length && caso !== 206">
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
              <img v-if="atd.sigla" :src="`${dominio}/callcenter/imagens/ext_top_${atd.sigla}.png`">
            </div>
            <template v-if="!fechado">{{ formataNome(atd.nome_usu) }}</template>
            <ultima-msg v-if="!fechado" :mensagens="atd.arrMsg" />
            <span v-if="atd.alertaMsgNova && atd.qtdMsgNova > 0 && idAtendimentoAtivo !== atd.id_cli" class="destaque-nova-msg">{{ atd.qtdMsgNova }}</span>
            <span v-if="idAtendimentoAtivo == atd.id_cli" class="ctt-ativo"></span>
          </li>
        </ul>
        <div class="fieldset-container" :class="{'fechado' : fechado}" v-if="caso !== 400 && aguardando && aguardando.length">
          <h4 v-on:click="alternarAbaAberta()">
            {{ dicionario.sub_titulo_aguardando }}
          </h4>
          <div>
            <span class="contador-aguardando" v-show="this.abaAberta == 'atendimento' && aguardando.length">
              {{ aguardando.length }}
            </span>
          </div>
        </div>
        <div class="lista-aguardando" v-if="aguardando && aguardando.length">
          <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta !== 'aguardando'}">
            <li
              v-for="(atd, indice) in aguardando"
              :key="'id_'+indice"
              :id="'li_'+indice"
              :title="atd.nome_usu"
              @click="ativarCliente(atd.login_usu, atd.grupo, atd, 'aguardando')"
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
              <i class="far fa-address-book"  :title="dicionario.sub_titulo_agenda"></i>
            </div>
            <transition name="fade">
              <h2 v-show="!fechado" >
                {{ dicionario.sub_titulo_agenda }}
              </h2>
            </transition>
          </div>
          <ul :class="{'fechado' : fechado}" v-if="minhaAgenda && minhaAgenda.length">
            <li
              v-for="(atd, indice) in minhaAgenda"
              :key="'id_'+indice"
              :id="'li_'+indice"
              :title="atd.nome_usu"
              @click="ativarCliente(atd.login_usu, atd.grupo, atd, 'agenda')"
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
            <p> {{ dicionario.msg_sem_agenda }} </p>
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
            {{ dicionario.msg_sem_contatos }}
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
import axios_api from '@/services/serviceAxios'
import { gerenciarCores } from "@/services/gerenciarCores"

import SimpleContextMenu from 'vue-simple-context-menu'
import UltimaMsg from "../UltimaMsg"

export default {
  data() {
    return {
      fechado: false,
      rotate: false,
      haContatos: true,
      objAtendimentos: [],
      abaAberta: 'aguardando',
      totalMsgNovas: '',
      totalClientesNovos: '',
      reqEmAndamento: false,
    };
  },
  components: {
    "simple-context-menu" : SimpleContextMenu,
    "ultima-msg" : UltimaMsg
  },
  watch: {
    todosAtendimentos() {
      if(this.todosAtendimentos){
        this.objAtendimentos = Object.values(this.todosAtendimentos)
        
        this.contarMsgClientes()

        if(this.objAtendimentos.length && this.idAtendimentoAtivo == ''){
          this.ativarConversa(this.objAtendimentos[0], 0)
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
        
      } else {
        this.objAtendimentos = []
      }
      
      if(this.minhaAgenda.length){
        this.minhaAgenda.map(cliAgenda => {
          for(let atd in this.todosAtendimentos){
            if(cliAgenda.id_cli == this.todosAtendimentos[atd].id){
              axios_api.get(`get-agenda?${this.reqTeste}`)
                .then(response => {
                  const arrAgenda = response.data.ret || []

                  this.$store.dispatch("setAgenda", arrAgenda)
                })
                .catch(error => {
                  console.log("Error get agenda: ", error)
                })
              
              return
            }
          }
        })
      }
    },
    caso(){
      if(this.caso == 206 || this.caso == 400){
        this.$root.$emit("reverter-cores")

        const tituloContatos = document.querySelector('.titulo-contatos')
        const tituloAgenda = document.querySelector('.lista-agenda--titulo')

        if(tituloContatos, tituloAgenda){
          tituloContatos.style.background = ''
          tituloAgenda.style.background = ''
        }
      }
    }
  },
  beforeUpdate(){
    gerenciarCores(this, "contatos")
  },
  updated(){
    // Verificando se o usuario esta em mais de um array e removendo caso sim
    this.objAtendimentos.map(atd => {
      this.minhaAgenda.map(atdAgenda => {
        if(atd.login_usu == atdAgenda.login_usu){
          let auxAgenda = this.minhaAgenda
          auxAgenda = auxAgenda.filter(agenda => {
            return agenda.login_usu !== atd.login_usu
          })
          this.$store.dispatch("setAgenda", auxAgenda)
        }
      })
      this.aguardando.map(atdAguardando => {
        if(atd.login_usu == atdAguardando.login_usu){
          let auxAguardando = this.aguardando
          auxAguardando = auxAguardando.filter(aguardando => {
            return aguardando.login_usu !== atd.login_usu
          })
          this.$store.dispatch("setAguardando", auxAguardando)
        }
      })
    })

    // Verificando mensagens com o mesmo seq
    if(this.atendimentoAtivo && this.atendimentoAtivo.arrMsg){
      const chaves = Object.keys(this.atendimentoAtivo.arrMsg)
      const arrMsgAtualizado = []
      if(chaves.length){
        const chaveFinal = chaves[chaves.length - 1]
        if(this.atendimentoAtivo.arrMsg[chaveFinal]){
          for(let msg in this.atendimentoAtivo.arrMsg[chaveFinal].msg){
            if(msg - 1 >= 0){
              const ultimoSeq = this.atendimentoAtivo.arrMsg[chaveFinal].msg[msg - 1].seq
              if(!(ultimoSeq == this.atendimentoAtivo.arrMsg[chaveFinal].msg[msg].seq)){
                arrMsgAtualizado.push(this.atendimentoAtivo.arrMsg[chaveFinal].msg[msg])
              }
            }
  
            if(msg == 0){
              arrMsgAtualizado.push(this.atendimentoAtivo.arrMsg[chaveFinal].msg[msg])
            }
          }
  
          if(arrMsgAtualizado.length !== this.atendimentoAtivo.arrMsg[chaveFinal].msg.length){
            arrMsgAtualizado[arrMsgAtualizado.length - 1] = this.atendimentoAtivo.arrMsg[chaveFinal].msg[this.atendimentoAtivo.arrMsg[chaveFinal].msg.length - 1]
            this.$set(this.atendimentoAtivo.arrMsg[chaveFinal], "msg", arrMsgAtualizado)
          }
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
  },
  computed: {
    ...mapGetters({
      todosAtendimentos: "getTodosAtendimentos",
      minhaAgenda: "getAgenda",
      aguardando: "getAguardando",
      caso: "getCaso",
      iframesDisponiveis: "getIframesDisponiveis",
      atendimentoAtivo: "getAtendimentoAtivo",
      idAtendimentoAtivo: "getIdAtendimentoAtivo",
      reqRegras: "getReqRegras",
      dominio: "getDominio",
      reqTeste: "getReqTeste",
      dicionario: "getDicionario"
    })
  },
  methods: {
    ativarCliente(id, grupo, atd, origem){
      if(!id || !grupo){
        this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        console.log("parametros da funcao ativar cliente nao estao de acordo com o esperado")
        return
      }

      if(this.reqEmAndamento){
        return
      }else{
        this.reqEmAndamento = true
      }

      let data = {
        login_usu: id,
        grupo: grupo
      }

      axios_api.post(`start-contato?${this.reqTeste}`, data)
        .then((response) => {
          this.reqEmAndamento = false
          if(response.data.st_ret == "OK"){
            this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_aguarde_ativar_cliente})
            // Remover do aguardando  
            if(origem == "aguardando"){
              let aguardandoAux = this.aguardando
              aguardandoAux = aguardandoAux.filter((atendimento) => {
                return atendimento.id_cli != atd.id_cli
              })
              this.$store.dispatch("setAguardando", aguardandoAux)
            }else if(origem == "agenda"){
              let agendaAux = this.minhaAgenda
              agendaAux = agendaAux.filter((atendimento) => {
                return atendimento.id_cli != atd.id_cli
              })
              this.$store.dispatch("setAgenda", agendaAux)
            }
          }else if(response.data.st_ret == "AVISO"){
            this.$toasted.global.emConstrucao({msg: response.data.msg_ret || this.dicionario.msg_erro_ativar_cliente})
          }
        })
        .catch(error => {
          this.reqEmAndamento = false
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        })
    },
    alternarAbaAberta(){
      if(this.abaAberta == "aguardando"){
        this.abaAberta = ""
      }else{
        this.abaAberta = "aguardando"
      }
    },
    contarMsgClientes() {
      this.totalMsgNovas = ''
      this.totalClientesNovos = ''
      let auxContMsgNova = 0
      let auxContNovoContato = 0
      for(let index in this.objAtendimentos) {
        if(this.objAtendimentos[index].qtdMsgNova) {
          auxContMsgNova = auxContMsgNova + this.objAtendimentos[index].qtdMsgNova
        }
        if(this.objAtendimentos[index].novoContato) {
          auxContNovoContato++
        }
      }

      this.totalMsgNovas = auxContMsgNova
      this.totalClientesNovos = auxContNovoContato
    },
    formataSigla(letra, acao){
      if(!letra){ return }
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

        if(typeof(atd) == "object"){
          atd.data_agenda_formatada = dataAux + ' ' + horaAux
        }

        return dataAux + ' ' + horaAux
      }else{

        const spanContador = document.querySelector(`${id} span.contador-data-retorno`)
        if(!spanContador){
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
    ativarConversa(atd, indice) {
      
      if(atd.id_cli == this.idAtendimentoAtivo){
        return
      }

      if(atd.novoContato){
        atd.novoContato = false
      }

      if(atd.alertaMsgNova){
        atd.alertaMsgNova = false
      }

      if(atd.qtdMsgNova){
        atd.qtdMsgNova = 0
      }

      if(this.$store.getters.getVerificaMsgFormatadaAberto){
        this.$root.$emit("toggle-msg-formatada")
      }

      this.contarMsgClientes()

      this.$store.dispatch('setAtendimentoAtivo', atd)

      let objMensagens = Object.values(atd.arrMsg) 
      let todasMensagens = []
      for(let objMsg in objMensagens){
        todasMensagens.push(objMensagens[objMsg].msg)
      }

      // Muda a estrutura do arrMsg para o esperado
      this.setMensagensClienteAtivo(atd.id_cli, todasMensagens)
      
      this.exibirInformacoes(atd, indice)
  
      this.$store.dispatch('setIdAtendimentoAtivo', atd.id_cli)
    },
    exibirInformacoes(atd, indice) {
      atd.informacoes = {}
      atd.informacoes.nome = atd.nome_usu
      atd.id = atd.login_usu
      
      this.$root.$emit('mostrar-iframe', atd.id, atd.url)
    },
    setMensagensClienteAtivo(id, arrMensagens) {
      
      for(let index in arrMensagens){
        for (let i in arrMensagens[index]) {
          if(i != 'st_ret') {

            // Caso nao entre nesse if significa que a mensagem ja esta na estrutura esperada
            if(!(arrMensagens[index][i].origem)){

              let mensagem = arrMensagens[index][i].msg;
              let status = arrMensagens[index][i].status
              let origem;
              arrMensagens[index][i].resp_msg == "CLI" ? (origem = "outros") : (origem = "principal");
              let horario = arrMensagens[index][i].hora;

              let autor = ""
              if(arrMensagens[index][i].nome){
                autor = arrMensagens[index][i].nome;
              }else{
                autor = arrMensagens[index][i].resp_msg
                switch (autor) {
                  case "CLI":
                    autor = "Cliente";
                    break;
                  case "OPE":
                    autor = "Operador";
                    break;
                }
              }
              
              let anexo = false;
  
              let imgAnexo = "";
              let tipoDoc = ""
              let docAnexo = "";
              let nomeArquivo = ""
              let audio = false
              let video = false
              let seq = arrMensagens[index][i].seq
  
              if(arrMensagens[index][i].anexos){
                anexo = true
  
                var regex = /(\w+)\/(\w+)/g;
                var type = regex.exec(arrMensagens[index][i].anexos.type);
                
                if(!type){
                  type = arrMensagens[index][i].anexos.type
                }else{
                  type = type[1]
                }
    
                switch (type) {
                  case "image": 
                    imgAnexo = `${this.dominio}/callcenter/docs.php?mku=${arrMensagens[index][i].anexos.mku}`
                    nomeArquivo = arrMensagens[index][i].anexos.name
                    break;
                  case "audio/ogg":
                  case "audio/oga":
                  case "audio":
                  case "ogg":
                  case "oga":
                  case "mpga":
                  case "audio/mpga":
                  case "mp3":
                  case "audio/mp3":
                    tipoDoc = arrMensagens[index][i].anexos.type
                    docAnexo = `${this.dominio}/callcenter/docs.php?mku=${arrMensagens[index][i].anexos.mku}`
                    nomeArquivo = arrMensagens[index][i].anexos.name
                    audio = true
                    break;
                  case "video/mp4":
                  case "video":
                  case "mp4":
                    tipoDoc = arrMensagens[index][i].anexos.type
                    docAnexo = `${this.dominio}/callcenter/docs.php?mku=${arrMensagens[index][i].anexos.mku}`
                    nomeArquivo = arrMensagens[index][i].anexos.name
                    video = true
                    break;
                  default:
                    tipoDoc = arrMensagens[index][i].anexos.type
                    docAnexo = `${this.dominio}/callcenter/docs.php?mku=${arrMensagens[index][i].anexos.mku}`
                    nomeArquivo = arrMensagens[index][i].anexos.name
                    break;
                }
              }

              arrMensagens[index][i] = this.getObjMensagem( seq, autor, origem, mensagem, status, horario, anexo, imgAnexo, tipoDoc, docAnexo, nomeArquivo, audio, video );
  
              if(document.querySelector('#textarea')){
                document.querySelector('#textarea').focus()
              }
            }
          }
        }
      }
    },
    getObjMensagem(
      inSeq,
      inAutor,
      inOrigem,
      inMensagem,
      inStatus,
      inHorario,
      inAnexo,
      inImgAnexo,
      inTipoDoc,
      inDocAnexo,
      inNomeArquivo,
      inAudio,
      inVideo
    ) {
      let objMensagem = {
        seq: inSeq,
        autor: inAutor, // Operador, Cliente
        origem: inOrigem, // principal e outros
        msg: inMensagem,
        status: inStatus,
        horario: inHorario,
        anexo: inAnexo,
        imgAnexo: inImgAnexo,
        tipoDoc: inTipoDoc,
        docAnexo: inDocAnexo,
        nomeArquivo: inNomeArquivo,
        audio: inAudio,
        video: inVideo
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
      if(!arrMsgs){ return }
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
      nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, (capitalize) => { return capitalize.toUpperCase() })
      return nome
    }
  }
};
</script>
