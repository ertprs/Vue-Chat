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
      <template v-else>
        <div class="load">
          <i class="fas fa-hourglass-end"></i>
        </div>
      </template>
      <!-- PARA TESTES, COMENTAR ANTES DO BUILD -->
      <!-- <template v-else>
        <div
          class="rodape-botoes-botao botao-transferencia"
          :title="'Transferir'"
          @click="abrirTransferir()">

          <i class="fas fa-random"></i>
          <span> {{ 'Transferir' }}</span>
        </div>
        <div
          class="rodape-botoes-botao botao-retornar"
          :title="'Retornar'"
          @click="retornarForm()">

          <i class="fas fa-undo"></i>
          <span>{{ 'Retornar' }}</span>
        </div>
        <div
          class="rodape-botoes-botao botao-encerrar"
          :title="'Encerrar'"
          @click="popupEncerrar()">

          <i class="fas fa-sign-out-alt"></i>
          <span>{{ 'Encerrar' }}</span>
        </div>
      </template> -->
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
import { executandoEncerrar, liberarEncerrar } from '../services/atendimentos'

export default {
  data(){
    return{
      titulo: '',
      origem: '',
      regrasDoClienteAtivo: {},
      regrasBotoes: {},
      regrasCor: {},
      tudoPronto: false,
      arrAgentes: [],
      arrGrupos: [],
      bgPopup: '',
      contadorRequisicoesFalhas: 0 
    }
  },
  components: {
    Popup
  },
  mounted(){
    this.getRegras()
    this.$root.$on('encerrarAtendimento', () => {
      this.encerrarAtendimento()
      this.reverterCoresClienteAtivo()
    })
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
      caso: 'getCaso'
    })
  },
  watch: {
    atendimentoAtivo(){
      if(this.atendimentoAtivo.login_usu !== this.regrasDoClienteAtivo.id){
        this.tudoPronto = false
        this.getRegras()
      }
    }
  },
  methods: {
    getRegras(){
      this.reqRegras(this.atendimentoAtivo.token_cliente, this.atendimentoAtivo.login_usu)
    },
    reqRegras(tokenCliente, id){
        axios_api.get(`get-rules?token_cliente=${tokenCliente}`)
        .then(response => {
          if (response.data.st_ret == 'OK') {
            this.contadorRequisicoesFalhas = 0

            const arrayRegras = response.data
            let objRegra = {
              id: id,
              regras: arrayRegras
            }
            this.regrasDoClienteAtivo = objRegra
            this.preencherRegrasDoClienteAtivo()
          }
        })
        .catch(error => {
          this.contadorRequisicoesFalhas++
          if(this.contadorRequisicoesFalhas < 10){
            this.getRegras()
          }
          console.log('Erro getRules: ', error)
        })
    },
    preencherRegrasDoClienteAtivo(){
      if(this.regrasDoClienteAtivo.regras){
        this.regrasBotoes = this.regrasDoClienteAtivo.regras.rules
        this.setCoresClienteAtivo()
        this.tudoPronto = true
      }
    },
    setCoresClienteAtivo(){
      this.regrasCor = this.regrasDoClienteAtivo.regras.rules.primary_color
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
    lightenDarkenColor(cor, qtd) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cor)

      result = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null

      if(!result){
        return
      }

      let r = result.r
      let g = result.g
      let b = result.b

      result.r = novaCor(r, qtd)
      result.g = novaCor(g, qtd)
      result.b = novaCor(b, qtd)

      function novaCor(c, qtd){
        if(c >= 0 && c <= 255){
          if(c + qtd < 0 || c + qtd > 255){
            return c
          }else{
            return c + qtd
          }
        }
      }

      result = "#" + componenteRGBParaHex(result.r) + componenteRGBParaHex(result.g) + componenteRGBParaHex(result.b);

      function componenteRGBParaHex(color){
        let hex = color.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      return result
    },
    checaBlocker(){
      this.$store.dispatch('setOrigemBlocker', 'btn-acoes')
      this.$store.dispatch('setBlocker', true)
    },
    abrirTransferir(){
      this.checaBlocker()
      this.origem = 'Transferir'
      if(this.tudoPronto){
        this.titulo = this.regrasBotoes.button_transfer.name
      }else{
        this.titulo = 'Transferir'
      }
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
      this.checaBlocker()
      this.origem = 'Retornar'
      if(this.tudoPronto){
        this.titulo = this.regrasBotoes.button_suspend.name
      }else{
        this.titulo = 'Retornar'
      }
    },
    popupEncerrar(){
      this.checaBlocker()
      this.$store.dispatch('setUltimoIdRemovido', this.atendimentoAtivo.id_cli)

      executandoEncerrar()
      this.origem = 'Encerrar'
      if(this.tudoPronto){
        this.titulo = this.regrasBotoes.button_end.name
      }else{
        this.titulo = 'Encerrar'
      }
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

            let todosAtendimentosFiltrado = []
            for(let ramal_local in this.todosAtendimentos){
              todosAtendimentosFiltrado.push(this.todosAtendimentos[ramal_local])
            }
            
            todosAtendimentosFiltrado = todosAtendimentosFiltrado.filter(el => {
              return el.token_cliente !== this.atendimentoAtivo.token_cliente
            })
            
            if(!todosAtendimentosFiltrado.length){
              this.$store.dispatch('setCaso', 206)
            }

            this.tudoPronto = false
            this.$store.dispatch('setAtendimentos', todosAtendimentosFiltrado)
            
            this.$store.dispatch('limparAtendimentoAtivo')
            this.$store.dispatch('limparIdAtendimentoAtivo')
            this.$root.$off('atualizar_mensagem')
            this.$root.$off('rolaChat')
          }
          setTimeout(() => {
            liberarEncerrar()
          }, 5000);
        })
        .catch(error => {
          setTimeout(() => {
            liberarEncerrar()
          }, 5000);
          console.log('Error end atd: ', error)
          this.$toasted.global.defaultError({msg: 'Nao foi possivel encerrar o atendimento. Tente novamente'})
        })
    }
  },
  beforeDestroy: function() {
    this.$root.$off('encerrarAtendimento')
  }
}
</script>
