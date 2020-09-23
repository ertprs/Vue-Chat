<template>
  <div class="popup-container">
    <ul
      lista-transferir
      class="popup-lista"
      :class="{'bg' : bg}"
      v-if="!abrirAgentes && !abrirGrupos">
      <li @click="preencherAgente()"> Agente </li>
      <li @click="preencherGrupo()"> Grupo </li>
    </ul>
    <div
      grupos-agentes
      v-if="abrirAgentes"
      class="popup-container-tela-2">
      <vSelect
      :options="arrAgentes"
      label="label"
      v-model="agente"
      :reduce="arrAgentes => arrAgentes.cod"
      >
        <div slot="no-options">Nenhuma correspondência encontrada</div>
      </vSelect>
      <ul
        class="btns-confirmacao-container"
        :class="{'bg' : bg}">
        <li class="btn-confirmar" @click="transferir('agente', agente)"> Confirmar </li>
        <li class="btn-cancelar" @click="fecharPopup()"> Cancelar </li>
      </ul>
    </div>
    <div
      grupos-transferir
      v-if="abrirGrupos"
      class="popup-container-tela-2">
      <vSelect
        :options="arrGrupos"
        label="label"
        v-model="grupo"
        :reduce="arrGrupos => arrGrupos.cod"
        >
        <div slot="no-options">Nenhuma correspondência encontrada</div>
      </vSelect>
      <ul
        class="btns-confirmacao-container"
        :class="{'bg' : bg}">
        <li class="btn-confirmar" @click="transferir('grupo', grupo)"> Confirmar </li>
        <li class="btn-cancelar" @click="fecharPopup()"> Cancelar </li>
      </ul>
    </div>
  </div>
</template>

<script>

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { mapGetters } from 'vuex'

import axios_api from "../../services/serviceAxios"

export default {
  data(){
    return{
      abrirAgentes: false,
      abrirGrupos: false,
      agente: '',
      grupo: ''
    }
  },
  components: {
    vSelect
  },
  methods: {
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
    transferir(tipo, param){
      let dados = {
        token_cliente: this.atendimentoAtivo.token_cliente,
        transfer_to: param
      }

      switch(tipo){
        case 'grupo':
          dados.destino = "GRUPO"
        break;
        case 'agente':
          dados.destino = "AGENTE"
        break;
        default:
        break;
      }

      axios_api.put("transfer", dados)
        .then(response => {
          if(response.status == 200){
            console.log('Sucesso: ', response)
            this.$toasted.global.sucessoTransferencia()
          }
        })
        .catch(error => {
          this.$toasted.global.defaultError({msg: "Nao foi possivel realizar a transferencia"})
          console.log('Error enviar grupo: ', error)
        })

      this.fecharPopup()
    },
    fecharPopup(event){
      this.$store.dispatch('setBlocker', false)
      this.$store.dispatch('setAbrirPopup', false)
      this.abrirAgentes = false
      this.abrirGrupos = false
      this.grupo = ""
      this.agente = ""
    },
  },
  computed: {
    ...mapGetters({
      arrGrupos: 'getArrGrupos',
      arrAgentes: 'getArrAgentes',
      bg: 'getBgPopup',
      atendimentoAtivo: "getAtendimentoAtivo"
    })
  }

}
</script>

<style>

</style>