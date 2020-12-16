<template>
  <div class="badges-container">
    <div class="lista-badges"  v-if="gerenciador.length">
      <div v-for="(tipo, index) in gerenciador" :key="index">
        <div
          v-if="tipo.cod != 3 && tipo.cod != 4"
          :style="`background: ${tipo.cor}`"
          :class="{'fila' : tipo.cod == 1,
          'respondeu' : tipo.cod == 2}"
          :title="`${tipo.texto} - ${tipo.count}`">
          <span v-text="tipo.texto" v-if="!estado"></span>
          <span v-text="tipo.count"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: {
    estado: {
      required: true
    }
  },
  computed: {
    ...mapGetters({
      gerenciador: "getGerenciador",
      ativo: "getAtivo",
      dicionario: "getDicionario"
    })
  }
}
</script>
