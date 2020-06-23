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
    enviaGrupo(grupo){
      console.log('grupo: ', grupo)
    },
    getAgente(){
      let url = this.$store.getters.getURL

      axios.get(url+'get-agente')
      .then(response => {
        console.log('Sucesso get agente: ', response)
      })
      .catch(error => {
        console.log('Erro get agente: ', error)
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
            funcao: function(){
              console.log('ok') 
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