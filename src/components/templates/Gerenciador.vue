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
  mounted(){
    window.addEventListener("message", this.listenerPostMessage, false);
  },
  methods: {
    listenerPostMessage(event){

      let baseUrl = ''
      if(window.location.hostname == 'localhost'){
        baseUrl = 'https://linux03'
      }else{
        baseUrl = 'https://'+window.location.hostname
      }

      if(event.origin == baseUrl){
        if(event.data.gerenciador){
          this.abrirAtivarCtt()
        }
      }  
    },
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

        const gerenciadorLista = document.querySelector(".gerenciador-lista")
        const gerenciadorListaV8 = parent.document.querySelector("#TelaOpeGer .gerenciador-lista")

        if(gerenciadorLista){
          gerenciadorListaV8.innerHTML = gerenciadorLista.innerHTML
        }
        
        setTimeout(() => {
          gerenciadorV8.classList.remove('d-none')
          if(gerenciador){
            gerenciador.classList.add('d-none')
          }
        }, 300)
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