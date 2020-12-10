<template>
  <span class="ultima-msg" v-html="this.ultimaMsg"></span>
</template>

<script>

import { mapGetters } from "vuex"

export default {
  props: ["mensagens"],
  data(){
    return{
      msg: ""
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: "getAtendimentoAtivo"
    }),
    ultimaMsg: {
      get(){
        if(this.mensagens){
          let chaves = Object.keys(this.mensagens)
          if(!chaves.length){
            return
          }
          let ultimaChave = chaves[chaves.length - 1]
          if(!this.mensagens[ultimaChave]){
            return
          }
          let arrMsg = this.mensagens[ultimaChave].msg
          if(!arrMsg){
            return
          }
          if(arrMsg.length){
            this.verificarSeAUltimaMensagemEstaNoArrayDeMensagens(arrMsg[arrMsg.length - 1])
            if(arrMsg[arrMsg.length - 1].anexos || arrMsg[arrMsg.length - 1].nomeArquivo){
              if(arrMsg[arrMsg.length - 1].nomeArquivo){
                return this.msg = arrMsg[arrMsg.length - 1].nomeArquivo
              }else{
                return this.msg = arrMsg[arrMsg.length - 1].anexos.name
              }
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
  },
  methods: {
    verificarSeAUltimaMensagemEstaNoArrayDeMensagens(objUltimaMsg){

      const chavesArrMsg = Object.keys(this.atendimentoAtivo.arrMsg)
      const indexUltimaChave = chavesArrMsg[chavesArrMsg.length - 1]
      let arrMsg = this.atendimentoAtivo.arrMsg[indexUltimaChave].msg
      if(!arrMsg){
        return
      }

      let mensagemJaExiste = false

      arrMsg.map(objMsg => {
        if(objMsg.seq == objUltimaMsg.seq){
          mensagemJaExiste = true
        }
      })

      console.log(mensagemJaExiste)
      if(!mensagemJaExiste){
        console.log("Mensagem nao estava inserida no array")
        this.$root.$emit('atualizar-mensagem', objUltimaMsg)
      }

    }
  }
}
</script>

<style>

</style>
