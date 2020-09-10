<template>
  <div class="popup-container">
    <ul 
      lista-retornar
      class="popup-lista" 
      :class="{'tres-mais' : tamanhoChat(), 'bg' : bg}"
      v-if="!pessoalData">
      <li @click="$toasted.global.emConstrucao(), fecharPopup()"> Todos </li>
      <li @click="$toasted.global.emConstrucao(), fecharPopup()"> Pessoal </li>
      <li @click="pessoalData = true"> Pessoal/Data </li>
    </ul>
    <div v-if="pessoalData" agendar-retorno>
      <input type="datetime-local" :min="setData('minimo')" :max="setData('maximo')" v-model="dataHora" />
      <ul 
        class="btns-confirmacao-container"
        :class="{'bg' : bg}">
        <li class="btn-confirmar" @click="agendarRetorno(dataHora), fecharPopup()"> Confirmar </li>
        <li class="btn-cancelar" @click="fecharPopup()"> Cancelar </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data(){
    return{
      pessoalData: false,
      dataHora: ''
    }
  },
  computed: {
    ...mapGetters({
      bg: 'getBgPopup'
    })
  },
  methods: {
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
    agendarRetorno(dataHora){
      if(dataHora){
        console.log('dataHora: ', dataHora)
        this.$toasted.global.defaultSuccess({msg: 'Retorno agendado'})
      }else{
        this.$toasted.global.defaultError({msg: 'Data e hora indefinidas'})
      }
    },
    fecharPopup(event){
      this.$store.dispatch('setBlocker', false)
      this.$store.dispatch('setAbrirPopup', false)
      this.pessoalData = false
      this.dataHora = ""
    }
  }
}
</script>

<style>

</style>