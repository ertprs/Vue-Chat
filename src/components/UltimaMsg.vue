<template>
  <span class="ultima-msg" v-html="this.ultimaMsg"></span>
</template>

<script>
export default {
  props: ["mensagens"],
  data(){
    return{
      msg: ""
    }
  },
  computed: {
    ultimaMsg: {
      get(){
        if(this.mensagens){
          let chaves = Object.keys(this.mensagens)
          let ultimaChave = chaves[chaves.length - 1]
          let arrMsg = this.mensagens[ultimaChave].msg
  
          if(arrMsg.length){
            if(arrMsg[arrMsg.length - 1].anexos){
              return this.msg = arrMsg[arrMsg.length - 1].anexos.name
            }else{
              return this.msg = arrMsg[arrMsg.length - 1].msg
            }
          }
        }
      },
      set(msg){
        this.ultimaMsg = msg
      }
    }
  }
}
</script>

<style>

</style>