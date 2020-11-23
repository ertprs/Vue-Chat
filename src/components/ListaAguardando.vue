<template>
  <div>
    <div class="lista-aguardando--titulo" :class="{'fechado' : fechado}" v-if="caso !== 400 && aguardando && aguardando.length">
      <div :class="{'fechado' : fechado}">
        <i class="far fa-address-book"  :title="dicionario.sub_titulo_aguardando"></i>
      </div>
      <transition name="fade">
        <h2 v-show="!fechado" >
          {{ dicionario.sub_titulo_aguardando }}
        </h2>
      </transition>
    </div>
    <div class="fieldset-container-abas" :class="{'fechado' : fechado}">
      <div class="fieldset-abas" :class="{'fechado' : fechado}" v-if="caso !== 400 && aguardando && aguardando.length">
        <h4 v-on:click="alternarAbaAberta()">
          {{ dicionario.sub_titulo_pessoal }}
        </h4>
      </div>
      <div class="fieldset-abas" :class="{'fechado' : fechado}" v-if="caso !== 400 && aguardando && aguardando.length">
        <h4 v-on:click="alternarAbaAberta()">
          {{ dicionario.sub_titulo_todos }}
        </h4>
      </div>
    </div>
    <div class="lista-aguardando" v-if="aguardando && aguardando.length">
      <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta !== 'todos'}">
        <li
          v-for="(atd, indice) in aguardando"
          :key="'id_'+indice"
          :id="'li_'+indice"
          :title="atd.nome_usu"
          @click="ativarCliente(atd.login_usu, atd.grupo, atd, 'aguardando')"
        >
          <div class="circulo-contatos">
            <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
            <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
          </div>
          <template v-if="!fechado">{{ atd.nome_usu }}</template>
        </li>
      </ul>
    </div>
    <div class="lista-aguardando" v-if="aguardando && aguardando.length">
      <ul :class="{'fechado' : fechado, 'aba-fechada' : abaAberta !== 'pessoal'}">
        <li
          v-for="(atd, indice) in aguardando"
          :key="'id_'+indice"
          :id="'li_'+indice"
          :title="atd.nome_usu"
          @click="ativarCliente(atd.login_usu, atd.grupo, atd, 'aguardando')"
        >
          <div class="circulo-contatos">
            <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
            <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
          </div>
          <template v-if="!fechado">{{ atd.nome_usu }}</template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import axios_api from "@/services/serviceAxios";

export default {
  props: ["fechado"],
  computed: {
    ...mapGetters({
      dicionario: "getDicionario",
      aguardando: "getAguardando",
      reqTeste: "getReqTeste",
      caso: "getCaso"
    })
  },
  data(){
    return{
      abaAberta: "pessoal"
    }
  },
  methods: {
    alternarAbaAberta(){
      if(this.abaAberta == "pessoal"){
        this.abaAberta = "todos"
      }else{
        this.abaAberta = "pessoal"
      }
    },
    ativarCliente(id, grupo, atd, origem){
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

      axios_api.post(`start-contato?${this.reqTeste}`, data)
        .then((response) => {
          this.reqEmAndamento = false
          if(response.data.st_ret == "OK"){
            this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_aguarde_ativar_cliente})
            // Remover do aguardando
            if(origem == "aguardando"){
              let aguardandoAux = this.aguardando
              aguardandoAux = aguardandoAux.filter((atendimento) => {
                return atendimento.id_cli != atd.id_cli
              })
              this.$store.dispatch("setAguardando", aguardandoAux)
            }else if(origem == "agenda"){
              let agendaAux = this.minhaAgenda
              agendaAux = agendaAux.filter((atendimento) => {
                return atendimento.id_cli != atd.id_cli
              })
              this.$store.dispatch("setAgenda", agendaAux)
            }
          }else if(response.data.st_ret == "AVISO"){
            this.$toasted.global.emConstrucao({msg: response.data.msg_ret || this.dicionario.msg_erro_ativar_cliente})
          }
        })
        .catch(error => {
          this.reqEmAndamento = false
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        })
    },
    formataSigla(letra, acao){
      if(!letra){ return }
      if(acao == 'upper'){
        return letra.toUpperCase()
      }else if(acao == 'lower'){
        return letra.toLowerCase()
      }
    }
  }
}
</script>

<style>

</style>
