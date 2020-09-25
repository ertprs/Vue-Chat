<template>
  <div id="gerenciador-container" :class="{'em-atendimento' : estadoAtendimento == 'em-atendimento', 'parado' : estadoAtendimento == 'parado'}" v-if="gerenciador && gerenciador.length ? true : false">
    <div class="gerenciador-btn" @click="mudarEstadoAtendimento()">
      <div v-show="estadoAtendimento == 'em-atendimento'" title="Em atendimento">
        <i class="fas fa-pause"></i>
      </div>
      <div v-show="estadoAtendimento == 'parado'" title="Parado">
        <i class="fas fa-play"></i>
      </div>
    </div>
    <div class="gerenciador-lista">
      <div v-for="(tipo, index) in gerenciador" :key="index">
        <span class="titulo">{{ tipo.texto }}</span>
        <span class="valor">{{ tipo.count }}</span>
      </div>
    </div>
    <div class="gerenciador-btn" title="Adicionar novo cliente" @click="abrirAtivarCtt()">
        <i class="fas fa-user-plus"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters({
      gerenciador: "getGerenciador",
      iframeCttAtivo: "getIframeCttAtivo"
    })
  },
  data(){
    return{
      estadoAtendimento: "em-atendimento"
    }
  },
  methods: {
    mudarEstadoAtendimento(){
      if(this.estadoAtendimento == "em-atendimento"){
        this.estadoAtendimento = "parado"
      }else{
        this.estadoAtendimento = "em-atendimento"
      }
    },
    abrirAtivarCtt(){
      if(this.iframeCttAtivo){
        this.$store.dispatch("setIframeCttAtivo", false)
      }else{
        this.$store.dispatch("setIframeCttAtivo", true)
      }
    },
    preencherDiv(){
      const gerenciadorV8 = parent.document.querySelector("#TelaOpeGer")
      if(gerenciadorV8){
        const gerenciador = document.querySelector("#gerenciador-container")
        gerenciadorV8.innerHTML = gerenciador.innerHTML

        gerenciador.classList.add('d-none')
      }
    }
  },
  watch: {
    gerenciador(){
      if(this.gerenciador){
        this.preencherDiv()
      }
    }
  }
}
</script>

<style>

</style>