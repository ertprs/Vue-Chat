<template>
    <ul 
      id="menu-botao-direito"
      v-if="menuBotaoDireito"
      ref="menu"
      @blur="fecharMenu()"
      :style="`top: ${top}; left: ${left}`"
      tabindex="-1">
      <template v-if="regras.button_transfer">
        <li v-if="regras.button_transfer.use == 'S'" :title="regras.button_transfer.name" @click="abrirPopup('Transferir')"> {{ regras.button_transfer.name }} </li>
      </template>
      <template v-if="regras.button_suspend">
        <li v-if="regras.button_suspend.use == 'S'" :title="regras.button_suspend.name" @click="abrirPopup('Retornar')"> {{ regras.button_suspend.name }} </li>
      </template>
      <template v-if="regras.button_end">
        <li v-if="regras.button_end.use == 'S'" :title="regras.button_end.name" @click="abrirPopup('Encerrar')"> {{ regras.button_end.name }} </li>
      </template>
    </ul>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters({
      menuBotaoDireito: "getMenuBotaoDireito",
      regrasClienteAtivo: "getRegrasDoClienteAtivo"
    })
  },
  mounted(){
    this.$root.$on("abrir-menu", (ev) => {
      this.abrirMenu(ev)
    })
  },
  data(){
    return{
      top: "0px",
      left: "0px",
      regras: ""
    }
  },
  watch: {
    regrasClienteAtivo(){
      this.preencherRegrasDoClienteAtivo()
    }
  },
  methods: {
    preencherRegrasDoClienteAtivo(){
      if(this.regrasClienteAtivo){
        if(this.regrasClienteAtivo.regras){
          this.regras = this.regrasClienteAtivo.regras
        }
      }
    },
    abrirPopup(origem){
      switch (origem){
        case "Transferir":
          this.$root.$emit("abrir-transferir")
        break;
        case "Retornar":
          this.$root.$emit("abrir-retornar")
        break;
        case "Encerrar":
          this.$root.$emit("abrir-encerrar")
        break;
      }

      this.fecharMenu()
    },
    setMenu(top, left){
      let maiorAltura = window.innerHeight - this.$refs.menu.offsetHeight - 25
      let maiorLargura = window.innerWidth - this.$refs.menu.offsetWidth - 25

      if(top > maiorAltura){
        top = maiorAltura
      }

      if(left > maiorLargura){
        left = maiorLargura
      }

      this.top = top + "px"
      this.left = left + "px"
    },
    fecharMenu(){
      this.$store.dispatch("setMenuBotaoDireito", false)
    },
    abrirMenu(ev){
      this.$store.dispatch("setMenuBotaoDireito", true)

      this.$nextTick(() => {
        this.$refs.menu.focus()

        this.setMenu(ev.y, ev.x)
      })
      ev.preventDefault()
     }
  }
}
</script>
