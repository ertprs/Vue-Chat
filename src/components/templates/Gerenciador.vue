<template>
  <div id="gerenciador-container" :class="{'em-atendimento' : estadoAtendimento == 'em-atendimento', 'parado' : estadoAtendimento == 'parado', 'existe-ativo' : ativo}" v-if="gerenciador && gerenciador.length ? true : false">
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
    <div class="gerenciador-btn" title="Adicionar novo cliente" @click="abrirAtivarCtt()" v-if="!ativo">
        <i class="fas fa-user-plus"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import axios_api from '../../services/serviceAxios';

export default {
  computed: {
    ...mapGetters({
      gerenciador: "getGerenciador",
      iframeCttAtivo: "getIframeCttAtivo",
      ativo: "getAtivo"
    })
  },
  data(){
    return{
      estadoAtendimento: "em-atendimento",
      qtdAgenda: 0
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

        if(this.ativo){
          gerenciadorListaV8.classList.add("existe-ativo")
          const btnChamarCliente = parent.document.querySelector(".gerenciador-btn.icone-mais")
          if(btnChamarCliente){
            btnChamarCliente.classList.remove("d-none")
          }
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

        this.gerenciador.map((i) => {
          if(i.cod == 2){
            if(i.count !== this.qtdAgenda && i.count !== 0){
              axios_api.get("get-agenda")
                .then(response => {
                  const arrAgenda = response.data.ret
                  if(arrAgenda && arrAgenda.length){
                    this.$store.dispatch("setAgenda", arrAgenda)
                    this.qtdAgenda = i.count
                  }
                })
                .catch(error => {
                  console.log("Error get agenda: ", error)
                })
            }
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
