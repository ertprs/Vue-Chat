<template>
  <div
    class="resizable"
    :class="{bg}"
    draggable="true"
    @mousedown="setBlocker(true)"
    @mouseup="setBlocker(false, 'verificando')"
    @dragstart="dragStart"
    @drag="resize(origem, $event)"
    @dragend="setBlocker(false)">
    </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: ["origem"],
  computed: {
    ...mapGetters({
      semIframe: "getSemIframe"
     })
  },
  data(){
    return {
      sizes: {
        min: "",
        max: ""
      },
      maxContatos: "",
      bg: false,
      widthAtual: "",
      widthContatosLimite: 100
    }
  },
  methods: {
    dragStart(e){
      e.dataTransfer.setDragImage(new Image, 0, 0)
    },
    resize(id, e){
      if(this.origem == "chat" && this.semIframe){
        return
      }

      const div = document.querySelector(`#${id}`)
      const resizer = document.querySelector(`#${id} > .resizable`)

      if(e.pageX != 0){
        let widthNovo = e.pageX - div.getBoundingClientRect().left
        widthNovo = widthNovo.toFixed(2)

        if(widthNovo >= this.sizes.min && widthNovo <= this.sizes.max){
          if(localStorage.getItem("contatos-fechado") === "true"){
            if(widthNovo > this.widthContatosLimite){
              this.$root.$emit("remover-fechado")
              localStorage.setItem("contatos-fechado", false)
            }
          }
          if(widthNovo < this.widthContatosLimite){
            if(localStorage.getItem("contatos-fechado") !== "true"){
              this.$root.$emit("adicionar-fechado")
              localStorage.setItem("contatos-fechado", true)
            }
          }
          div.style.width = widthNovo + "px"

          this.widthAtual = Math.round(widthNovo)
        }
      }
    },
    setBlocker(condicao, verificacao){
      if(verificacao){
        this.bg = false
        return
      }

      this.$store.dispatch("setBlocker", condicao)
      if(condicao == true){
        this.bg = true
      }else{
        this.bg = false

        const setter = this.origem == "chat" ? "width-chat" : "width-contatos"
        if(this.widthAtual >= this.widthContatosLimite){
          localStorage.setItem(setter, `${this.widthAtual}px`)
        }
      }
    },
    calcMinMax(){
      let maxDocumentWidth = parent.document.firstElementChild.offsetWidth

      let min = ""
      let max = ""

      if(this.origem === "chat"){
        min = maxDocumentWidth * .3
        max = maxDocumentWidth * .48

        this.sizes.min = min
        this.sizes.max = max
      }else if(this.origem === "todos-contatos"){
        min = 60
        max = maxDocumentWidth * 0.20
        this.maxContatos = max

        this.sizes.min = min
        this.sizes.max = max
      }
    },
    verificarLocalStorage(){
      if(localStorage.getItem("largura-contatos")){
        localStorage.removeItem("largura-contatos")
      }

      if(localStorage.getItem("largura-chat")){
        localStorage.removeItem("largura-chat")
      }

      const statusFechado = localStorage.getItem("contatos-fechado")
      if(statusFechado === "true"){
        this.$root.$emit("adicionar-fechado")
        localStorage.setItem("width-contatos", "60px")
      }

      const widthChat = localStorage.getItem("width-chat")
      if(widthChat){
        this.alterarWidth("chat", widthChat)
      }

      const widthContatos = localStorage.getItem("width-contatos")
      if(widthContatos){
        if(statusFechado !== "true"){
          this.alterarWidth("todos-contatos", widthContatos)
        }
      }
    },
    alterarWidth(id, widthNovo){
      const elem = document.querySelector(`#${id}`)
      elem.style.width = widthNovo
    },
    toggleContatos(fechado){
      if(this.origem !== "todos-contatos") { return }

      const containerContatos = document.querySelector("#todos-contatos")
      if(!fechado){
        const widthContatos = localStorage.getItem("width-contatos")
        if(widthContatos){
          if(widthContatos !== "60px"){
            containerContatos.style.width = widthContatos
            localStorage.setItem("width-contatos", widthContatos)
            return
          }
        }
        containerContatos.style.width = `${this.maxContatos}px`
        localStorage.setItem("width-contatos", `${this.maxContatos}px`)
      }else{
        containerContatos.style.width = "60px"
      }
    }
  },
  mounted(){
    this.verificarLocalStorage()

    this.calcMinMax()

    this.$root.$on("toggle-contatos", (fechado) => {
      this.toggleContatos(fechado)
    })
  }
}
</script>

<style>

</style>
