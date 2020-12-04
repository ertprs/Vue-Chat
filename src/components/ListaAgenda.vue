<template>
  <div class="lista-agenda">
    <div class="lista-agenda--titulo">
      <div :class="{'fechado' : fechado}">
        <font-awesome-icon :icon="['fas', 'address-book']" :title="dicionario.sub_titulo_agenda" />
      </div>
      <transition name="fade">
        <h2 v-show="!fechado" v-text="dicionario.sub_titulo_agenda"></h2>
      </transition>
    </div>
    <ul :class="{'fechado' : fechado}" v-if="minhaAgenda && minhaAgenda.length">
      <li
        v-for="(atd, indice) in minhaAgenda"
        :key="'id_'+indice"
        :id="'li_'+indice"
        :title="atd.nome_usu"
        @click="ativarCliente(atd.login_usu, atd.grupo, atd)"
      >
        <div class="circulo-contatos">
          <p v-text="acionaFormataSigla(atd.nome_usu[0], 'upper')"></p>
          <p v-if="fechado" v-text="acionaFormataSigla(atd.nome_usu[1], 'lower')"></p>
        </div>
        <template v-if="!fechado">{{ atd.nome_usu }}</template>
        <div class="retorno-container" :id="'retorno_'+indice" v-if="!fechado">
          <span class="data-retorno" v-text="atd.data_agenda_formatada || acionaFormataDataAgenda(atd.data_agenda, atd.hora_agenda, atd)"></span>
          <span class="contador-data-retorno d-none">
            <font-awesome-icon :icon="['fas', 'stopwatch']" />
            {{ acionaFormataDataAgenda(atd.data_agenda, atd.hora_agenda, atd, "retorno", `#retorno_${indice}`) }}
          </span>
        </div>
      </li>
    </ul>
    <div class="lista-vazia" v-else>
      <p v-text="dicionario.msg_sem_agenda"></p>
    </div>
  </div>
</template>
<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
<script>

import axios_api from '@/services/serviceAxios'
import { mapGetters } from "vuex"

import { formataSigla, formataDataAgenda } from "@/services/formatacaoDeTextos"
import { executandoEncerrar, liberarEncerrar } from '@/services/atendimentos'
import { limparIframeUsuarioRemovido } from "@/services/iframe"

export default {
  props: ["fechado"],
  computed: {
    ...mapGetters({
      dicionario: "getDicionario",
      reqTeste: "getReqTeste",
      minhaAgenda: "getAgenda",
      todosAtendimentos: "getTodosAtendimentos"
    })
  },
  data(){
    return{
      reqEmAndamento: false
    }
  },
  mounted(){
    this.$root.$on("req-agenda", () => {
      this.reqAgenda()
    })
  },
  watch: {
    minhaAgenda(){
      this.minhaAgenda.map(atd => {
        for(let ramal in this.todosAtendimentos){
          if(this.todosAtendimentos[ramal].login_usu == atd.login_usu){
            this.removerCliente(atd.login_usu)
          }
        }
      })
    }
  },
  methods: {
    removerCliente(loginUsuComparativo){
      let objAtdAux = {}
      for(let ramal in this.todosAtendimentos){
        if(this.todosAtendimentos[ramal].login_usu != loginUsuComparativo){
          objAtdAux[ramal] = this.todosAtendimentos[ramal]
        }
      }

      const regex = /\s|\]|\[|\!|\@|\$|\%|\&|\*|\(|\)|\-|\_|\=|\+|\./g
      const idIframe = loginUsuComparativo.replace(regex, "")

      limparIframeUsuarioRemovido(`iframe_${idIframe}`)
      this.$store.dispatch("setAtendimentos", objAtdAux)

      if(!objAtdAux || !Object.keys(objAtdAux).length){
        this.$store.dispatch("setCaso", 206)
      }

      this.$forceUpdate()
    },
    async reqAgenda(){

      executandoEncerrar()

      await axios_api.get(`get-agenda?${this.reqTeste}`)
        .then(response => {
          const arrAgenda = response.data.ret
          this.$store.dispatch("setAgenda", arrAgenda)

          this.minhaAgenda.map(atd => {
            for(let ramal in this.todosAtendimentos){
              if(this.todosAtendimentos[ramal].login_usu == atd.login_usu){
                this.removerCliente(atd.login_usu)
              }
            }
          })
        })
        .catch(error => {
          console.log("error get agenda: ", error)
        })

      liberarEncerrar()
    },
    async ativarCliente(id, grupo, atd){
      if(!id || !grupo){
        this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        console.log("parametros da funcao ativar cliente nao estao de acordo com o esperado")
        return
      }

      if(this.reqEmAndamento){
        return
      }else{
        this.reqEmAndamento = true
      }

      let data = {
        login_usu: id,
        grupo: grupo
      }

      await axios_api.post(`start-contato?${this.reqTeste}`, data)
        .then((response) => {
          if(response.data.st_ret == "OK"){
            this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_aguarde_ativar_cliente})

            let agendaAux = this.minhaAgenda
            agendaAux = agendaAux.filter(atd => {
              return atd.login_usu != id
            })
            this.$store.dispatch("setAgenda", agendaAux)

          }else if(response.data.st_ret == "AVISO"){
            this.$toasted.global.emConstrucao({msg: response.data.msg_ret || this.dicionario.msg_erro_ativar_cliente})
          }
        })
        .catch(error => {
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        })

      this.reqEmAndamento = false
    },
    acionaFormataDataAgenda(data, hora, atd, retorno, id){
      return formataDataAgenda(data, hora, atd, retorno, id)
    },
    acionaFormataSigla(letra, acao){
      return formataSigla(letra, acao)
    }
  }
}
</script>

<style>

</style>
