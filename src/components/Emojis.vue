<template>
  <div id="emoji-container">
    <div class="lista-emoji" v-if="abrirEmojis" :class="{'z-index-2' : abrirEmojis}">
      <ul>
        <li
          v-for="(objEmoji, indice) in emojis"
          :key="indice"
          v-on:click="adicionarEmoji(objEmoji.emoji)"
        >{{ objEmoji.emoji }}</li>
      </ul>
    </div>
    <div
      class="btn-emoji"
      v-on:click="selecionarEmoji()"
      :class="{'z-index-2' : abrirEmojis}"
    >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters({
      emojis: "getEmojis",
      abrirEmojis: "getAbrirEmojis"
    })
  },
  methods: {
    adicionarEmoji(emoji){
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
