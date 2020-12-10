<template>
  <div id="emoji-container">
    <div
      class="btn-emoji"
      v-on:click="selecionarEmoji()"
      v-text="String.fromCodePoint(0x1f61c)"
      :class="{'z-index-2' : abrirEmojis}"
    >
    </div>
    <picker
      v-if="abrirEmojis"
      :showPreview="false"
      :skin="1"
      :native="true"
      :style="{ position: 'absolute', top: '-330px', left: '0', height: '325px', zIndex: '90' }"
      :i18n="textosEmojis"
      :perLine="7"
      :title="'Smart Channel Emojis'"
      @select="adicionarEmoji" />
  </div>
</template>

<script>

// npm install emoji-mart-vue
import { Picker } from 'emoji-mart-vue'

import { mapGetters } from "vuex"

export default {
  components: {
    "picker" : Picker
  },
  computed: {
    ...mapGetters({
      abrirEmojis: "getAbrirEmojis"
    })
  },
  data(){
    return{
      textosEmojis: {
        search: "Pesquisar",
        notfound: "Nenhum emoji encontrado",
        categories: {
          search: "Resultados da pesquisa",
          recent: "Recentes",
          people: "Pessoas & Expressoes",
          nature: "Animais & Natureza",
          foods: "Comidas & Bebibas",
          places: "Viagens & Lugares",
          objects: "Objetos",
          symbols: "Simbolos",
          flags: "Bandeiras",
          custom: "Outros"
        }
      }
    }
  },
  methods: {
    adicionarEmoji(emoji){
      console.log(emoji.unified)
      this.$root.$emit("adicionar-emoji", emoji)
    },
    selecionarEmoji() {
      this.$store.dispatch("setOrigemBlocker", "chat");
      this.$store.dispatch("setAbrirEmojis", !this.abrirEmojis)
      this.$store.dispatch("setBlocker", this.abrirEmojis);
    }
  }
}
</script>

<style>

</style>
