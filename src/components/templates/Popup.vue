<template>
  <div id="popup" popup @click="fecharPopup($event)" v-if="abrirPopup && blocker">
    <div>
      <h2 class="popup-titulo" :style="'background-color: '+bg">{{ titulo }}</h2>
      <template v-if="origem == 'Retornar'">
        <ul 
          lista-retornar 
          :class="{'tres-mais' : tamanhoChat(), 'bg' : bg}"
          v-if="!pessoalData">
          <li @click="$toasted.global.emConstrucao(), fecharPopup()"> Todos </li>
          <li @click="$toasted.global.emConstrucao(), fecharPopup()"> Pessoal </li>
          <li @click="pessoalData = true"> Pessoal/Data </li>
        </ul>
        <div v-if="pessoalData" agendar-retorno>
          <input type="datetime-local" :min="setData('minimo')" :max="setData('maximo')" v-model="dataHora" />
          <ul 
            class="btns-agendamento-container"
            :class="{'bg' : bg}">
            <li class="btn-confirmar-agendamento" @click="agendarRetorno(dataHora)"> Confirmar </li>
            <li class="btn-cancelar-agendamento" @click="fecharPopup()"> Cancelar </li>
          </ul>
        </div>
      </template>
      <template v-else-if="origem == 'Transferir'">
        <ul 
          lista-transferir 
          :class="{'bg' : bg}"
          v-if="!abrirAgentes && !abrirGrupos">
          <li @click="preencherAgente()"> Agente </li>
          <li @click="preencherGrupo()"> Grupo </li>
        </ul>
        <div v-if="abrirAgentes" grupos-agentes>
          <vSelect
          :options="arrAgentes"
          label="label"
          @input="enviaAgente"
          :reduce="arrAgentes => arrAgentes.cod"
          >
            <div slot="no-options">Nenhuma correspondencia encontrada</div>
          </vSelect>
        </div>
        <div v-if="abrirGrupos" grupos-transferir>
          <vSelect
            :options="arrGrupos"
            label="label"
            @input="enviaGrupo"
            :reduce="arrGrupos => arrGrupos.cod"
            >
            <div slot="no-options">Nenhuma correspondencia encontrada</div>
          </vSelect>
        </div>
      </template>
      <template v-else-if="origem == 'Encerrar'">
        <ul 
          :class="{'bg' : bg}"
          lista-retornar>
          <li id="encerrarAtendimento" 
            tabindex="-1"
            @keydown="encerrar(), fecharPopup()"
            @click="encerrar(), fecharPopup()">
            Confirmar
          </li>
          <li @click="fecharPopup()"> Cancelar </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import axios_api from '../../services/serviceAxios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { liberarEncerrar } from '../../services/atendimentos'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components:{
    vSelect,
  },
  data(){
    return{
      abrirAgentes: false,
      abrirGrupos: false,
      pessoalData: false,
      dataHora: '',
      auxBlocker: true
    }
  },
  computed: {
    ...mapGetters({
      blocker: 'getBlocker',
      abrirPopup: 'getAbrirPopup',
      titulo: 'getTitulo',
      origem: 'getOrigem',
      arrGrupos: 'getArrGrupos',
      arrAgentes: 'getArrAgentes',
      bg: 'getBgPopup'
    })
  },
  watch: {
    abrirPopup(){
      if(this.abrirPopup){
        this.alterarCoresLi()

        setTimeout(() => {
          this.focusEncerrar()
        , 100})
      }
    }
  },
  methods: {
    fecharPopup(event){
      if(event){
        if(event !== "encerrarAtendimento") {
          liberarEncerrar()
          if(event.target === document.querySelector('#popup')){       
            this.$store.dispatch('setBlocker', false)
            this.$store.dispatch('setAbrirPopup', false)
          }
        }
      }else{
        this.$store.dispatch('setBlocker', false)
        this.$store.dispatch('setAbrirPopup', false)
        liberarEncerrar()
      }
    },
    tamanhoChat(){
      const widthChat = localStorage.getItem('largura-chat')
      if(widthChat){
        if(widthChat < '400px'){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    agendarRetorno(dataHora){
      if(dataHora){
        console.log('dataHora: ', dataHora)
        this.$toasted.global.defaultSuccess({msg: 'Retorno agendado'})
      }else{
        this.$toasted.global.defaultError({msg: 'Data e hora indefinidas'})
      }
    },
    enviaGrupo(grupo){
      console.log('grupo: ', grupo)
      this.$toasted.global.sucessoTransferencia()
      this.fecharPopup()
    },
    enviaAgente(agente){
      console.log('agente: ', agente)
      this.$toasted.global.sucessoTransferencia()
      this.fecharPopup()
    },
    setData(opt){
      let data = new Date()
      let dia = data.getDate()
      let mes = data.getMonth() + 1
      let ano = data.getFullYear()
      let hora = data.getHours()
      let minutos = data.getMinutes()

      if(dia < 10){
        dia = '0'+dia
      }
      if(mes < 10){
        mes = '0'+mes
      }
      if(hora < 10){
        hora = '0'+hora
      }
      if(minutos < 10){
        minutos = '0'+minutos
      }

      if(opt == 'minimo'){
        let agora = ano + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos + ':00'
        return agora
      }else{
        mes = parseInt(mes)
        mes += 1

        if(mes < 10){
          mes = '0'+mes
        }

        let agora = ano + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos + ':00'
        return agora
      }
    },
    encerrar(){
      this.$root.$emit('encerrarAtendimento')
      // Limpando pilha de eventos afim de evitar que a função de encerrar seja chamada mais de uma vez
      this.fecharPopup('encerrarAtendimento')
    },
    preencherAgente(){
      if(this.arrAgentes.length){
        this.abrirAgentes = true
      }else{
        this.$toasted.global.emConstrucao({msg: 'Nao existem agentes disponiveis'})
      }
    },
    preencherGrupo(){
      if(this.arrGrupos.length){
        this.abrirGrupos = true
      }else{
        this.$toasted.global.emConstrucao({msg: 'Nao existem agentes disponiveis'})
      }
    },
    alterarCoresLi(){
      const root = document.documentElement
      root.style.setProperty('--bg-alternativo', this.bg)
    },
    focusEncerrar(){
      const btnEncerrar = document.querySelector('#encerrarAtendimento')
      if(btnEncerrar){
        btnEncerrar.focus()
      }
    }
  }
}
</script>
