<template>
  <div class="badges-container">
    <div v-for="(tipo, index) in gerenciador" :key="index">
      <span v-text="tipo.texto"></span>
      <span v-text="tipo.count"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters({
      gerenciador: "getGerenciador"
    })
  }
}
</script>
