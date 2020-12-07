<template>
  <div class="ligacao-container">
    <!-- <div class="botoes-ligacao-container">
      <div class="btn-ligacao-superior btn-ligacao" v-text="dicionario.btn_ligacao_pausar"></div>
      <div class="btn-ligacao-superior btn-ligacao" v-text="dicionario.btn_ligacao_desligar"></div>
    </div> -->
    <div class="btn-ligacao-encerrar">
      <div class="btn-ligacao-inferior btn-ligacao" @click="finalizarAtendimentoNaApi" v-text="dicionario.btn_ligacao_encerrar"></div>
    </div>
  </div>
</template>

<script>

import { executandoEncerrar, liberarEncerrar, removerCliente } from '@/services/atendimentos'
import axios_api from "@/services/serviceAxios"

import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters({
      dicionario: "getDicionario",
      atendimentoAtivo: "getAtendimentoAtivo",
      reqTeste: "getReqTeste"
    })
  },
  methods: {
    async finalizarAtendimentoNaApi() {
      executandoEncerrar()

      let data = { "token_cliente": this.atendimentoAtivo.token_cliente, "tipo": this.atendimentoAtivo.tipo }

      await axios_api.delete(`end-atendimento?${this.reqTeste}`, {data: {...data}})
        .then(response => {
          if(response.data.st_ret == 'OK'){
            this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_sucesso_encerramento})

            this.ativarRemoverCliente()

          }
        })
        .catch(error => {
          console.log('Error end atd: ', error)
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_finalizar})
        })

      liberarEncerrar()
    },
    ativarRemoverCliente(){
      removerCliente()
    }
  }
}
</script>
