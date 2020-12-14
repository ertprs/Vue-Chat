<template>
  <div class="resizable" :class="{bg}" draggable="true" @mousedown="setBlocker(true)" @dragstart="dragStart" @drag="resize(origem, $event)" @dragend="setBlocker(false)"> </div>
</template>

<script>
export default {
  props: ["origem"],
  data(){
    return {
      sizes: {
        min: "",
        max: ""
      },
      maxContatos: "",
      bg: false
    }
  },
  methods: {
    dragStart(e){
      e.dataTransfer.setDragImage(new Image, 0, 0)
    },
    resize(id, e){
      const div = document.querySelector(`#${id}`)
      const resizer = document.querySelector(`#${id} > .resizable`)

      const setter = id == "chat" ? "width-chat" : "width-contatos"

      if(e.pageX != 0){
        let widthNovo = e.pageX - div.getBoundingClientRect().left
        widthNovo = widthNovo.toFixed(2)

        if(widthNovo >= this.sizes.min && widthNovo <= this.sizes.max){
          if(localStorage.getItem("contatos-fechado") === "true"){
            this.$root.$emit("remover-fechado")
            localStorage.setItem("contatos-fechado", false)
          }
          if(widthNovo == 60){
            this.$root.$emit("adicionar-fechado")
            localStorage.setItem("contatos-fechado", true)
          }
          div.style.width = widthNovo + "px"
          if(Math.round(widthNovo) >= 100){
            localStorage.setItem(setter, `${widthNovo}px`)
          }
        }
      }
    },
    setBlocker(condicao){
      this.$store.dispatch("setBlocker", condicao)
      if(condicao == true){
        this.bg = true
      }else{
        this.bg = false
      }
    },
    calcMinMax(){
      let maxDocumentWidth = document.firstElementChild.offsetWidth

      let min = ""
      let max = ""

      if(this.origem === "chat"){
        min = maxDocumentWidth * .3
        max = maxDocumentWidth * .4

        this.sizes.min = min
        this.sizes.max = max
      }else if(this.origem === "todos-contatos"){
        min = 60
        max = maxDocumentWidth * 0.25
        this.maxContatos = max

        this.sizes.min = min
        this.sizes.max = max
      }
    },
    verificarLocalStorage(){
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
        if(statusFechado !== "true" && widthContatos !== "60px"){
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
