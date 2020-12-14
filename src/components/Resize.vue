<template>
  <div class="resizable" draggable="true" @mousedown="setBlocker(true)" @dragstart="dragStart" @drag="resize(origem, $event)" @dragend="setBlocker(false)"> </div>
</template>

<script>
export default {
  props: ["origem"],
  data(){
    return {
      sizes: {
        min: "",
        max: ""
      }
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
          div.style.width = widthNovo + "px"
          localStorage.setItem(setter, `${widthNovo}px`)
        }
      }
    },
    setBlocker(condicao){
      this.$store.dispatch("setBlocker", condicao)
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

        this.sizes.min = min
        this.sizes.max = max
      }
    },
    verificarLocalStorage(){
      const statusFechado = localStorage.getItem("contatos-fechado")
      if(statusFechado === "true"){
        this.$root.$emit("adicionar-fechado")
      }

      const widthChat = localStorage.getItem("width-chat")
      if(widthChat){
        this.alterarWidth("chat", widthChat)
      }

      const widthContatos = localStorage.getItem("width-contatos")
      if(widthContatos){
        this.alterarWidth("todos-contatos", widthContatos)
      }
    },
    alterarWidth(id, widthNovo){
      const elem = document.querySelector(`#${id}`)
      elem.style.width = widthNovo
    }
  },
  mounted(){
    this.verificarLocalStorage()

    this.calcMinMax()
  }
}
</script>

<style>

</style>
