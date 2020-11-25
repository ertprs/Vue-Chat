<template>
  <div class="lista-agenda">
    <div class="lista-agenda--titulo">
      <div :class="{'fechado' : fechado}">
        <i class="far fa-address-book"  :title="dicionario.sub_titulo_agenda"></i>
      </div>
      <transition name="fade">
        <h2 v-show="!fechado" >
          {{ dicionario.sub_titulo_agenda }}
        </h2>
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
          <p>{{ formataSigla(atd.nome_usu[0], 'upper') }}</p>
          <p v-if="fechado">{{ formataSigla(atd.nome_usu[1], 'lower') }}</p>
        </div>
        <template v-if="!fechado">{{ atd.nome_usu }}</template>
        <div class="retorno-container" :id="'retorno_'+indice" v-if="!fechado">
          <span class="data-retorno">{{ atd.data_agenda_formatada || formataData(atd.data_agenda, atd.hora_agenda, atd) }}</span>
          <span class="contador-data-retorno d-none"><i class="fas fa-stopwatch"></i>{{ formataData(atd.data_agenda, atd.hora_agenda, atd, "retorno", `#retorno_${indice}`) }}</span>
        </div>
      </li>
    </ul>
    <div class="lista-vazia" v-else>
      <p> {{ dicionario.msg_sem_agenda }} </p>
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

export default {
  props: ["fechado"],
  computed: {
    ...mapGetters({
      dicionario: "getDicionario",
      reqTeste: "getReqTeste",
      minhaAgenda: "getAgenda"
    })
  },
  data(){
    return{
      reqEmAndamento: false
    }
  },
  methods: {
    ativarCliente(id, grupo, atd){
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

            let agendaAux = this.minhaAgenda
            agendaAux = agendaAux.filter((atendimento) => {
              return atendimento.id_cli != atd.id_cli
            })
            this.$store.dispatch("setAgenda", agendaAux)

          }else if(response.data.st_ret == "AVISO"){
            this.$toasted.global.emConstrucao({msg: response.data.msg_ret || this.dicionario.msg_erro_ativar_cliente})
          }
        })
        .catch(error => {
          this.reqEmAndamento = false
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        })
    },
    formataData(data, hora, atd, retorno, id){

      if(!data || !hora){
        return
      }

      if(retorno){
        if(!id || !atd){
          return
        }
      }

      let dataAux = data
      let horaAux = hora

      if(!retorno){
        dataAux = dataAux.replace(/-/g, "\/")
        dataAux = dataAux.split(/\//)
        dataAux = dataAux.reverse()
        dataAux = dataAux.join("/")

        horaAux = horaAux.replace(/:/g, "h")
        horaAux = horaAux.slice(0, horaAux.length-3)

        if(typeof(atd) == "object"){
          atd.data_agenda_formatada = dataAux + ' ' + horaAux
        }

        return dataAux + ' ' + horaAux
      }else{

        const spanContador = document.querySelector(`${id} span.contador-data-retorno`)
        if(!spanContador){
          return
        }

        // Diferenca entre dias
        let dataAux2 = data + " " + hora
        let dataAtual = new Date()
        let dataAgenda = new Date(dataAux2)

        let difDatas = Date.UTC(dataAgenda.getYear(), dataAgenda.getMonth(), dataAgenda.getDate(),0,0,0) - Date.UTC(dataAtual.getYear(), dataAtual.getMonth(), dataAtual.getDate(),0,0,0)
        // Retorna o valor em horas
        difDatas = difDatas / 1000 / 60 / 60
        // Retorna o valor em dias
        difDatas = difDatas / 24

        // Mesmo dia
        if(difDatas == 0){
          // Diferenca entre horarios
          let difHoras = dataAgenda.getHours() - dataAtual.getHours()
          let difMinutos = dataAgenda.getMinutes() - dataAtual.getMinutes()

          // Significa que os horarios estao em horas diferentes (ex: 11:00:00 e 10:59:59)
          if(difHoras > 0 || difHoras < 0){
            // Significa que os minutos do horario atual sao maiores do que os minutos do horario agendado
            if(difMinutos < 0){
              difMinutos = 60 - Math.abs(difMinutos)
              difHoras = difHoras - 1
            }
            if(difHoras == 0){
              spanContador.classList.remove("d-none")
              return `${difMinutos}min`
            }else{
              // Significa que o horário já passou
              if(difHoras < 0){
                return
              }
              spanContador.classList.remove("d-none")
              if(difMinutos > 0){
                return `${difHoras}h e ${difMinutos}min`
              }else{
                return `${difHoras}h`
              }
            }
          }else{

            // Significa que chegou a hora de chamar o ctt
            if(difHoras == 0 && difMinutos == 0){
              spanContador.classList.add("d-none")

              return
            }

            // Significa que o horario agendado ja passou
            if(difHoras <= 0 && difMinutos < 0){
              spanContador.classList.add("d-none")
              return
            }

            // Significa que o horario ainda nao chegou
            spanContador.classList.remove("d-none")
            return `${difMinutos}min`
          }
        }else{
          // Dias diferentes
          // Data atual maior que data agendada
          if(difDatas < 0){
            spanContador.classList.add("d-none")
            return
          }else{
          // Data agendado maior que data atual
            spanContador.classList.remove("d-none")

            if(difDatas == 1){
              return `${difDatas} dia`
            }else{
              return `${difDatas} dias`
            }
          }
        }
      }
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
