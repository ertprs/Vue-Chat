<template>
  <div v-if="caso !== 400" class="container-listas-aguardando" :class="{'fechado' : fechado}">
    <div class="fieldset-container-abas" :class="{'fechado' : fechado}">
      <div v-on:click="alternarAbaAberta('pessoal')" class="fieldset-abas" :class="{'ativo' : abaAberta == 'pessoal'}">
        <h4 :title="dicionario.sub_titulo_pessoal">
          {{ dicionario.sub_titulo_pessoal }}
        </h4>
        <div v-if="!fechado && contadorAguardando" class="container-contador">
          <span :title="dicionario.title_total_clientes" class="total-clientes" v-text="contadorAguardando"></span>
        </div>
      </div>
      <div v-on:click="alternarAbaAberta('todos')" class="fieldset-abas" :class="{'ativo' : abaAberta == 'todos'}">
        <h4 :title="dicionario.sub_titulo_todos" v-text="dicionario.sub_titulo_todos"></h4>
        <div v-if="!fechado && contadorTodos" class="container-contador">
          <span :title="dicionario.title_total_clientes" class="total-clientes" v-text="contadorTodos"></span>
        </div>
      </div>
    </div>
    <div class="lista-aguardando" v-if="abaAberta == 'pessoal'">
      <ul :class="{'fechado' : fechado}" v-if="aguardando.length">
        <li
          v-for="(atd, indice) in aguardando"
          :key="'id_'+indice"
          :id="'li_'+indice"
          :title="atd.nome_usu"
          @click="ativarCliente(atd.login_usu, atd.grupo, atd, 'aguardando')"
        >
          <div class="circulo-contatos">
            <p v-text="acionaFormataSigla(atd.nome_usu[0], 'upper')"></p>
            <p v-if="fechado" v-text="acionaFormataSigla(atd.nome_usu[1], 'lower')"></p>
          </div>
          <template v-if="!fechado">{{ atd.nome_usu }}</template>
        </li>
      </ul>
      <div class="lista-vazia com-borda" v-else>
        <p v-text="dicionario.msg_sem_agenda"></p>
      </div>
    </div>
    <div class="lista-aguardando" v-if="abaAberta == 'todos'">
      <ul :class="{'fechado' : fechado}" v-if="todos.length">
        <li
          v-for="(atd, indice) in todos"
          :key="'id_'+indice"
          :id="'li_'+indice"
          :title="atd.nome_usu"
          @click="ativarCliente(atd.login_usu, atd.grupo, atd, 'aguardando-todos')"
        >
          <div class="circulo-contatos">
            <p v-text="acionaFormataSigla(atd.nome_usu[0], 'upper')"></p>
            <p v-if="fechado" v-text="acionaFormataSigla(atd.nome_usu[1], 'lower')"></p>
          </div>
          <template v-if="!fechado">{{ atd.nome_usu }}</template>
        </li>
      </ul>
      <div class="lista-vazia com-borda" v-else>
        <p v-text="dicionario.msg_sem_agenda"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import { formataSigla } from "@/services/formatacaoDeTextos"
import axios_api from "@/services/serviceAxios";

export default {
  props: ["fechado"],
  computed: {
    ...mapGetters({
      todosAtendimentos: "getTodosAtendimentos",
      dicionario: "getDicionario",
      aguardando: "getAguardando",
      todos: "getTodos",
      reqTeste: "getReqTeste",
      caso: "getCaso",
      contadorAguardando: "getContadorAguardando",
      contadorTodos: "getContadorTodos"
    })
  },
  data(){
    return{
      abaAberta: "pessoal",
      limitadorRequisicoes: 0
    }
  },
  mounted(){
    this.$root.$on("req-aguardando", (origem, persistir) => {
      this.reqAguardando(origem, persistir)
    })
  },
  methods: {
    alternarAbaAberta(origem){

      if(this.abaAberta == origem){
        return
      }

      if(this.abaAberta == "pessoal"){
        this.abaAberta = "todos"
        this.$store.commit("setAbaSelecionada", "todos")
      }else{
        this.abaAberta = "pessoal"
        this.$store.commit("setAbaSelecionada", "pessoal")
      }

      this.reqAguardando(this.abaAberta)
    },
    reqAguardando(origem, persistir){
      axios_api.get(`get-aguardando?${this.reqTeste}&aba=${origem}`)
      .then(response => {
        if(response.data){
          if(response.data.ret){
            const arr = response.data.ret
            if(origem == "pessoal"){

              let novosAtds = {}
              this.aguardando.map(atd => {
                for(let ramal in this.todosAtendimentos){
                  if(this.todosAtendimentos[ramal].login_usu != atd.login_usu){
                    novosAtds[ramal] = this.todosAtendimentos[ramal]
                  }
                }
              })

              if(novosAtds.length){
                this.$store.dispatch("setTodosAtendimentos", novosAtds)
              }

              this.$store.dispatch("setAguardando", arr)
              this.$store.dispatch("setContadorAguardando", arr.length)
            }else{
              let novosAtds = {}
              this.todos.map(atd => {
                for(let ramal in this.todosAtendimentos){
                  if(this.todosAtendimentos[ramal].login_usu != atd.login_usu){
                    novosAtds[ramal] = this.todosAtendimentos[ramal]
                  }
                }
              })

              if(novosAtds.length){
                this.$store.dispatch("setTodosAtendimentos", novosAtds)
              }

              this.$store.dispatch("setTodos", arr)
              this.$store.dispatch("setContadorTodos", arr.length)
            }

            this.limitadorRequisicoes = 0
          }
        }
      })
      .catch(error => {
        if(persistir){
          this.limitadorRequisicoes++
          if(this.limitadorRequisicoes < 10){
            setTimeout(() => {
              this.reqAguardando(origem, persistir)
            }, 1000)
          }else{
            console.log('error get aguardando: ', error)
          }
        }else{
          console.log('error get aguardando: ', error)
        }
      })
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
              this.$store.dispatch("setContadorAguardando", aguardandoAux.length)
            }else if(origem == "aguardando-todos"){
              let todosAux = this.todos
              todosAux = todosAux.filter((atendimento) => {
                return atendimento.id_cli != atd.id_cli
              })
              this.$store.dispatch("setTodos", todosAux)
              this.$store.dispatch("setContadorTodos", todosAux.length)
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
    acionaFormataSigla(letra, acao){
      return formataSigla(letra, acao)
    }
  },
  beforeDestroy(){
    this.$root.$off("req-aguardando")
  }
}
</script>

<style>

</style>
