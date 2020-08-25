<template>
  <div id="rodape-botoes-encerramento-container">
    <div class="rodape-botoes-encerramento">
      <template v-if="tudoPronto">
        <div 
          class="rodape-botoes-botao botao-transferencia"
          v-if="regrasBotoes.button_transfer.use == 'S'"
          :title="regrasBotoes.button_transfer.name"
          @click="abrirTransferir()">

          <i class="fas fa-random"></i>
          <span>{{ regrasBotoes.button_transfer.name }}</span>
        </div>
        <div
          class="rodape-botoes-botao botao-retornar"
          v-if="regrasBotoes.button_suspend.use == 'S'"
          :title="regrasBotoes.button_suspend.name"
          @click="retornarForm()">

          <i class="fas fa-undo"></i>
          <span>{{ regrasBotoes.button_suspend.name }}</span>
        </div>
        <div 
          class="rodape-botoes-botao botao-encerrar"
          v-if="regrasBotoes.button_end.use == 'S'"
          :title="regrasBotoes.button_end.name" 
          @click="popupEncerrar()">

          <i class="fas fa-sign-out-alt"></i>
          <span>{{ regrasBotoes.button_end.name }}</span>
        </div>
      </template>
    </div>
    <!-- Tentar remover daqui -->
    <Popup 
      v-if="blocker && origem && titulo && origemBlocker == 'btn-acoes'"
      :titulo="titulo"
      :origem="origem"
      :arrAgentes="arrAgentes"
      :arrGrupos="arrGrupos"
      :bg="bgPopup" />
  </div>
</template>

<script>
import axios from 'axios'
import axios_api from '../services/serviceAxios'

import Popup from './templates/Popup'

import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      titulo: '',
      origem: '',
      regrasDoClienteAtivo: [],
      regrasBotoes: {},
      regrasCor: [],
      tudoPronto: false,
      arrAgentes: [],
      arrGrupos: [],
      bgPopup: '',
      limitador: 0
    }
  },
  components: {
    Popup
  },
  mounted(){
    this.$root.$on('encerrarAtendimento', () => {
      this.encerrarAtendimento()
      this.reverterCoresClienteAtivo()
    })

    this.preencherRegrasDoClienteAtivo()

  },
  beforeDestroy(){
    this.$root.$off('encerrarAtendimento')
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo',
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      blocker: 'getBlocker',
      origemBlocker: 'getOrigemBlocker',
      regras: 'getTodasRegras'
    })
  },
  methods: {
    preencherRegrasDoClienteAtivo(){
      const login_usu = this.atendimentoAtivo.login_usu
      this.regrasDoClienteAtivo  = this.regras.filter(regra => regra.id == login_usu)
      if(!this.tudoPronto && this.regrasDoClienteAtivo[0]){
        this.regrasBotoes = this.regrasDoClienteAtivo[0].regras.rules
        setTimeout(() => {
          this.setCoresClienteAtivo()
        }, 100)

        this.tudoPronto = true
        this.limitador = 0
      }else{
        this.limitador++
        if(this.limitador == 10){
          return
        }else{
          setTimeout(() => {
            this.preencherRegrasDoClienteAtivo()
          }, 300)
        }
      }
    },
    setCoresClienteAtivo(){
      this.regrasCor = this.regrasBotoes.primary_color
      if(this.regrasCor){
        this.aplicarCoresNoElemento('.chat-opcoes-titulo', this.regrasCor)
        this.aplicarCoresNoElemento('.titulo-contatos', this.lightenDarkenColor(this.regrasCor, 10))
        this.aplicarCoresNoElemento('.lista-agenda--titulo', this.lightenDarkenColor(this.regrasCor, 30))
        this.aplicarCoresNoElemento('#informacoes-titulo', this.lightenDarkenColor(this.regrasCor, -10))
        
        this.bgPopup = this.lightenDarkenColor(this.regrasCor, 15)
      }
    },
    reverterCoresClienteAtivo(){
      this.aplicarCoresNoElemento('.chat-opcoes-titulo', '')
      this.aplicarCoresNoElemento('.titulo-contatos', '')
      this.aplicarCoresNoElemento('.lista-agenda--titulo', '')
      this.aplicarCoresNoElemento('#informacoes-titulo', '')
      
      this.bgPopup = ''
    },
    aplicarCoresNoElemento(elem, cor){
      if(document.querySelector(elem)){
        document.querySelector(elem).style.backgroundColor = cor
      }
    },
    lightenDarkenColor(col, amt) {

      let usePound = false
      if (col[0] == "#") {
          col = col.slice(1)
          usePound = true
      }
    
      let num = parseInt(col,16)

      let r = (num >> 16) + amt
      if (r > 255) r = 255
      else if  (r < 0) r = 0

      let b = ((num >> 8) & 0x00FF) + amt  
      if (b > 255) b = 255
      else if  (b < 0) b = 0
  
      let g = (num & 0x0000FF) + amt
      if (g > 255) g = 255
      else if (g < 0) g = 0

      const color = (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16)
      return color
    },
    checaBlocker(){
      this.$store.dispatch('setOrigemBlocker', 'btn-acoes')
      this.$store.dispatch('setBlocker', true)
    },
    abrirTransferir(){
      this.checaBlocker()
      this.origem = 'Transferir'
      this.titulo = this.regrasBotoes.button_transfer.name

      const tokenCliente = this.atendimentoAtivo.token_cliente
      axios_api.get(`get-transfer?token_cliente=${tokenCliente}`)
        .then(response => {
          
          let arrChaves = []
          let arrValores = []

          if(response.data.options.agentes.length){
            response.data.options.agentes.map(objAgentes => {
              arrChaves = Object.keys(objAgentes)
              arrValores = Object.values(objAgentes)
            })

            for(let i = 0; i < arrChaves.length; i++){
              if(this.arrAgentes.length){
                if(this.arrAgentes[i].cod !== arrChaves[i]){
                  this.arrAgentes.push({ label: arrValores[i], cod: arrChaves[i] })
                }              
              }else{
                this.arrAgentes.push({ label: arrValores[i], cod: arrChaves[i] })
              }
            }
          }

          if(response.data.options.grupos.length){
            
            response.data.options.grupos.map(objGrupos => {
              arrChaves = Object.keys(objGrupos)
              arrValores = Object.values(objGrupos)
            })

            for(let i = 0; i < arrChaves.length; i++){
              if(this.arrGrupos.length){
                if(this.arrGrupos[i].cod !== arrChaves[i]){
                  this.arrGrupos.push({ label: arrValores[i], cod: arrChaves[i] })
                }              
              }else{
                this.arrGrupos.push({ label: arrValores[i], cod: arrChaves[i] })
              }
            }
          }
        })
        .catch(error => {
          console.log('Erro transferir: ', error)
        })

    },
    retornarForm(){
      this.origem = 'Retornar'
      this.titulo = this.regrasBotoes.button_suspend.name
      this.checaBlocker()
    },
    popupEncerrar(){
      this.origem = 'Encerrar'
      this.titulo = this.regrasBotoes.button_end.name
      this.checaBlocker()
    },
    async encerrarAtendimento() {
      if( this.atendimentoAtivo.informacoes.nome != null ) {
        await this.finalizarAtendimentoNaApi()
      } else {
        this.$toasted.global.defaultError({msg: 'Selecione um cliente antes de tentar finalizar o atendimento'})
      }
    },
    async finalizarAtendimentoNaApi() {
      let data = { "token_cliente": this.atendimentoAtivo.token_cliente }

      await axios_api.delete('end-atendimento', {data: {...data}})
        .then(response => {
          if(response.data.st_ret == 'OK'){

            // Forma alternativa para excluir  posicao em um ARRAY (não obj, por isso não se aplica ao caso abaixo)
            /* Ex: 
              this.todosAtendimentos.filter(atendimento => atendimento.id_cli != this.idAtendimentoAtivo)
            */

            this.$store.dispatch('limparAtendimentoAtivo')

            var novosAtendimentos = {}
            for(var ramal_local in this.todosAtendimentos) {
              if(this.todosAtendimentos[ramal_local].id_cli !== this.idAtendimentoAtivo) {
                novosAtendimentos[ramal_local] = this.todosAtendimentos[ramal_local]
              }
            }
            if(!Object.keys(novosAtendimentos).length){
              this.$store.dispatch('setCaso', 206)
            }
            this.$store.dispatch('setAtendimentos', novosAtendimentos)
            this.$store.dispatch('limparIdAtendimentoAtivo')

            this.$root.$off('atualizar_mensagem')
            this.$root.$off('rolaChat')
          }
        })
        .catch(error => {
          console.log('Error end atd: ', error)
          this.$toasted.global.defaultError({msg: 'Nao foi possivel encerrar o atendimento. Tente novamente'})
        })

    }
  }
}
</script>
