<template>
  <div id="gerenciador-container" :class="{'d-none': !reqTeste, 'aguardando' : reqEmAndamento, 'em-atendimento' : statusAtd == 'em-atendimento', 'parado' : statusAtd == 'parado'}" v-if="gerenciador && gerenciador.length ? true : false">
    <div class="gerenciador-btn" @click="mudarEstadoAtendimento()">
      <div v-show="statusAtd == 'em-atendimento'" title="Em atendimento">
        <i class="fas fa-pause"></i>
      </div>
      <div v-show="statusAtd == 'parado'" title="Parado">
        <i class="fas fa-play"></i>
      </div>
    </div>
    <div class="gerenciador-lista" ref="gerenciador-lista" :class="{'existe-ativo' : ativo == true}">
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
      statusAtd: "getStatusAtd",
      todosAtendimentos: "getTodosAtendimentos",
      semIframe: "getSemIframe",
      minhaAgenda: "getAgenda"
    })
  },
  data(){
    return{
      qtdAgenda: 0,
      qtdAguardando: 0,
      reqEmAndamento: false,
      contador: 0
    }
  },
  mounted(){
    window.addEventListener("message", this.listenerPostMessage, false);

    this.$root.$on("mudarEstadoAtd", () => {
      this.mudarEstadoAtendimento()
    })
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
      if(this.reqEmAndamento){
        return
      }

      this.reqEmAndamento = true
      this.preencherDiv()

      axios_api.put(`start-and-stop?${this.reqTeste}`)
        .then(response => {
          if(response.data.st_ret == "OK"){
            if(this.statusAtd == "em-atendimento"){
              this.$store.dispatch("setStatusAtd", "parado")
              
              let arrTodosAtds = Object.values(this.todosAtendimentos)
              if(arrTodosAtds.length == 0){
                this.$store.dispatch("setBlocker", true)
                this.$store.dispatch("setOrigemBlocker", "atd-parado")
              }else{
                this.$store.dispatch("setBlocker", false)
              }

            }else{
              this.$store.dispatch("setStatusAtd", "em-atendimento")

              this.$store.dispatch("setBlocker", false)
            }

            this.reqEmAndamento = false

            this.preencherDiv()
          }
        })
        .catch(error => {

          this.reqEmAndamento = false
          
          this.$store.dispatch("setOrigemBlocker", "atd-parado")

          let arrTodosAtds = Object.values(this.todosAtendimentos)
          if(arrTodosAtds.length == 0){
            this.$store.dispatch("setBlocker", true)
            this.$store.dispatch("setOrigemBlocker", "atd-parado")
          }else{
            this.$store.dispatch("setBlocker", false)
          }

          console.log("error start/stop: ", error)
        })
    },
    abrirAtivarCtt(){
      if(this.iframeCttAtivo){
        this.$store.dispatch("setIframeCttAtivo", false)
      }else{
        if(this.semIframe){
          this.$store.dispatch("setSemIframe", false)
        }

        this.$store.dispatch("setIframeCttAtivo", true)
      }
    },
    preencherDiv(){

      if(!this.$refs["gerenciador-lista"]){
        this.contador++
        if(this.contador < 10){
          setTimeout(() => {
            this.preencherDiv()
          }, 500)
        }

        return
      }

      this.contador = 0

      const gerenciadorV8 = parent.document.querySelector("#TelaOpeGer")
      if(gerenciadorV8){
        const gerenciador = document.querySelector("#gerenciador-container")

        const gerenciadorListaV8 = parent.document.querySelector("#TelaOpeGer .gerenciador-lista")
        const iconeGerenciador = parent.document.querySelector("#icone-gerenciador")

        if(gerenciadorListaV8){
          gerenciadorListaV8.innerHTML = this.$refs["gerenciador-lista"].innerHTML
        }

        if(iconeGerenciador){
          if(this.reqEmAndamento){
            gerenciadorV8.classList.add("aguardando")
            return
          }

          if(gerenciadorV8.classList.contains("aguardando")){
            gerenciadorV8.classList.remove("aguardando")
          }

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
    minhaAgenda(){
      this.qtdAgenda = this.minhaAgenda.length
    },
    gerenciador(){
      if(this.gerenciador){
        this.preencherDiv()

        this.gerenciador.map((i) => {
          if(i.cod == 3){
            if(i.count != this.qtdAguardando){
              // Aguardando
              axios_api.get(`get-aguardando?${this.reqTeste}`)
              .then(response => {
                const arrAguardando = response.data.ret
                if(arrAguardando && arrAguardando.length){
                  this.$store.dispatch("setAguardando", arrAguardando)
                }else{
                  this.$store.dispatch("setAguardando", [])
                }

                this.qtdAguardando = i.count
              })
              .catch(error => {
                console.log('error get aguardando: ', error)
              })
            }
          }

          if(i.cod == 2){
            if(i.count != this.qtdAgenda){
              
              axios_api.get(`get-agenda?${this.reqTeste}`)
                .then(response => {
                  const arrAgenda = response.data.ret || []

                  this.$store.dispatch("setAgenda", arrAgenda)
                  this.qtdAgenda = i.count
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
