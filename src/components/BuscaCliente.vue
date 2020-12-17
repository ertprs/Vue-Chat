<template>
  <div class="container-ativar-contato" v-if="ativo && !estado">
    <input type="text" :placeholder="dicionario.placeholder_busca_cliente" @input="pesquisando" v-model="textoPesquisa" @focus="abrirLista = true" @blur="fecharLista">
    <div class="gerenciador-btn" :title="dicionario.title_btn_adicionar_cliente" @click="abrirAtivarCtt()">
      <font-awesome-icon :icon="['fas', 'user-plus']" />
    </div>
    <div v-if="abrirLista">
      <div class="container-lista-clientes">
        <div v-if="(listaClientes && (listaClientes.length)) && textoPesquisa">
          <div v-for="(cli, index) in listaClientes" :key="index" class="cliente-lista" @click="abrirAtivacao(cli)">
            <div class="cliente-lista-nome" v-if="!cli.msg_ret">
              <font-awesome-icon :icon="['fas', 'user-circle']" />
              <p v-text="cli.nome_usu"></p>
              <div v-if="cli.siglas" class="container-cliente-siglas">
                <div class="cliente-siglas" v-for="(sigla, index) in cli.siglas" :key="index">
                  <img :src="`${dominio}/callcenter/imagens/ext_top_${sigla.toLowerCase()}.png`" :alt="sigla">
                </div>
              </div>
            </div>
            <div v-else class="sem-cliente-lista">
              <p v-text="cli.msg_ret"></p>
            </div>
            <template v-if="cli.info">
              <div class="cliente-lista-info-cli">
                <div v-for="(info, index) in cli.info" :key="index">
                  <span v-if="info.label" v-text="info.label"></span>
                  <span v-if="info.value" v-text="info.value"></span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-else-if="textoPesquisa">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex"
import axios_api from "@/services/serviceAxios"

export default {
  props: ["estado"],
  data(){
    return {
      listaClientes: [],
      textoPesquisa: "",
      abrirLista: false,
      interval: ""
    }
  },
  computed: {
    ...mapGetters({
      dicionario: "getDicionario",
      ativo: "getAtivo",
      reqTeste: "getReqTeste",
      dominio: "getDominio"
    })
  },
  methods: {
    fecharLista(){
      setTimeout(() => {
        this.abrirLista = false
      }, 200)
    },
    pesquisando(){
      this.listaClientes = []
      if(this.textoPesquisa.length < 3){
        return
      }

      clearTimeout(this.interval)
      const timerInterval = 1000
      this.interval = setTimeout(() => {
        axios_api(`/get-client?busca=${this.textoPesquisa}&${this.reqTeste}`)
          .then(response => {
            console.log(response)
            this.listaClientes = response.data.clientes
          })
      }, timerInterval)

    },
    abrirAtivarCtt(){
      // Abrir atd_agenda
      this.$store.dispatch("setBlocker", true)
      this.$store.dispatch("setOrigemBlocker", "visualizar-iframe")

      const link = `${this.dominio}/im/atdHumano/view/atd_agenda.php`
      this.$root.$emit("abrir-iframe", link)
    },
    abrirAtivacao(cli){
      console.log(cli)
      if(cli.msg_ret){
        return
      }

      this.$store.dispatch("setAtendimentoAtivo", {})
      this.$store.dispatch("setIdAtendimentoAtivo", "")

      this.$store.dispatch("setAbrirPreviaCliente", true)
      this.$store.dispatch("setObjPreviaCli", cli)

    }
  }
}
</script>

<style>

</style>
