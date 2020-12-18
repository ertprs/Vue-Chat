<template>
  <div class="container-historico-rodape">
    <div class="historico-grupos" v-if="objPreviaCli.grupos">
      <vue-select
        appendToBody
        :calculatePosition="calcularPosicao"
        :options="objPreviaCli.grupos"
        label="desc_grupo"
        v-model="objGrupo"
        @input="adicionarGrupo">
        <div slot="no-options" v-text="dicionario.msg_sem_resultados"></div>
      </vue-select>
    </div>
    <div class="historico-mensagens">
      <!-- Emojis(?), textarea, btn envio, btn msg formatada(?), anexo(?) -->
      <emojis :historico="true" />
      <div class="container-historico-textarea">
        <textarea id="historico-textarea"
          no-resize
          v-model="mensagem"
          :placeholder="dicionario.placeholder_textarea"
          ref="historico-textarea"
          @keydown.enter="enviarMsgEAtivarCliente($event)"
          rows="1">
        </textarea>
      </div>
      <div class="container-historico-botoes">
        <div class="historico-botao" :title="dicionario.title_enviar_msg" @click="enviarMsgEAtivarCliente">
          <font-awesome-icon :icon="['fas', 'paper-plane']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios_api from '@/services/serviceAxios'
import { mapGetters } from "vuex"

import Emojis from "../Emojis"
import vSelect from "vue-select"
import { createPopper, placements } from "@popperjs/core"

export default {
  components: {
    "vue-select" : vSelect,
    "emojis" : Emojis
  },
  data(){
    return {
      objGrupo: "",
      placement: "top",
      mensagem: ""
    }
  },
  computed: {
    ...mapGetters({
      objPreviaCli: "getObjPreviaCli",
      dicionario: "getDicionario",
      reqTeste: "getReqTeste"
    })
  },
  mounted() {
    this.initResize()

    this.$root.$on("adicionar-emoji-historico", objEmoji => {
      this.adicionarEmoji(objEmoji)
    })
  },
  methods: {
    enviarMsgEAtivarCliente(event){
      if(event){
        if(event.keyCode == 13 && !event.shiftKey){
          event.preventDefault()
        }
        if(event.shiftKey){
          return
        }
      }

      if(!this.objGrupo){
        this.$toasted.global.emConstrucao({msg: "Selecione um grupo"})
        return
      }

      this.mensagem = this.mensagem.replace(/<\/?[\d\w\s=\-:\.\/\'\";]+>/gi, ' ')
      this.mensagem = this.mensagem.trim()
      this.mensagem = this.mensagem.replace(/\n$/, "", this.mensagem)

      if(!this.mensagem){
        this.$toasted.global.emConstrucao({msg: "Digite uma mensagem"})
        return
      }

      const data = {
        login_usu: this.objPreviaCli.login_usu,
        grupo: this.objGrupo.grupo
      }

      axios_api.post(`start-contato?${this.reqTeste}`, data)
        .then((response) => {
          if(response.data.st_ret == "OK"){
            this.$toasted.global.defaultSuccess({msg: this.dicionario.msg_aguarde_ativar_cliente})
          }else if(response.data.st_ret == "AVISO"){
            this.$toasted.global.emConstrucao({msg: response.data.msg_ret || this.dicionario.msg_erro_ativar_cliente})
          }
        })
        .catch(error => {
          this.$toasted.global.defaultError({msg: this.dicionario.msg_erro_ativar_cliente})
        })

    },
    calcularPosicao(dropdownList, component, sizes){
      dropdownList.style.width = sizes.width

      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement
      })

      return () => popper.destroy()
    },
    adicionarGrupo(){
      console.log("grupo: ", this.objGrupo.grupo)
    },
    resetarTextarea() {
      const textarea = this.$refs["historico-textarea"]
      textarea.style.height = "35px"
    },
    initResize() {
      var observe;
      if (window.attachEvent) {
        observe = function (element, event, handler) {
          element.attachEvent("on" + event, handler);
        };
      } else {
        observe = function (element, event, handler) {
          element.addEventListener(event, handler, false);
        };
      }

      const textarea = this.$refs["historico-textarea"]

      const vm = this

      function resize() {
        if(!vm.mensagem){
          vm.resetarTextarea()
          return
        }
        textarea.style.height = textarea.scrollHeight + "px";
      }
      /* Timeout para garantir que estamos pegando o texto atualizado */
      function delayedResize() {
        window.setTimeout(resize, 0);
      }
      observe(textarea, "change", resize);
      observe(textarea, "cut", delayedResize);
      observe(textarea, "paste", delayedResize);
      observe(textarea, "drop", delayedResize);
      observe(textarea, "keydown", delayedResize);
    },
    adicionarEmoji(objEmoji) {
      const textarea = this.$refs["historico-textarea"]
      textarea.focus()
      const inicioCursor = textarea.selectionStart
      const fimCursor = textarea.selectionEnd

      this.mensagem = this.mensagem.slice(0, inicioCursor) + objEmoji.native + this.mensagem.slice(fimCursor)
    }
  }
}
</script>

<style>

</style>
