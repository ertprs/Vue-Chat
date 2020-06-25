<template>
  <div id="popup" popup>
    <div>
      <h2>{{ titulo }}</h2>
      <template v-if="titulo == 'Retornar'">
        <ul lista-retornar>
          <li v-for="(opt, i) in arrOptRetorno" :key="i"
          v-on:click="opt.funcao">
            {{ opt.descricao }}
          </li>
        </ul>
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

          </vSelect> 
          <!-- <select name="grupos">
            <option v-for="(grupo, indice) in arrGrupos" :key="indice"
            :value="grupo.grupo">
              {{ grupo.label }}
            </option>
          </select> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
  components:{
    vSelect
  },
  props: ['titulo'],
  data(){
    return{
      arrOptRetorno: [],
      arrOptTransferir: [],
      arrGrupos: [],
      agente: ''
    }
  },
  mounted(){
    this.preencherArrOpt(this.titulo)
  },
  methods: {
    fecharPopup(){
      document.querySelector('[blocker]').click()
    },
    enviaGrupo(grupo){
      let url = this.$store.getters.getURL
      axios.put(url+'transfer', grupo)
      .then(response => {
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
        this.fecharPopup()
        console.log('Sucesso get agente: ', response)
        if(!document.querySelector('.toasted.toasted-primary.success')){
          this.$toasted.global.sucessoTransferencia()
        }
      })
      .catch(error => {
        console.log('Erro get agente: ', error)
        if(!document.querySelector('.toasted.toasted-primary.error')){
          this.$toasted.global.defaultError('Erro na transferencia')
        }
      })
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
    preencherArrOpt(tipo){
      let url = this.$store.getters.getURL

      let arrAux
      if(tipo == 'Retornar'){
        arrAux = ["Todos", "Pessoal", "Pessoal/Data"]
        for(let i = 0; i < arrAux.length; i++){
          this.arrOptRetorno.push({
            descricao: arrAux[i],
            funcao: () => {
              this.fecharPopup()
              if(!document.querySelector('.toasted.toasted-primary.success')){
                this.$toasted.global.defaultSuccess({msg: 'Retorno realizado'})
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

              axios({
                method: 'put',
                url: url+'transfer',
                data: {"id_schedule": "5516987987955", "id_attedant":"re028771"}
              })
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
    }
  }
}
</script>

<style>

</style>