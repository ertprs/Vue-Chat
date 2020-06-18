<template>
  <div id="popup">
    <h2>{{ titulo }}</h2>
    <template v-if="titulo == 'Retornar'">
      <ul>
        <li v-for="(opt, i) in arrOptRetorno" :key="i"
        v-on:click="opt.funcao">
          {{ opt.descricao }}
        </li>
      </ul>
    </template>
    <template v-else-if="titulo == 'Transferir'">
      <ul>
        <li v-for="(opt, i) in arrOptTransferir" :key="i"
        v-on:click="opt.funcao">
          {{ opt.descricao }}
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['titulo'],
  data(){
    return{
      popupAtivo: true,
      arrOptRetorno: [],
      arrOptTransferir: []
    }
  },
  mounted(){
    this.preencherArrOpt(this.titulo)
  },
  methods: {
    preencherArrOpt(tipo){
      let url = this.$store.getters.getURL

      let arrAux
      if(tipo == 'Retornar'){
        arrAux = ["Todos", "Pessoal", "Pessoal/Data"]
        for(let i = 0; i < arrAux.length; i++){
          this.arrOptRetorno.push({
            descricao: arrAux[i],
            funcao: function(){
              console.log('bbb') 
            }
          })
        }
      }else if(tipo == 'Transferir'){
        arrAux = ["Agente", "Grupo"]
        for(let i = 0; i < arrAux.length; i++){
          this.arrOptTransferir.push({
            descricao: arrAux[i],
            funcao: function(){
              axios({
                method: 'put',
                url: url+'transfer',
                data: {"id_schedule": "5516987987955", "id_attedant":"re028771"}
              })
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
            }
          })
        }
      }
    },
    fecharPopup(){
      this.popupAtivo = !this.popupAtivo
    }
  }
}
</script>

<style>

</style>