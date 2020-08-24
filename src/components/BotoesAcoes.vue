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
      :arrGrupos="arrGrupos" />
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
      titulos: ['Transferir', 'Retornar'],
      titulo: '',
      origem: '',
      regrasDoClienteAtivo: [],
      regrasBotoes: [],
      tudoPronto: false,
      arrAgentes: [],
      arrGrupos: []
    }
  },
  components: {
    Popup
  },
  watch: {
    regras(){
      if(this.regras.length){
        this.preencherRegrasDoClienteAtivo()
      }
    }
  },
  mounted(){
    this.$root.$on('encerrarAtendimento', () => {
      this.encerrarAtendimento()
    })

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
      if(!this.regrasBotoes.length){
        const login_usu = this.atendimentoAtivo.login_usu
        this.regrasDoClienteAtivo = this.regras.filter(regra => regra.id == login_usu)
        this.regrasBotoes = this.regrasDoClienteAtivo[0].regras.rules

        this.tudoPronto = true
      }
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
          console.log('response transferir: ', response.data.options)
          this.arrAgentes = response.data.options.agentes
          this.arrGrupos = response.data.options.grupos
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
            this.$store.dispatch('setAtendimentos', novosAtendimentos)
            this.$store.dispatch('limparIdAtendimentoAtivo')
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

<style>

</style>