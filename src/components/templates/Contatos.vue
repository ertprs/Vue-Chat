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
      <div @click="toggleContatos($event)" class="container-flecha" :class="rotate ? 'rotate' : ''">
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
        <div class="lista-atendimento--titulo" v-if="caso !== 400 && caso !== 206" :class="{'fechado' : fechado}">
          <div :class="{'fechado' : fechado}">
            <i class="fas fa-play" :title="dicionario.sub_titulo_atendimentos"></i>
          </div>
          <h2 v-show="!fechado" >
            {{ dicionario.sub_titulo_atendimentos }}
          </h2>
          <div :class="{'fechado' : fechado}" class="container-contadores">
            <span v-if="objAtendimentos.length" :title="dicionario.title_total_clientes" class="total-clientes">{{ objAtendimentos.length }}</span>
            <span v-if="totalClientesNovos != ''" :title="dicionario.title_total_novos_clientes" class="total-clientes-novos">{{ totalClientesNovos }}</span>
            <span v-if="totalMsgNovas != ''" :title="dicionario.title_total_msgs_novas" class="total-msgs-novas">{{ totalMsgNovas }}</span>
          </div>
        </div>
        <ul :class="{'fechado' : fechado}"  id="lista-contatos" v-if="objAtendimentos.length && caso !== 206">
          <li
            v-for="(atd, indice) in objAtendimentos"
            :key="indice"
            :title="acionaFormataNome(atd.nome_usu)"
            :class="{'destaque-novo-contato' : atd.novoContato, 'nova-msg' : atd.alertaMsgNova, 'ativo' : idAtendimentoAtivo == atd.id_cli}"
            @click="ativarConversa( atd, indice )"
            @contextmenu="abrirMenuBotaoDireito($event)"
          >
            <div class="circulo-contatos">
              <p>{{ acionaFormataSigla(atd.nome_usu[0], 'upper') }}</p>
              <p v-if="fechado">{{ acionaFormataSigla(atd.nome_usu[1], 'lower') }}</p>
              <img v-if="atd.sigla" :src="`${dominio}/callcenter/imagens/ext_top_${atd.sigla}.png`">
            </div>
            <template v-if="!fechado">{{ acionaFormataNome(atd.nome_usu) }}</template>
            <ultima-msg v-if="!fechado" :mensagens="atd.arrMsg" />
            <span v-if="atd.alertaMsgNova && atd.qtdMsgNova > 0 && idAtendimentoAtivo !== atd.id_cli" class="destaque-nova-msg">{{ atd.qtdMsgNova }}</span>
            <span v-if="idAtendimentoAtivo == atd.id_cli" class="ctt-ativo"></span>
          </li>
        </ul>

        <div class="lista-aguardando--titulo">
          <div :class="{'fechado' : fechado}">
            <i class="far fa-hourglass" :title="dicionario.sub_titulo_aguardando"></i>
          </div>
          <transition name="fade">
            <h2 v-show="!fechado" >
              {{ dicionario.sub_titulo_aguardando }}
            </h2>
          </transition>
        </div>
        <lista-aguardando :fechado="fechado" />

        <lista-agenda :fechado="fechado" />
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

import { formataNome, formataSigla, formataDataHora } from "@/services/formatacaoDeTextos"
import { gerenciarCores } from "@/services/gerenciarCores"

import SimpleContextMenu from 'vue-simple-context-menu'
import ListaAguardando from "../ListaAguardando"
import ListaAgenda from "../ListaAgenda"
import UltimaMsg from "../UltimaMsg"

export default {
  data() {
    return {
      fechado: false,
      rotate: false,
      haContatos: true,
      objAtendimentos: [],
      totalMsgNovas: '',
      totalClientesNovos: '',
      reqEmAndamento: false,
    };
  },
  components: {
    "simple-context-menu" : SimpleContextMenu,
    "ultima-msg" : UltimaMsg,
    "lista-aguardando": ListaAguardando,
    "lista-agenda": ListaAgenda
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

        this.verificarDuplicataMinhaAgenda()
      } else {
        this.objAtendimentos = []
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
  created(){
    this.verificaLocalStorage()
  },
  mounted(){

    this.$root.$on('toggle-contatos', () => {
      this.toggleContatos()
    })

    this.$root.$on("verificar-seq", () => {
      this.verificarMsgMesmoSeq()
    })
  },
  computed: {
    ...mapGetters({
      todosAtendimentos: "getTodosAtendimentos",
      minhaAgenda: "getAgenda",
      aguardando: "getAguardando",
      todos: "getTodos",
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
    verificarDuplicataMinhaAgenda(){
      if(this.minhaAgenda.length && this.objAtendimentos.length){
        let fazerRequisicao = false
        this.objAtendimentos.map(atd => {
          this.minhaAgenda.map(atdAgenda => {
            if(atd.login_usu === atdAgenda.login_usu){
              fazerRequisicao = true
            }
          })
        })

        if(fazerRequisicao){
          this.$root.$emit("req-agenda")
        }
      }
    },
    abrirMenuBotaoDireito(ev){
      this.$root.$emit("abrir-menu", ev)
    },
    verificarMsgMesmoSeq(){
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
              this.$forceUpdate()
            }
          }
        }
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
    adicionaCaso(caso){
      this.$store.dispatch('setCaso', caso)
    },
    ativarConversa(atd, indice) {

      if(atd.id_cli == this.idAtendimentoAtivo){
        if(atd.nro_chat == this.atendimentoAtivo.nro_chat){
          return
        }
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

      if(!todasMensagens[0] || todasMensagens[0] == "ERRO"){
        todasMensagens = {erro: true, msg: atd.arrMsg.msg_ret}
      }
      if(atd.arrMsg[0]){
        if(atd.arrMsg[0].st_ret == "ERRO"){
          todasMensagens = {erro: true, msg: atd.arrMsg[0].msg_ret}
        }
      }

      if(todasMensagens.erro){
        // Muda a estrutura do arrMsg para o esperado
        this.setMensagensClienteAtivo(atd.id_cli, todasMensagens, true)
      }else{
        this.setMensagensClienteAtivo(atd.id_cli, todasMensagens, false)
      }

      this.exibirInformacoes(atd, indice)

      this.$store.dispatch('setIdAtendimentoAtivo', atd.id_cli)

      setTimeout(() => {
        if(document.querySelector("textarea")){
          document.querySelector("textarea").focus()
        }
      }, 150)
    },
    exibirInformacoes(atd, indice) {
      atd.informacoes = {}
      atd.informacoes.nome = atd.nome_usu
      atd.id = atd.login_usu

      this.$root.$emit('mostrar-iframe', atd.id, atd.url)
    },
    setMensagensClienteAtivo(id, arrMensagens, erro) {
      if(erro){
        this.atendimentoAtivo.arrMsg = [{st_ret: "ERRO", msg_ret: arrMensagens.msg}]
        return
      }

      for(let index in arrMensagens){
        for (let i in arrMensagens[index]) {
          if(i != 'st_ret') {

            // Caso nao entre nesse if significa que a mensagem ja esta na estrutura esperada
            if(!(arrMensagens[index][i].origem)){

              let mensagem = arrMensagens[index][i].msg;
              let link = false
              let status = arrMensagens[index][i].status
              let tooltip = ""
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

              const regexLink = /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
              if(mensagem.search(regexLink) !== -1){
                link = true
                let arrLinks = mensagem.split(" ")
                arrLinks = arrLinks.map((link) => {
                  if(link.search(regexLink) !== -1){
                    let href = ""
                    if(link.search(/http/g) !== -1){
                      href = link
                    }else{
                      href = "https://"+link
                    }

                    link = `<a href="${href}" target="_blank" title="${link} ${this.dicionario.msg_link}">${link}</a>`
                  }
                  return link
                })

                mensagem = arrLinks.join(" ")
              }

              // Tratativa de *negrito* _italico_ e ~cortado~
              const regexNegrito = /\*[\sA-Za-z0-9\u00C0-\u00FF]+\*/g
              const regexItalico = /\_[\sA-Za-z0-9\u00C0-\u00FF]+\_/g
              const regexLinha = /\~[\sA-Za-z0-9\u00C0-\u00FF]+\~/g

              if(mensagem.search(regexNegrito) !== -1){
                let arrTexto = mensagem.split(" ")

                let abrirTag = true
                arrTexto = arrTexto.map((mensagem) => {
                  if(mensagem.search(/\*/) !== -1){
                      if(mensagem.length > 1){
                        if(mensagem.match(/\*/g).length > 1){
                          mensagem = mensagem.replace(/\*/g, "")
                          mensagem = `<b>${mensagem}</b>`
                        }else{
                          mensagem = mensagem.replace(/\*/, "")
                          if(abrirTag){
                            mensagem = `<b>${mensagem}`
                            abrirTag = false
                          }else{
                            mensagem += "</b>"
                          }
                        }
                      }else{
                        if(abrirTag){
                          mensagem = mensagem.replace(/\*/, "<b>")
                          abrirTag = false
                        }else{
                          mensagem = mensagem.replace(/\*/, "</b>")
                        }
                      }
                    }
                    return mensagem
                })
                mensagem = arrTexto.join(" ")
              }

              if(mensagem.search(regexItalico) !== -1){
                let arrTexto = mensagem.split(" ")

                let abrirTag = true
                arrTexto = arrTexto.map((mensagem) => {
                  if(mensagem.search(/\_/) !== -1){
                      if(mensagem.length > 1){
                        if(mensagem.match(/\_/g).length > 1){
                          mensagem = mensagem.replace(/\_/g, "")
                          mensagem = `<i>${mensagem}</i>`
                        }else{
                          mensagem = mensagem.replace(/\_/, "")
                          if(abrirTag){
                            mensagem = `<i>${mensagem}`
                            abrirTag = false
                          }else{
                            mensagem += "</i>"
                          }
                        }
                      }else{
                        if(abrirTag){
                          mensagem = mensagem.replace(/\_/, "<i>")
                          abrirTag = false
                        }else{
                          mensagem = mensagem.replace(/\_/, "</i>")
                        }
                      }
                    }
                    return mensagem
                })
                mensagem = arrTexto.join(" ")
              }

              if(mensagem.search(regexLinha) !== -1){
                let arrTexto = mensagem.split(" ")

                let abrirTag = true
                arrTexto = arrTexto.map((mensagem) => {
                  if(mensagem.search(/\~/) !== -1){
                      if(mensagem.length > 1){
                        if(mensagem.match(/\~/g).length > 1){
                          mensagem = mensagem.replace(/\~/g, "")
                          mensagem = `<del>${mensagem}</del>`
                        }else{
                          mensagem = mensagem.replace(/\~/, "")
                          if(abrirTag){
                            mensagem = `<del>${mensagem}`
                            abrirTag = false
                          }else{
                            mensagem += "</del>"
                          }
                        }
                      }else{
                        if(abrirTag){
                          mensagem = mensagem.replace(/\~/, "<del>")
                          abrirTag = false
                        }else{
                          mensagem = mensagem.replace(/\~/, "</del>")
                        }
                      }
                    }
                    return mensagem
                })
                mensagem = arrTexto.join(" ")
              }

              let msgStatus = "msg_status_"+arrMensagens[index][i].status
              let str = `<p class="tooltip-titulo-status-message">${this.dicionario[msgStatus]}</p>`
              if(arrMensagens[index][i].data_hora_status && arrMensagens[index][i].data_hora_status !== "1111-11-11 00:00:00"){
                str += `<p>${this.acionaFormataDataHora(arrMensagens[index][i].data_hora_status, true)}</p>`
              }
              str += `<ul class="tooltip-list">`
              if(arrMensagens[index][i].data_hora_gravacao && arrMensagens[index][i].data_hora_gravacao !== "1111-11-11 00:00:00"){
                str += `<li>${this.dicionario.msg_data_hora_gravacao} - ${this.acionaFormataDataHora(arrMensagens[index][i].data_hora_gravacao, true)}</li>`
              }
              if(arrMensagens[index][i].data_hora_envio_fila && arrMensagens[index][i].data_hora_envio_fila !== "1111-11-11 00:00:00"){
                str += `<li>${this.dicionario.msg_data_hora_envio_fila} - ${this.acionaFormataDataHora(arrMensagens[index][i].data_hora_envio_fila, true)}</li>`
              }
              if(arrMensagens[index][i].data_hora_envio_cliente && arrMensagens[index][i].data_hora_envio_cliente !== "1111-11-11 00:00:00"){
                str += `<li>${this.dicionario.msg_data_hora_envio_cliente} - ${this.acionaFormataDataHora(arrMensagens[index][i].data_hora_envio_cliente, true)}</li>`
              }
              if(arrMensagens[index][i].data_hora_entrega && arrMensagens[index][i].data_hora_entrega !== "1111-11-11 00:00:00"){
                str += `<li>${this.dicionario.msg_data_hora_entrega} - ${this.acionaFormataDataHora(arrMensagens[index][i].data_hora_entrega, true)}</li>`
              }
              if(arrMensagens[index][i].data_hora_leitura && arrMensagens[index][i].data_hora_leitura !== "1111-11-11 00:00:00"){
                str += `<li>${this.dicionario.msg_data_hora_leitura} - ${this.acionaFormataDataHora(arrMensagens[index][i].data_hora_leitura, true)}</li>`
              }
              if(arrMensagens[index][i].status_msg){
                str += `<li>${arrMensagens[index][i].status_msg}</li>`
              }
              str += "</ul>"

              if(!str.endsWith('<ul class="tooltip-list"></ul>')){
                tooltip = str
              }

              arrMensagens[index][i] = this.getObjMensagem( seq, autor, origem, mensagem, link, status, horario, anexo, imgAnexo, tipoDoc, docAnexo, nomeArquivo, audio, video, tooltip );

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
      inLink,
      inStatus,
      inHorario,
      inAnexo,
      inImgAnexo,
      inTipoDoc,
      inDocAnexo,
      inNomeArquivo,
      inAudio,
      inVideo,
      inTooltip
    ) {
      let objMensagem = {
        seq: inSeq,
        autor: inAutor, // Operador, Cliente
        origem: inOrigem, // principal e outros
        msg: inMensagem,
        link: inLink,
        status: inStatus,
        horario: inHorario,
        anexo: inAnexo,
        imgAnexo: inImgAnexo,
        tipoDoc: inTipoDoc,
        docAnexo: inDocAnexo,
        nomeArquivo: inNomeArquivo,
        audio: inAudio,
        video: inVideo,
        tooltip: inTooltip
      };
      return objMensagem;
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
    acionaFormataDataHora(dataHora, origem){
      return formataDataHora(dataHora, origem)
    },
    acionaFormataNome(nome){
      return formataNome(nome)
    },
    acionaFormataSigla(letra, acao){
      return formataSigla(letra, acao)
    },
  }
};
</script>
