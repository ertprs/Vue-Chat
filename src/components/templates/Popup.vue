<template>
  <div id="popup" popup @click="fecharPopup($event)">
    <div>
      <h2>{{ titulo }}</h2>
      <template v-if="origem == 'Retornar'">
        <ul lista-retornar :class="{'tres-mais' : tamanhoChat()}" v-if="!pessoalData">
          <li @click="$toasted.global.emConstrucao(), fecharPopup()"> Todos </li>
          <li @click="$toasted.global.emConstrucao(), fecharPopup()"> Pessoal </li>
          <li @click="pessoalData = true"> Pessoal/Data </li>
        </ul>
        <div v-if="pessoalData" agendar-retorno>
          <input type="datetime-local" :min="setData('minimo')" :max="setData('maximo')" v-model="dataHora" />
        </div>
      </template>
      <template v-else-if="origem == 'Transferir'">
        <ul lista-transferir v-if="!abrirAgentes && !abrirGrupos">
          <li @click="preencherAgente()"> Agente </li>
          <li @click="preencherGrupo()"> Grupo </li>
        </ul>
        <div v-if="abrirAgentes" grupos-agentes>
          <vSelect
          :options="arrAgentes"
          label="login"
          @input="enviaAgente"
          :reduce="arrAgentes => arrAgentes.login"
          >
          <!-- :value="arrAgentes[0].login" -->
          </vSelect>
        </div>
        <div v-if="abrirGrupos" grupos-transferir>
          <select name="select-grupos-transferir">
            <option value="" v-for="(grupo, indice) in arrGrupos" :key="indice">
              {{ grupo }}
            </option>
          </select>
          <!-- <vSelect
          :options="arrGrupos"
          label="label"
          @input="enviaGrupo"
          :reduce="arrGrupos => arrGrupos.grupo"
          > -->
          <!-- :value="arrGrupos[0].label" -->
          </vSelect>
        </div>
      </template>
      <template v-else-if="origem == 'Encerrar'">
        <ul lista-retornar>
          <li @click="encerrar()"> Confirmar </li>
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

export default {
  components:{
    vSelect,
  },
  props: ['titulo', 'origem', 'arrGrupos', 'arrAgentes'],
  data(){
    return{
      abrirAgentes: false,
      abrirGrupos: false,
      pessoalData: false,
      dataHora: ''
    }
  },
  watch: {
    dataHora(){
      let data = this.dataHora.slice(0, 10)
      let hora = this.dataHora.slice(11, this.dataHora.length)

      this.fecharPopup()
      if(!document.querySelector('.toasted.toasted-primary.success')){
        this.$toasted.global.defaultSuccess({msg: 'Retorno Agendado'})
      }
    },
  },
  methods: {
    fecharPopup(event){
      if(event){
        if(event.target === document.querySelector('#popup')){
          this.$store.dispatch('setBlocker', false)
        }
      }else{
        this.$store.dispatch('setBlocker', false)
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
    enviaGrupo(grupo){
      // axios_api.put('transfer',grupo).then(response => {
      //   this.fecharPopup()
      //   console.log('Sucesso enviar grupo: ', response)
      //   if(!document.querySelector('.toasted.toasted-primary.success')){
      //     this.$toasted.global.sucessoTransferencia()
      //   }
      // })
      // .catch(error => {
      //   console.log('Erro ao enviar o grupo: : ', error)
      //   if(!document.querySelector('.toasted.toasted-primary.error')){
      //     this.$toasted.global.defaultError('Erro na transferencia')
      //   }
      // })
    },
    enviaAgente(agente){
      // axios_api.put('transfer', agente)
      // .then(response => {
      //   this.fecharPopup()
      //   console.log('Sucesso enviar agente: ', response)
      //   if(!document.querySelector('.toasted.toasted-primary.success')){
      //     this.$toasted.global.sucessoTransferencia()
      //   }
      // })
      // .catch(error => {
      //   console.log('Erro ao enviar o agente: : ', error)
      //   if(!document.querySelector('.toasted.toasted-primary.error')){
      //     this.$toasted.global.defaultError('Erro na transferencia')
      //   }
      // })
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
      this.$root.$off('encerrarAtendimento')
      this.fecharPopup()
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
    }
  }
}
</script>
