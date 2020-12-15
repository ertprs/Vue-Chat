<template>
  <div class="badges-container">
    <div v-for="(tipo, index) in gerenciador" :key="index">
      <div v-if="true" :style="`background: ${tipo.cor}`" :class="{'fila' : tipo.cod == 1, 'respondeu' : tipo.cod == 2, 'todos' : tipo.cod == 3, 'pessoal' : tipo.cod == 4}">
        <span v-text="tipo.texto"></span>
        <span v-text="tipo.count"></span>
      </div>
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
