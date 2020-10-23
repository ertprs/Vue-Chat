<template>
  <div id="gerenciador-container" :class="{'d-none': !reqTeste, 'em-atendimento' : statusAtd == 'em-atendimento', 'parado' : statusAtd == 'parado'}" v-if="gerenciador && gerenciador.length ? true : false">
    <div class="gerenciador-btn" @click="mudarEstadoAtendimento()">
      <div v-show="statusAtd == 'em-atendimento'" title="Em atendimento">
        <i class="fas fa-pause"></i>
      </div>
      <div v-show="statusAtd == 'parado'" title="Parado">
        <i class="fas fa-play"></i>
      </div>
    </div>
    <div class="gerenciador-lista" :class="{'existe-ativo' : ativo == true}">
      <div v-for="(tipo, index) in gerenciador" :key="index">
        <span class="titulo">{{ tipo.texto }}</span>
        <span class="valor">{{ tipo.count }}</span>
      </div>
    </div>
    <div class="gerenciador-btn" title="Adicionar novo cliente" @click="abrirAtivarCtt()" v-if="ativo">
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
      ativo: "getAtivo",
      dominio: "getDominio",
      reqTeste: "getReqTeste",
      statusAtd: "getStatusAtd"
    })
  },
  data(){
    return{
      qtdAgenda: 0
    }
  },
  mounted(){
    window.addEventListener("message", this.listenerPostMessage, false);
  },
  methods: {
    listenerPostMessage(event){

      if(event.origin == this.dominio){
        if(event.data.ativarContato){
          this.abrirAtivarCtt()
        }
        if(event.data.toggleAtd){
          this.mudarEstadoAtendimento()
        }
      }  
    },
    mudarEstadoAtendimento(){
      axios_api.put(`start-and-stop?${this.reqTeste}`)
        .then(response => {
          if(response.data.st_ret == "OK"){
            if(this.statusAtd == "em-atendimento"){
              this.$store.dispatch("setStatusAtd", "parado")
            }else{
              this.$store.dispatch("setStatusAtd", "em-atendimento")
            }
          }
        })
        .catch(error => {
          console.log("error start/stop: ", error)
        })
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

        const iconeGerenciador = parent.document.querySelector("#icone-gerenciador")

        if(iconeGerenciador){
          if(this.statusAtd == "em-atendimento"){
            gerenciadorV8.classList.add("em-atendimento")
            gerenciadorV8.classList.remove("parado")

            iconeGerenciador.classList.remove("i-play-4")
            iconeGerenciador.classList.add("i-pause-2")
          }else{
            gerenciadorV8.classList.add("parado")
            gerenciadorV8.classList.remove("em-atendimento")

            iconeGerenciador.classList.remove("i-pause-2")
            iconeGerenciador.classList.add("i-play-4")
          }
        }


        if(this.ativo){
          gerenciadorListaV8.classList.add("existe-ativo")
          const btnChamarCliente = parent.document.querySelector(".gerenciador-btn.icone-mais")
          if(btnChamarCliente){
            btnChamarCliente.classList.remove("d-none")
          }
        }
        
        this.$nextTick(() => {
          gerenciadorV8.classList.remove('d-none')
          if(gerenciador){
            gerenciador.classList.add('d-none')
          }
        })
      }
    }
  },
  watch: {
    gerenciador(){
      if(this.gerenciador){
        this.preencherDiv()

        this.gerenciador.map((i) => {
          if(i.cod == 2){
            if(i.count != this.qtdAgenda && i.count != 0){
              axios_api.get(`get-agenda?${this.reqTeste}`)
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
