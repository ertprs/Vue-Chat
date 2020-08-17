<template>
  <div id="popup" popup v-on:click="fecharPopup($event)">
    <div>
      <h2>{{ titulo }}</h2>
      <template v-if="titulo == 'Retornar'">
        <ul lista-retornar v-if="!pessoalData">
          <li v-for="(opt, i) in arrOptRetorno" :key="i"
          v-on:click="opt.funcao">
            {{ opt.descricao }}
          </li>
        </ul>
        <div v-if="pessoalData" agendar-retorno>
          <input type="datetime-local" :min="setData('minimo')" :max="setData('maximo')" v-model="dataHora" />
        </div>
      </template>
      <template v-else-if="titulo == 'Transferir'">
        <ul lista-transferir>
          <li v-for="(opt, i) in arrOptTransferir" :key="i"
          v-on:click="opt.funcao">
            {{ opt.descricao }}
          </li>
        </ul>
        <div v-if="arrGrupos.length" grupos-transferir>
          <vSelect
          :options="arrGrupos"
          label="label"
          @input="enviaGrupo"
          :reduce="arrGrupos => arrGrupos.grupo"
          >
          <!-- :value="arrGrupos[0].label" -->
          </vSelect>
        </div>
        <div v-if="arrAgentes.length" grupos-agentes>
          <vSelect
          :options="arrAgentes"
          label="login"

          @input="enviaAgente"
          :reduce="arrAgentes => arrAgentes.login"
          >
          <!-- :value="arrAgentes[0].login" -->
          </vSelect>
        </div>
      </template>
      <template v-else-if="titulo == 'Encerrar'">
        <ul lista-retornar>
          <li v-on:click="encerrar()"> Confirmar </li>
          <li v-on:click="fecharPopup()"> Cancelar </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import axios_api from '../../services/axios_api'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  components:{
    vSelect,
  },
  props: ['titulo', 'origem'],
  data(){
    return{
      arrOptRetorno: [],
      arrOptTransferir: [],
      arrGrupos: [],
      arrAgentes: [],
      pessoalData: false,
      dataHora: ''
    }
  },
  mounted(){
    this.preencherArrOpt(this.titulo)
  },
  watch: {
    dataHora(){
      let data = this.dataHora.slice(0, 10)
      let hora = this.dataHora.slice(11, this.dataHora.length)

      this.fecharPopup()
      if(!document.querySelector('.toasted.toasted-primary.success')){
        this.$toasted.global.defaultSuccess({msg: 'Retorno Agendado'})
      }
    }
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
    getGrupos(){
      let url = this.$store.getters.getURL

      axios.get(url+'get-groups')
      .then(response => {
        this.arrGrupos = response.data
        document.querySelector('[lista-transferir]').remove()
      })
      .catch(error => {
        console.log('Erro get grupos: ', error)
      })
    },
    enviaGrupo(grupo){
      axios_api.put('transfer',grupo).then(response => {
        this.fecharPopup()
        console.log('Sucesso enviar grupo: ', response)
        if(!document.querySelector('.toasted.toasted-primary.success')){
          this.$toasted.global.sucessoTransferencia()
        }
      })
      .catch(error => {
        console.log('Erro ao enviar o grupo: : ', error)
        if(!document.querySelector('.toasted.toasted-primary.error')){
          this.$toasted.global.defaultError('Erro na transferencia')
        }
      })
    },
    getAgente(){
      let url = this.$store.getters.getURL

      axios.get(url+'get-agente')
      .then(response => {
        console.log('Sucesso get agente: ', response)
        this.arrAgentes = response.data
        document.querySelector('[lista-transferir]').remove()
      })
      .catch(error => {
        console.log('Erro get agente: ', error)
        if(!document.querySelector('.toasted.toasted-primary.error')){
          this.$toasted.global.defaultError('Erro na transferencia')
        }
      })
    },
    enviaAgente(agente){
      axios_api.put('transfer', agente)
      .then(response => {
        this.fecharPopup()
        console.log('Sucesso enviar agente: ', response)
        if(!document.querySelector('.toasted.toasted-primary.success')){
          this.$toasted.global.sucessoTransferencia()
        }
      })
      .catch(error => {
        console.log('Erro ao enviar o agente: : ', error)
        if(!document.querySelector('.toasted.toasted-primary.error')){
          this.$toasted.global.defaultError('Erro na transferencia')
        }
      })
    },
    preencherArrOpt(tipo){
      let url = this.$store.getters.getURL

      let arrAux
      if(tipo == 'Retornar'){
        arrAux = ["Todos", "Pessoal", "Pessoal/Data"]
        for(let i = 0; i < arrAux.length; i++){
          this.arrOptRetorno.push({
            descricao: arrAux[i],
            funcao: () => {
              if(arrAux[i] == arrAux[2]){
                this.pessoalData = true
              }else{
                this.fecharPopup()
                if(!document.querySelector('.toasted.toasted-primary.success')){
                  this.$toasted.global.defaultSuccess({msg: 'Retorno realizado'})
                }
              }
            }
          })
        }
      }else if(tipo == 'Transferir'){
        arrAux = ["Agente", "Grupo"]
        for(let i = 0; i < arrAux.length; i++){
          this.arrOptTransferir.push({
            descricao: arrAux[i],
            funcao: () => {
              if(arrAux[i] == arrAux[0]){
                this.getAgente()
              }else if(arrAux[i] == arrAux[1]){
                this.getGrupos()
              }
              data = {"id_schedule": "5516987987955", "id_attedant":"re028771"}
              axios_api.put('transfer', data)
              .then(response => {
                console.log('sucesso transferencia: ', response)
              })
              .catch(error => {
                console.log('erro transferencia: ', error)
              })
            }
          })
        }
      }
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
      this.fecharPopup()
    }
  }
}
</script>

<style>

</style>